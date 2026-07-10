using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities.Warehouse;

public class StockTakeLine : BaseEntity<Guid>
{
    public Guid StockTakeId { get; private set; }
    public virtual StockTake StockTake { get; private set; }

    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }

    public int ExpectedQuantity { get; private set; }
    public int? ActualQuantity { get; private set; }
    public string? Reason { get; private set; }

    public int Difference => ActualQuantity.HasValue ? ActualQuantity.Value - ExpectedQuantity : 0;

    private StockTakeLine() { }

    public StockTakeLine(Guid stockTakeId, Guid productId, int expectedQuantity)
    {
        Id = Guid.NewGuid();
        StockTakeId = stockTakeId;
        ProductId = productId;
        ExpectedQuantity = expectedQuantity;
    }

    public void UpdateActualQuantity(int actualQuantity, string? reason)
    {
        ActualQuantity = actualQuantity;
        Reason = reason;
    }
}
