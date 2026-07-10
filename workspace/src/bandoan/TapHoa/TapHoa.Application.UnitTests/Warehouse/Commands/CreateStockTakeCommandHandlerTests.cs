using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using TapHoa.Application.UnitTests.Common;
using TapHoa.Application.Warehouse.Commands.CreateStockTake;
using TapHoa.Domain.Common;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;
using Xunit;

namespace TapHoa.Application.UnitTests.Warehouse.Commands;

public class CreateStockTakeCommandHandlerTests
{
    private readonly TestDbContext _context;
    private readonly CreateStockTakeCommandHandler _handler;

    public CreateStockTakeCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TestDbContext(options);
        _handler = new CreateStockTakeCommandHandler(_context);
    }

    [Fact]
    public async Task Handle_WithCategoryId_ShouldCreateStockTakeWithCategoryProducts()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        
        var product1 = Product.Create("Product 1", categoryId, null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0);
        var product2 = Product.Create("Product 2", Guid.NewGuid(), null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0); // Different category
        
        var idProp = typeof(BaseEntity<Guid>).GetProperty("Id");
        idProp?.SetValue(product1, Guid.NewGuid());
        idProp?.SetValue(product2, Guid.NewGuid());
        
        // Mock the StockQuantity
        var stockProp = typeof(Product).GetProperty("StockQuantity");
        stockProp?.SetValue(product1, 50);
        
        _context.Products.AddRange(product1, product2);
        await _context.SaveChangesAsync();

        var command = new CreateStockTakeCommand
        {
            DocumentNo = "ST-002",
            Notes = "Check category",
            CategoryId = categoryId
        };

        // Act
        var resultId = await _handler.Handle(command, CancellationToken.None);

        // Assert
        var stockTake = await _context.StockTakes.Include(s => s.Lines).FirstOrDefaultAsync(s => s.Id == resultId);
        
        stockTake.Should().NotBeNull();
        stockTake!.DocumentNo.Should().Be("ST-002");
        stockTake.Lines.Should().HaveCount(1);
        stockTake.Lines.First().ProductId.Should().Be(product1.Id);
        stockTake.Lines.First().ExpectedQuantity.Should().Be(50);
    }

    [Fact]
    public async Task Handle_WithProductIds_ShouldCreateStockTakeWithSpecificProducts()
    {
        // Arrange
        var p1Id = Guid.NewGuid();
        var p2Id = Guid.NewGuid();
        
        var product1 = Product.Create("Product 1", null, null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0);
        var product2 = Product.Create("Product 2", null, null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0);
        var product3 = Product.Create("Product 3", null, null, 100, 100, 100, 0, "kg", null, new(), ProductStatus.Active, null, 0, 0);
        
        var idProp = typeof(BaseEntity<Guid>).GetProperty("Id");
        idProp?.SetValue(product1, p1Id);
        idProp?.SetValue(product2, p2Id);
        idProp?.SetValue(product3, Guid.NewGuid());
        
        var stockProp = typeof(Product).GetProperty("StockQuantity");
        stockProp?.SetValue(product1, 10);
        stockProp?.SetValue(product2, 20);
        
        _context.Products.AddRange(product1, product2, product3);
        await _context.SaveChangesAsync();

        var command = new CreateStockTakeCommand
        {
            DocumentNo = "ST-003",
            Notes = "Check specific products",
            ProductIds = new List<Guid> { p1Id, p2Id }
        };

        // Act
        var resultId = await _handler.Handle(command, CancellationToken.None);

        // Assert
        var stockTake = await _context.StockTakes.Include(s => s.Lines).FirstOrDefaultAsync(s => s.Id == resultId);
        
        stockTake.Should().NotBeNull();
        stockTake!.Lines.Should().HaveCount(2);
        stockTake.Lines.Select(l => l.ProductId).Should().Contain(new[] { p1Id, p2Id });
    }
}
