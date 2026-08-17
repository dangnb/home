using System;
using System.Collections.Generic;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class MaterialRequisition : BaseEntity
{
    public string RequisitionCode { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public MaterialRequisitionStatus Status { get; set; } = MaterialRequisitionStatus.Draft;
    public string Notes { get; set; } = string.Empty;
    public List<MaterialRequisitionItem> Items { get; set; } = new();
}

public class MaterialRequisitionItem : BaseEntity
{
    public Guid MaterialRequisitionId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public string Specification { get; set; } = string.Empty; // Quy cách vật tư
    public string Unit { get; set; } = string.Empty;
    public decimal RequestedQuantity { get; set; }
    public decimal ApprovedQuantity { get; set; }
}

public class Warehouse : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public Guid? ProjectId { get; set; } // Phân loại kho trung tâm hoặc kho công trình
}

public class InventoryStock : BaseEntity
{
    public Guid WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal QuantityOnHand { get; set; }
    public decimal MinimumQuantity { get; set; }
}
