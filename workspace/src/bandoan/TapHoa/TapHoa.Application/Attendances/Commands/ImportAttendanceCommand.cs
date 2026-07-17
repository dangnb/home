using MediatR;
using Microsoft.EntityFrameworkCore;
using MiniExcelLibs;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Attendances.Commands;

public class ImportAttendanceCommand : IRequest<ImportAttendanceResult>
{
    public Stream FileStream { get; set; } = null!;
}

public class ImportAttendanceResult
{
    public int SuccessCount { get; set; }
    public int ErrorCount { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class ImportAttendanceRowDto
{
    public string? Username { get; set; }
    public DateTime? Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string? Notes { get; set; }
}

public class ImportAttendanceCommandHandler : IRequestHandler<ImportAttendanceCommand, ImportAttendanceResult>
{
    private readonly IApplicationDbContext _context;

    public ImportAttendanceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ImportAttendanceResult> Handle(ImportAttendanceCommand request, CancellationToken cancellationToken)
    {
        var result = new ImportAttendanceResult();

        // 1. Read Excel using MiniExcel
        var rows = request.FileStream.Query<ImportAttendanceRowDto>().ToList();

        if (rows == null || !rows.Any())
        {
            result.Errors.Add("File không có dữ liệu.");
            result.ErrorCount = 1;
            return result;
        }

        var usernames = rows.Where(r => !string.IsNullOrWhiteSpace(r.Username)).Select(r => r.Username).Distinct().ToList();
        
        // Optimize: Fetch all relevant existing attendances
        var minDate = rows.Where(r => r.Date.HasValue).Min(r => r.Date);
        var maxDate = rows.Where(r => r.Date.HasValue).Max(r => r.Date);
        
        var existingAttendances = await _context.Attendances
            .Where(a => usernames.Contains(a.Username) && a.Date >= minDate && a.Date <= maxDate)
            .ToListAsync(cancellationToken);

        int rowIndex = 1; // Header is 1, data starts at 2 usually if strictly typed, but let's count from 1 for data
        foreach (var row in rows)
        {
            rowIndex++;
            
            if (string.IsNullOrWhiteSpace(row.Username))
            {
                result.Errors.Add($"Dòng {rowIndex}: Username không được để trống.");
                result.ErrorCount++;
                continue;
            }

            if (!row.Date.HasValue)
            {
                result.Errors.Add($"Dòng {rowIndex}: Date không được để trống.");
                result.ErrorCount++;
                continue;
            }

            var date = row.Date.Value.Date;
            
            // Tìm xem đã có chấm công ngày này chưa
            var existing = existingAttendances.FirstOrDefault(a => a.Username == row.Username && a.Date == date);

            try
            {
                decimal totalHours = 0;
                decimal overtimeHours = 0;
                int lateMinutes = 0;
                int earlyLeaveMinutes = 0;
                AttendanceStatus status = AttendanceStatus.Present;

                // Tính toán giờ làm nếu có CheckIn và CheckOut
                if (row.CheckIn.HasValue && row.CheckOut.HasValue)
                {
                    var worked = (decimal)(row.CheckOut.Value - row.CheckIn.Value).TotalHours;
                    totalHours = Math.Round(Math.Max(0, worked), 2);
                    overtimeHours = Math.Round(Math.Max(0, totalHours - 8m), 2); // default 8h/day
                }

                if (existing != null)
                {
                    // Cập nhật
                    existing.Update(row.CheckIn, row.CheckOut, totalHours, overtimeHours, lateMinutes, earlyLeaveMinutes, status, row.Notes);
                }
                else
                {
                    // Thêm mới
                    var newAttendance = Attendance.CreateManual(
                        row.Username, 
                        date, 
                        row.CheckIn, 
                        row.CheckOut, 
                        totalHours, 
                        overtimeHours, 
                        lateMinutes, 
                        earlyLeaveMinutes, 
                        status, 
                        row.Notes
                    );
                    _context.Attendances.Add(newAttendance);
                    existingAttendances.Add(newAttendance); // Add to local cache to prevent duplicates within the same file
                }

                result.SuccessCount++;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Dòng {rowIndex}: Lỗi xử lý - {ex.Message}");
                result.ErrorCount++;
            }
        }

        if (result.SuccessCount > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        return result;
    }
}
