using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Employees.Commands;

public record ImportEmployeeItemDto
{
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Username { get; init; }
    public string? Password { get; init; }
    public string? Phone { get; init; }
    public string? JobTitle { get; init; }
    public long? DepartmentId { get; init; }
    public string? DepartmentName { get; init; }
    public Gender Gender { get; init; } = Gender.OTHER;
    public DateOnly? DateOfBirth { get; init; }
    public string? IdCardNumber { get; init; }
    public DateOnly? JoinedDate { get; init; }
}

public record ImportEmployeesResultDto
{
    public int Total { get; init; }
    public int SuccessCount { get; init; }
    public int FailureCount { get; init; }
    public List<string> Errors { get; init; } = new();
    public List<long> CreatedIds { get; init; } = new();
}

public record ImportEmployeesCommand : IRequest<ImportEmployeesResultDto>
{
    public List<ImportEmployeeItemDto> Items { get; init; } = new();
}

public class ImportEmployeesCommandHandler : IRequestHandler<ImportEmployeesCommand, ImportEmployeesResultDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ImportEmployeesCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<ImportEmployeesResultDto> Handle(ImportEmployeesCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        if (request.Items == null || request.Items.Count == 0)
        {
            return new ImportEmployeesResultDto
            {
                Total = 0,
                SuccessCount = 0,
                FailureCount = 0,
                Errors = new List<string> { "Không có dữ liệu nhân sự nào được gửi lên." }
            };
        }

        // Tải danh sách phòng ban hiện tại của Tenant để ánh xạ
        var departments = await _context.Departments
            .Where(d => d.TenantId == tenantId && d.Status != EntityStatus.DELETED)
            .ToListAsync(cancellationToken);

        // Tải danh sách username và email hiện tại để kiểm tra trùng
        var existingUsernames = await _context.Users
            .Select(u => u.Username.ToLower())
            .ToHashSetAsync(cancellationToken);

        var existingEmails = await _context.Users
            .Select(u => u.Email.ToLower())
            .ToHashSetAsync(cancellationToken);

        var defaultRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Code == "EMPLOYEE", cancellationToken);

        var errors = new List<string>();
        var createdIds = new List<long>();
        var successCount = 0;
        var failureCount = 0;

        for (int i = 0; i < request.Items.Count; i++)
        {
            var item = request.Items[i];
            int rowNumber = i + 1;

            if (string.IsNullOrWhiteSpace(item.FullName))
            {
                errors.Add($"Dòng {rowNumber}: Thiếu thông tin Họ và tên.");
                failureCount++;
                continue;
            }

            if (string.IsNullOrWhiteSpace(item.Email))
            {
                errors.Add($"Dòng {rowNumber}: Thiếu địa chỉ Email.");
                failureCount++;
                continue;
            }

            var cleanEmail = item.Email.Trim().ToLowerInvariant();
            if (existingEmails.Contains(cleanEmail))
            {
                errors.Add($"Dòng {rowNumber}: Email '{cleanEmail}' đã tồn tại trong hệ thống.");
                failureCount++;
                continue;
            }

            // Tự sinh username nếu không có
            string cleanUsername = (item.Username ?? string.Empty).Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(cleanUsername))
            {
                cleanUsername = cleanEmail.Split('@')[0];
                // Nếu username sinh ra đã tồn tại, thêm hậu tố số ngẫu nhiên
                if (existingUsernames.Contains(cleanUsername))
                {
                    cleanUsername = $"{cleanUsername}{new Random().Next(100, 999)}";
                }
            }

            if (existingUsernames.Contains(cleanUsername))
            {
                errors.Add($"Dòng {rowNumber}: Tên đăng nhập '{cleanUsername}' đã tồn tại.");
                failureCount++;
                continue;
            }

            // Xác định phòng ban
            long? deptId = item.DepartmentId;
            if (!deptId.HasValue && !string.IsNullOrWhiteSpace(item.DepartmentName))
            {
                var matchDept = departments.FirstOrDefault(d => 
                    string.Equals(d.Name.Trim(), item.DepartmentName.Trim(), StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(d.Code.Trim(), item.DepartmentName.Trim(), StringComparison.OrdinalIgnoreCase));
                if (matchDept != null)
                {
                    deptId = matchDept.Id;
                }
            }

            string password = !string.IsNullOrWhiteSpace(item.Password) ? item.Password : "123456";
            string jobTitle = !string.IsNullOrWhiteSpace(item.JobTitle) ? item.JobTitle.Trim() : "Nhân viên";

            // Tạo User qua Factory Method
            var user = User.Create(
                tenantId: tenantId,
                username: cleanUsername,
                email: cleanEmail,
                passwordHash: BCrypt.Net.BCrypt.HashPassword(password),
                fullName: item.FullName,
                phone: item.Phone
            );

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            // Ghi nhận username & email đã dùng
            existingUsernames.Add(cleanUsername);
            existingEmails.Add(cleanEmail);

            // Tạo EmployeeProfile qua Factory Method
            var profile = EmployeeProfile.Create(
                tenantId: tenantId,
                userId: user.Id,
                jobTitle: jobTitle,
                gender: item.Gender,
                departmentId: deptId,
                dateOfBirth: item.DateOfBirth,
                idCardNumber: item.IdCardNumber,
                joinedDate: item.JoinedDate
            );

            _context.EmployeeProfiles.Add(profile);

            // Gán Role mặc định
            if (defaultRole != null)
            {
                var userRole = UserRole.Create(user.Id, defaultRole.Id, tenantId);
                _context.UserRoles.Add(userRole);
            }

            await _context.SaveChangesAsync(cancellationToken);

            createdIds.Add(profile.Id);
            successCount++;
        }

        return new ImportEmployeesResultDto
        {
            Total = request.Items.Count,
            SuccessCount = successCount,
            FailureCount = failureCount,
            Errors = errors,
            CreatedIds = createdIds
        };
    }
}
