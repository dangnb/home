using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.CustomerLedger.Commands;
using TapHoa.Application.UnitTests.Common;
using TapHoa.Domain.Entities;
using Xunit;

namespace TapHoa.Application.UnitTests.CustomerLedger.Commands;

public class RecordDebtCommandHandlerTests
{
    private readonly TestDbContext _context;
    private readonly RecordDebtCommandHandler _handler;

    public RecordDebtCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TestDbContext(options);
        _handler = new RecordDebtCommandHandler(_context);
    }

    [Fact]
    public async Task Handle_WhenCustomerDebtDoesNotExist_ShouldCreateNewDebtAndTransaction()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var command = new RecordDebtCommand
        {
            CustomerId = customerId,
            Amount = 500000,
            Note = "Ghi nợ lần đầu",
            DueDate = DateTime.UtcNow.AddDays(7)
        };

        // Act
        var resultId = await _handler.Handle(command, CancellationToken.None);

        // Assert
        var debt = await _context.CustomerDebts.FirstOrDefaultAsync(d => d.CustomerId == customerId);
        debt.Should().NotBeNull();
        debt!.Id.Should().Be(resultId);
        debt.TotalDebt.Should().Be(500000);

        var transaction = await _context.CustomerDebtTransactions.FirstOrDefaultAsync(t => t.CustomerId == customerId);
        transaction.Should().NotBeNull();
        transaction!.Amount.Should().Be(500000);
        transaction.Type.Should().Be(TapHoa.Domain.Entities.CustomerDebtTransactionType.Debt);
    }

    [Fact]
    public async Task Handle_WhenCustomerDebtExists_ShouldIncreaseDebtAndCreateTransaction()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var existingDebt = CustomerDebt.Create(customerId, "Test Customer", null);
        existingDebt.AddDebt(200000);
        _context.CustomerDebts.Add(existingDebt);
        await _context.SaveChangesAsync();

        var command = new RecordDebtCommand
        {
            CustomerId = customerId,
            Amount = 300000,
            Note = "Ghi nợ thêm"
        };

        // Act
        var resultId = await _handler.Handle(command, CancellationToken.None);

        // Assert
        var debt = await _context.CustomerDebts.FirstOrDefaultAsync(d => d.CustomerId == customerId);
        debt.Should().NotBeNull();
        debt!.Id.Should().Be(existingDebt.Id);
        debt.TotalDebt.Should().Be(500000); // 200k + 300k

        var transactions = await _context.CustomerDebtTransactions.Where(t => t.CustomerId == customerId).ToListAsync();
        transactions.Should().HaveCount(1); // 1 new transaction from this command
        transactions[0].Amount.Should().Be(300000);
        transactions[0].Type.Should().Be(TapHoa.Domain.Entities.CustomerDebtTransactionType.Debt);
    }
}
