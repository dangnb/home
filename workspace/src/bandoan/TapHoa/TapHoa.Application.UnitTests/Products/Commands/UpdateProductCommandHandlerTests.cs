using FluentAssertions;
using Moq;
using System.Reflection;
using TapHoa.Application.Products.Commands.UpdateProduct;
using TapHoa.Application.Products.DTOs;
using TapHoa.Domain.Common;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;
using Xunit;

namespace TapHoa.Application.UnitTests.Products.Commands;

public class UpdateProductCommandHandlerTests
{
    private readonly Mock<IProductRepository> _mockRepository;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly UpdateProductCommandHandler _handler;

    public UpdateProductCommandHandlerTests()
    {
        _mockRepository = new Mock<IProductRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new UpdateProductCommandHandler(
            _mockRepository.Object,
            _mockUnitOfWork.Object);
    }

    [Fact]
    public async Task Handle_WhenProductNotFound_ShouldReturnFalse()
    {
        // Arrange
        var command = new UpdateProductCommand { Id = Guid.NewGuid() };
        _mockRepository.Setup(r => r.GetByIdAsync(command.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product)null!);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeFalse();
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenProductExists_ShouldUpdateAndReturnTrue()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var command = new UpdateProductCommand
        {
            Id = productId,
            Name = "Updated Product",
            CostPrice = 120,
            Price = 180,
            StockQuantity = 15,
            MinStockLevel = 5,
            Unit = "kg",
            Units = new List<CreateProductUnitDto>
            {
                new CreateProductUnitDto { UnitName = "yến", ConversionFactor = 10, Price = 1750 }
            }
        };

        var existingProduct = Product.Create("Old", null, null, 100, 150, 150, 10, "kg", null, new(), TapHoa.Domain.Enums.ProductStatus.Active, null, 0, 0);
        
        // Use reflection to set Id since it is a private setter or init-only
        var idProperty = typeof(BaseEntity<Guid>).GetProperty("Id");
        idProperty?.SetValue(existingProduct, productId);

        _mockRepository.Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        existingProduct.Name.Should().Be("Updated Product");
        existingProduct.Price.Should().Be(180);
        existingProduct.MinStockLevel.Should().Be(5);
        existingProduct.Units.Should().HaveCount(1);
        existingProduct.Units.First().UnitName.Should().Be("yến");

        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
