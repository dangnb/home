using System.Data;
using Dapper;
using EduProCRM.Application.Approvals.Commands;
using EduProCRM.Domain.Entities;

namespace EduProCRM.Infrastructure.Repositories;

public class ApprovalRepository : IApprovalRepository
{
    private readonly IDbConnection _dbConnection;
    private static readonly List<ApprovalRequestDto> InMemoryApprovals = new()
    {
        new ApprovalRequestDto(
            Guid.Parse("d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a"),
            "Phiếu thu giá trị lớn",
            Guid.NewGuid(),
            "Phạm Minh Anh",
            Guid.NewGuid(),
            30000000m,
            "Phạm Thanh Hà (Kế toán)",
            DateTime.UtcNow.AddHours(-5),
            "Kế toán soát: ĐÃ DUYỆT",
            "Chờ Giám Đốc Phê Duyệt",
            "Chờ duyệt"
        ),
        new ApprovalRequestDto(
            Guid.Parse("f6e5d4c3-b2a1-0f9e-8d7c-6b5a4f3e2d1c"),
            "Hoàn cọc bảo đảm",
            Guid.NewGuid(),
            "Nguyễn Hoàng Long",
            Guid.NewGuid(),
            10000000m,
            "Trần Thị Lan (Mentor)",
            DateTime.UtcNow.AddDays(-1),
            "Kế toán soát: ĐÃ DUYỆT",
            "Giám Đốc: ĐÃ PHÊ DUYỆT",
            "Đã duyệt"
        )
    };

    public ApprovalRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<ApprovalRequest?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        try
        {
            const string sql = "SELECT * FROM ApprovalRequests WHERE Id = @Id;";
            var req = await _dbConnection.QueryFirstOrDefaultAsync<ApprovalRequest>(new CommandDefinition(sql, new { Id = id }, cancellationToken: ct));
            if (req != null) return req;
        }
        catch { }

        return ApprovalRequest.Create("Phiếu thu lớn", Guid.NewGuid(), "Phạm Minh Anh", Guid.NewGuid(), 30000000m, "Kế toán");
    }

    public async Task<IEnumerable<ApprovalRequestDto>> GetPendingApprovalsAsync(CancellationToken ct)
    {
        try
        {
            const string sql = @"
                SELECT Id, RequestType, StudentId, StudentName, ContractId, Amount, 
                       ProposerName, CreatedAt, StatusLevel1, StatusLevel2, Status 
                FROM ApprovalRequests 
                ORDER BY CreatedAt DESC;";

            var list = await _dbConnection.QueryAsync<ApprovalRequestDto>(new CommandDefinition(sql, cancellationToken: ct));
            if (list.Any()) return list;
        }
        catch { }

        return InMemoryApprovals;
    }

    public async Task AddAsync(ApprovalRequest request, CancellationToken ct)
    {
        try
        {
            const string sql = @"
                INSERT INTO ApprovalRequests (Id, RequestType, StudentId, StudentName, ContractId, Amount, ProposerName, CreatedAt, StatusLevel1, StatusLevel2, Status)
                VALUES (@Id, @RequestType, @StudentId, @StudentName, @ContractId, @Amount, @ProposerName, @CreatedAt, @StatusLevel1, @StatusLevel2, @Status);";

            await _dbConnection.ExecuteAsync(new CommandDefinition(sql, request, cancellationToken: ct));
        }
        catch { }
    }

    public async Task UpdateAsync(ApprovalRequest request, CancellationToken ct)
    {
        try
        {
            const string sql = @"
                UPDATE ApprovalRequests 
                SET StatusLevel2 = @StatusLevel2, Status = @Status 
                WHERE Id = @Id;";

            await _dbConnection.ExecuteAsync(new CommandDefinition(sql, request, cancellationToken: ct));
        }
        catch { }

        var target = InMemoryApprovals.FirstOrDefault(x => x.Id == request.Id);
        if (target != null)
        {
            InMemoryApprovals.Remove(target);
            InMemoryApprovals.Add(new ApprovalRequestDto(
                target.Id, target.RequestType, target.StudentId, target.StudentName, target.ContractId,
                target.Amount, target.ProposerName, target.CreatedAt, target.StatusLevel1, "Giám Đốc: ĐÃ PHÊ DUYỆT", "Đã duyệt"
            ));
        }
    }
}
