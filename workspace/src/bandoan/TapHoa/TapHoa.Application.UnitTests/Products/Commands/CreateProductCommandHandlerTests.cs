using FluentAssertions;
using Moq;
using TapHoa.Application.Products.Commands.CreateProduct;
using TapHoa.Application.Products.DTOs;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;
using Xunit;

namespace TapHoa.Application.UnitTests.Products.Commands;

public class CreateProductCommandHandlerTests
{
    private readonly Mock<IProductRepository> _mockRepository;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly CreateProductCommandHandler _handler;

    public CreateProductCommandHandlerTests()
    {
        _mockRepository = new Mock<IProductRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new CreateProductCommandHandler(
            _mockRepository.Object,
            _mockUnitOfWork.Object);
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_AndReturnDto()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            CostPrice = 100,
            Price = 150,
            StockQuantity = 10,
            Unit = "cái",
            Barcode = "123456789",
            Units = new List<CreateProductUnitDto>
            {
                new CreateProductUnitDto { UnitName = "thùng", ConversionFactor = 24, Price = 3500 }
            }
        };

        // Mock AddAsync to capture the saved product
        Product capturedProduct = null!;
        _mockRepository
            .Setup(repo => repo.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .Callback<Product, CancellationToken>((p, c) => capturedProduct = p)
            .Returns(Task.CompletedTask);

        _mockUnitOfWork
            .Setup(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(command.Name);
        result.Price.Should().Be(command.Price);
        
        capturedProduct.Should().NotBeNull();
        capturedProduct.Name.Should().Be(command.Name);
        capturedProduct.Units.Should().HaveCount(1);
        capturedProduct.Units.First().UnitName.Should().Be("thùng");

        _mockRepository.Verify(repo => repo.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
