using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities.Warehouse;

public class WarehouseLocation : BaseAuditableEntity<Guid>
{
    public string Zone { get; private set; } // Khu vực (VD: A)
    public string Aisle { get; private set; } // Dãy (VD: 01)
    public string Rack { get; private set; } // Kệ
    public string Bin { get; private set; } // Ô/Ngăn
    public string Barcode { get; private set; } // Mã quét vị trí
    public string Description { get; private set; }

    private WarehouseLocation() { }

    public WarehouseLocation(string zone, string aisle, string rack, string bin, string barcode, string description = "")
    {
        Zone = zone;
        Aisle = aisle;
        Rack = rack;
        Bin = bin;
        Barcode = barcode;
        Description = description;
    }
}
