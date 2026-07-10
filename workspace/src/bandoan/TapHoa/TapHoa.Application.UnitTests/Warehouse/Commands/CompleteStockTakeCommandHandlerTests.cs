using FluentAssertions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Reflection;
using TapHoa.Application.UnitTests.Common;
using TapHoa.Application.Warehouse.Commands;
using TapHoa.Application.Warehouse.Commands.CompleteStockTake;
using TapHoa.Domain.Common;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;
using TapHoa.Domain.Interfaces;
using Xunit;

namespace TapHoa.Application.UnitTests.Warehouse.Commands;

public class CompleteStockTakeCommandHandlerTests
{
    private readonly TestDbContext _context;
    private readonly Mock<IInventoryTransactionRepository> _mockTransactionRepo;
    private readonly Mock<IMediator> _mockMediator;
    private readonly CompleteStockTakeCommandHandler _handler;

    public CompleteStockTakeCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TestDbContext(options);
        _mockTransactionRepo = new Mock<IInventoryTransactionRepository>();
        _mockMediator = new Mock<IMediator>();

        _handler = new CompleteStockTakeCommandHandler(
            _context,
            _mockTransactionRepo.Object,
            _mockMediator.Object);
    }

    [Fact]
    public async Task Handle_WhenStockTakeNotFound_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var command = new CompleteStockTakeCommand { StockTakeId = Guid.NewGuid(), CompletedBy = "Admin" };

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task Handle_WhenNoDifferences_ShouldCompleteWithoutTransaction()
    {
        // Arrange
        var stockTakeId = Guid.NewGuid();
        var stockTake = new StockTake("ST-001", "Notes");
        var idProp = typeof(BaseEntity<Guid>).GetProperty("Id");
        idProp?.SetValue(stockTake, stockTakeId);
        
        // Add a line with 0 difference
        stockTake.AddLine(Guid.NewGuid(), 10);
        stockTake.Start();
        stockTake.Lines.First().UpdateActualQuantity(10, null);
        
        _context.StockTakes.Add(stockTake);
        await _context.SaveChangesAsync();

        var command = new CompleteStockTakeCommand { StockTakeId = stockTakeId, CompletedBy = "Admin" };

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        stockTake.Status.Should().Be(StockTakeStatus.Completed);
        _mockTransactionRepo.Verify(x => x.AddAsync(It.IsAny<InventoryTransaction>(), It.IsAny<CancellationToken>()), Times.Never);
        _mockMediator.Verify(x => x.Send(It.IsAny<ApproveTransactionCommand>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenDifferencesExist_ShouldCreateAndApproveTransaction()
    {
        // Arrange
        var stockTakeId = Guid.NewGuid();
        var productId = Guid.NewGuid();
        
        var product = Product.Create("Test", null, null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0);
        var pIdProp = typeof(BaseEntity<Guid>).GetProperty("Id");
        pIdProp?.SetValue(product, productId);
        _context.Products.Add(product);
        
        var stockTake = new StockTake("ST-001", "Notes");
        var stIdProp = typeof(BaseEntity<Guid>).GetProperty("Id");
        stIdProp?.SetValue(stockTake, stockTakeId);
        
        // Add a line with difference: Expected = 10, Actual = 8 => Difference = -2 (Thiếu)
        stockTake.AddLine(productId, 10);
        stockTake.Start();
        stockTake.Lines.First().UpdateActualQuantity(8, "Thất thoát");
        
        _context.StockTakes.Add(stockTake);
        await _context.SaveChangesAsync();

        _mockTransactionRepo.Setup(x => x.GenerateNextCodeAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync("ADJ-001");

        InventoryTransaction capturedTransaction = null!;
        _mockTransactionRepo.Setup(x => x.AddAsync(It.IsAny<InventoryTransaction>(), It.IsAny<CancellationToken>()))
            .Callback<InventoryTransaction, CancellationToken>((t, c) => capturedTransaction = t)
            .Returns(Task.CompletedTask);

        var command = new CompleteStockTakeCommand { StockTakeId = stockTakeId, CompletedBy = "Admin" };

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        stockTake.Status.Should().Be(StockTakeStatus.Completed);
        
        capturedTransaction.Should().NotBeNull();
        capturedTransaction.Type.Should().Be(TransactionType.Adjustment);
        capturedTransaction.Lines.Should().HaveCount(1);
        capturedTransaction.Lines.First().ProductId.Should().Be(productId);
        capturedTransaction.Lines.First().Quantity.Should().Be(-2);

        // Verify Mediator was called to approve this specific transaction
        _mockMediator.Verify(x => x.Send(It.Is<ApproveTransactionCommand>(c => c.TransactionId == capturedTransaction.Id), It.IsAny<CancellationToken>()), Times.Once);
    }
}
