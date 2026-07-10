using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Domain.Entities.Warehouse;

public class StockTake : BaseAuditableEntity<Guid>
{
    public string DocumentNo { get; private set; }
    public StockTakeStatus Status { get; private set; }
    public string? Notes { get; private set; }
    
    private readonly List<StockTakeLine> _lines = new();
    public IReadOnlyCollection<StockTakeLine> Lines => _lines.AsReadOnly();

    private StockTake() { }

    public StockTake(string documentNo, string? notes)
    {
        Id = Guid.NewGuid();
        DocumentNo = documentNo;
        Status = StockTakeStatus.Draft;
        Notes = notes;
    }

    public void AddLine(Guid productId, int expectedQuantity)
    {
        if (Status != StockTakeStatus.Draft && Status != StockTakeStatus.InProgress)
            throw new DomainException("Chỉ có thể thêm sản phẩm khi phiếu ở trạng thái Nháp hoặc Đang kiểm kê.");
            
        if (_lines.Any(x => x.ProductId == productId))
            throw new DomainException("Sản phẩm này đã tồn tại trong phiếu kiểm kê.");

        _lines.Add(new StockTakeLine(Id, productId, expectedQuantity));
    }

    public void Start()
    {
        if (Status != StockTakeStatus.Draft)
            throw new DomainException("Phiếu kiểm kê phải ở trạng thái Nháp mới có thể bắt đầu.");
            
        Status = StockTakeStatus.InProgress;
    }

    public void Complete()
    {
        if (Status != StockTakeStatus.InProgress)
            throw new DomainException("Phiếu kiểm kê phải ở trạng thái Đang kiểm đếm mới có thể hoàn tất.");

        if (_lines.Any(x => !x.ActualQuantity.HasValue))
            throw new DomainException("Vui lòng điền số lượng thực tế cho tất cả sản phẩm trong phiếu.");

        Status = StockTakeStatus.Completed;
    }

    public void Cancel()
    {
        if (Status == StockTakeStatus.Completed)
            throw new DomainException("Không thể hủy phiếu kiểm kê đã hoàn tất.");

        Status = StockTakeStatus.Cancelled;
    }
}
