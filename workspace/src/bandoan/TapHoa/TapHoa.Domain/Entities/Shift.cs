using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public enum ShiftStatus
{
    Open = 1,
    Closed = 2
}

public class Shift : BaseAuditableEntity<Guid>
{
    public string Username { get; private set; } // Identifies who owns the shift
    public DateTime StartTime { get; private set; }
    public DateTime? EndTime { get; private set; }
    
    public decimal StartingCash { get; private set; } // Tiền lẻ đầu ca
    public decimal? ExpectedCash { get; private set; } // Hệ thống tính: StartingCash + Doanh thu tiền mặt
    public decimal? ActualCash { get; private set; } // Nhân viên đếm và nhập vào cuối ca
    public decimal? Difference { get; private set; } // ActualCash - ExpectedCash
    
    public string? Notes { get; private set; }
    
    public ShiftStatus Status { get; private set; }

    private Shift() { } // For EF Core

    public Shift(string username, decimal startingCash)
    {
        Id = Guid.NewGuid();
        Username = username;
        StartTime = DateTime.UtcNow;
        StartingCash = startingCash;
        Status = ShiftStatus.Open;
    }

    public void CloseShift(decimal actualCash, decimal expectedCash, string? notes)
    {
        if (Status == ShiftStatus.Closed)
            throw new InvalidOperationException("Shift is already closed.");

        EndTime = DateTime.UtcNow;
        ActualCash = actualCash;
        ExpectedCash = expectedCash;
        Difference = actualCash - expectedCash;
        Notes = notes;
        Status = ShiftStatus.Closed;
    }
}
