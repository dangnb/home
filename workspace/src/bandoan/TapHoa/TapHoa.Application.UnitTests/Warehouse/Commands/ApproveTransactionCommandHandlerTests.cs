using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using TapHoa.Application.UnitTests.Common;
using TapHoa.Application.Warehouse.Commands;
using TapHoa.Domain.Common;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;
using Xunit;

namespace TapHoa.Application.UnitTests.Warehouse.Commands;

public class ApproveTransactionCommandHandlerTests
{
    private readonly TestDbContext _context;
    private readonly ApproveTransactionCommandHandler _handler;

    public ApproveTransactionCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TestDbContext(options);
        _handler = new ApproveTransactionCommandHandler(_context);
    }

    [Fact]
    public async Task Handle_WhenTransactionNotFound_ShouldThrowDomainException()
    {
        // Arrange
        var command = new ApproveTransactionCommand(Guid.NewGuid(), "Admin");

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Transaction not found.");
    }

    [Fact]
    public async Task Handle_WhenInboundTransactionApproved_ShouldIncreaseStock()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        var productId = Guid.NewGuid();
        
        var transaction = new InventoryTransaction("INB-001", TransactionType.Inbound, "REF", "System", "Notes");
        var idProp = typeof(BaseEntity<Guid>).GetProperty("Id");
        idProp?.SetValue(transaction, transactionId);

        transaction.AddLine(productId, 10, 100, null);
        _context.InventoryTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        var command = new ApproveTransactionCommand(transactionId, "Admin");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        transaction.Status.Should().Be(TransactionStatus.Completed);
        transaction.ApprovedBy.Should().Be("Admin");

        var stockLevel = await _context.StockLevels.FirstOrDefaultAsync(s => s.ProductId == productId);
        stockLevel.Should().NotBeNull();
        stockLevel!.AvailableQuantity.Should().Be(10);
    }
}
