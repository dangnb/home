using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.CustomerLedger.Commands;
using TapHoa.Application.UnitTests.Common;
using TapHoa.Domain.Entities;
using Xunit;

namespace TapHoa.Application.UnitTests.CustomerLedger.Commands;

public class PayDebtCommandHandlerTests
{
    private readonly TestDbContext _context;
    private readonly PayDebtCommandHandler _handler;

    public PayDebtCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TestDbContext(options);
        _handler = new PayDebtCommandHandler(_context);
    }

    [Fact]
    public async Task Handle_WhenDebtDoesNotExist_ShouldReturnFalse()
    {
        // Arrange
        var command = new PayDebtCommand
        {
            DebtId = Guid.NewGuid(),
            Amount = 100000
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task Handle_WhenDebtExists_ShouldReduceDebtAndReturnTrue()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var existingDebt = CustomerDebt.Create(customerId, "Test Customer", null);
        existingDebt.AddDebt(500000); // Create initial debt of 500k
        _context.CustomerDebts.Add(existingDebt);
        await _context.SaveChangesAsync();

        var command = new PayDebtCommand
        {
            // Note: In PayDebtCommandHandler, DebtId in command actually represents CustomerId 
            // `await _context.CustomerDebts.FirstOrDefaultAsync(x => x.CustomerId == request.DebtId`
            DebtId = customerId, 
            Amount = 200000
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        
        var debt = await _context.CustomerDebts.FirstOrDefaultAsync(d => d.CustomerId == customerId);
        debt.Should().NotBeNull();
        debt!.TotalDebt.Should().Be(300000); // 500k - 200k = 300k
    }
}
