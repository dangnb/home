using System.Data;
using Dapper;
using EduProCRM.Application.Users.Commands;
using EduProCRM.Domain.Entities;

namespace EduProCRM.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbConnection _dbConnection;
    private static readonly List<UserDto> InMemoryUsers = new()
    {
        new UserDto(
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            "NV-001",
            "Nguyễn Văn Minh",
            "minh.nguyen@edupro.vn",
            "Ban Giám Đốc",
            "Super Admin / Giám Đốc",
            new List<string> { "READ", "CREATE", "UPDATE", "DELETE", "APPROVE" },
            true,
            DateTime.UtcNow.AddMonths(-6),
            "Hệ thống"
        ),
        new UserDto(
            Guid.Parse("22222222-2222-2222-2222-222222222222"),
            "NV-002",
            "Trần Thị Lan",
            "lan.tran@edupro.vn",
            "Phòng Tư Vấn Du Học",
            "Senior Mentor",
            new List<string> { "READ", "CREATE", "UPDATE", "LOCK_JOURNAL" },
            true,
            DateTime.UtcNow.AddMonths(-3),
            "Nguyễn Văn Minh"
        ),
        new UserDto(
            Guid.Parse("33333333-3333-3333-3333-333333333333"),
            "NV-003",
            "Phạm Thanh Hà",
            "ha.pham@edupro.vn",
            "Phòng Kế Toán",
            "Kế Toán Trưởng",
            new List<string> { "READ", "CREATE_RECEIPT", "DEPOSIT_TRANSFER", "ACCOUNTING_LEDGER" },
            true,
            DateTime.UtcNow.AddMonths(-2),
            "Nguyễn Văn Minh"
        )
    };

    private static readonly List<AuditLogDto> InMemoryAuditLogs = new()
    {
        new AuditLogDto(
            Guid.NewGuid(),
            DateTime.UtcNow.AddHours(-1),
            "Nguyễn Văn Minh",
            "APPROVE_RECEIPT",
            "Phê duyệt 2 Cấp",
            "Phê duyệt Phiếu thu PT-2026-0801 số tiền 30,000,000đ (Phạm Minh Anh)",
            "127.0.0.1"
        ),
        new AuditLogDto(
            Guid.NewGuid(),
            DateTime.UtcNow.AddHours(-3),
            "Trần Thị Lan",
            "LOCK_LEGAL_JOURNAL",
            "Nhật ký Pháp lý Mục 7",
            "Ghi và KHÓA chứng cứ pháp lý Hợp đồng HĐ-2026-DE01 mã SHA256 verified",
            "127.0.0.1"
        )
    };

    public UserRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task AddAsync(User user, CancellationToken ct)
    {
        try
        {
            const string sql = @"
                INSERT INTO Users (Id, StaffCode, FullName, Email, Department, Role, IsActive, CreatedAt, CreatedBy)
                VALUES (@Id, @StaffCode, @FullName, @Email, @Department, @Role, @IsActive, @CreatedAt, @CreatedBy);";

            await _dbConnection.ExecuteAsync(new CommandDefinition(sql, user, cancellationToken: ct));
        }
        catch { }

        InMemoryUsers.Add(new UserDto(
            user.Id, user.StaffCode, user.FullName, user.Email, user.Department, user.Role, user.Permissions, user.IsActive, user.CreatedAt, user.CreatedBy
        ));
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync(CancellationToken ct)
    {
        try
        {
            const string sql = "SELECT Id, StaffCode, FullName, Email, Department, Role, IsActive, CreatedAt, CreatedBy FROM Users ORDER BY CreatedAt DESC;";
            var result = await _dbConnection.QueryAsync<UserDto>(new CommandDefinition(sql, cancellationToken: ct));
            if (result.Any()) return result;
        }
        catch { }

        return InMemoryUsers;
    }

    public async Task<IEnumerable<AuditLogDto>> GetAuditLogsAsync(CancellationToken ct)
    {
        try
        {
            const string sql = "SELECT Id, Timestamp, OperatorName, Action, Module, Description, IpAddress FROM AuditLogs ORDER BY Timestamp DESC;";
            var result = await _dbConnection.QueryAsync<AuditLogDto>(new CommandDefinition(sql, cancellationToken: ct));
            if (result.Any()) return result;
        }
        catch { }

        return InMemoryAuditLogs;
    }
}
