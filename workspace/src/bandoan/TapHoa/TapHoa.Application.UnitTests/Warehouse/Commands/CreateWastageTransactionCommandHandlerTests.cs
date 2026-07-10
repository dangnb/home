using FluentAssertions;
using Moq;
using System.Reflection;
using TapHoa.Application.Warehouse.Commands;
using TapHoa.Domain.Common;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Interfaces;
using Xunit;

namespace TapHoa.Application.UnitTests.Warehouse.Commands;

public class CreateWastageTransactionCommandHandlerTests
{
    private readonly Mock<IInventoryTransactionRepository> _mockTransactionRepo;
    private readonly Mock<IProductRepository> _mockProductRepo;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly CreateWastageTransactionCommandHandler _handler;

    public CreateWastageTransactionCommandHandlerTests()
    {
        _mockTransactionRepo = new Mock<IInventoryTransactionRepository>();
        _mockProductRepo = new Mock<IProductRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new CreateWastageTransactionCommandHandler(
            _mockTransactionRepo.Object,
            _mockProductRepo.Object,
            _mockUnitOfWork.Object);
    }

    [Fact]
    public async Task Handle_WhenNoLines_ShouldThrowArgumentException()
    {
        // Arrange
        var command = new CreateWastageTransactionCommand("REF-001", "Notes", "System", new List<WastageTransactionLineDto>());

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Transaction must have at least one line.");
    }

    [Fact]
    public async Task Handle_WhenProductDoesNotExist_ShouldThrowArgumentException()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var command = new CreateWastageTransactionCommand("REF-001", "Notes", "System", new List<WastageTransactionLineDto>
        {
            new WastageTransactionLineDto(productId, 5, 100)
        });

        _mockProductRepo.Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product)null!);

        _mockTransactionRepo.Setup(r => r.GenerateNextCodeAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync("WST-0001");

        // Act
        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage($"Product with ID {productId} does not exist.");
    }

    [Fact]
    public async Task Handle_WhenValid_ShouldCreateTransaction()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var command = new CreateWastageTransactionCommand("REF-001", "Notes", "System", new List<WastageTransactionLineDto>
        {
            new WastageTransactionLineDto(productId, 5, 100)
        });

        var product = Product.Create("Test Product", null, null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0);
        var idProperty = typeof(BaseEntity<Guid>).GetProperty("Id");
        idProperty?.SetValue(product, productId);

        _mockProductRepo.Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        _mockTransactionRepo.Setup(r => r.GenerateNextCodeAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync("WST-0001");

        InventoryTransaction capturedTransaction = null!;
        _mockTransactionRepo.Setup(r => r.AddAsync(It.IsAny<InventoryTransaction>(), It.IsAny<CancellationToken>()))
            .Callback<InventoryTransaction, CancellationToken>((t, c) => capturedTransaction = t)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        capturedTransaction.Should().NotBeNull();
        capturedTransaction.Type.Should().Be(TransactionType.Wastage);
        capturedTransaction.Lines.Should().HaveCount(1);
        capturedTransaction.Lines.First().ProductId.Should().Be(productId);
        capturedTransaction.Lines.First().Quantity.Should().Be(5);
        
        _mockTransactionRepo.Verify(r => r.AddAsync(It.IsAny<InventoryTransaction>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
