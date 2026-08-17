using System;
using System.Collections.Generic;
using System.Linq;
using ConsBase.Domain.Entities;
using ConsBase.Domain.Enums;

namespace ConsBase.Infrastructure.Persistence;

public static class DataSeeder
{
    public static void SeedData(ApplicationDbContext context)
    {
        if (context.Users.Any()) return; // Already seeded

        // 1. Users
        var adminUser = new User
        {
            Username = "admin",
            FullName = "Nguyễn Văn Trưởng",
            Email = "admin@consbase.vn",
            PhoneNumber = "0908123456",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = UserRole.Admin,
            TwoFactorEnabled = true
        };

        var pmUser = new User
        {
            Username = "pm_hoang",
            FullName = "Trần Hoàng (PM)",
            Email = "pm.hoang@consbase.vn",
            PhoneNumber = "0912345678",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = UserRole.ProjectManager
        };

        var siteUser = new User
        {
            Username = "kieu_field",
            FullName = "Lê Kiều (Site Engineer)",
            Email = "kieu.field@consbase.vn",
            PhoneNumber = "0987654321",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = UserRole.SiteEngineer
        };

        context.Users.AddRange(adminUser, pmUser, siteUser);
        context.SaveChanges();

        // 2. Customers & CRM
        var customer1 = new Customer
        {
            Code = "KH-2026-001",
            Name = "Công ty TNHH Bất Động Sản SunGroup",
            Type = CustomerType.Enterprise,
            TaxCode = "0109876543",
            Phone = "02439998888",
            Email = "contact@sungroup-demo.vn",
            Address = "Số 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội",
            Representative = "Phạm Nhật Vũ",
            Notes = "Khách hàng chiến lược dự án Tòa nhà Văn phòng & M&E"
        };

        var customer2 = new Customer
        {
            Code = "KH-2026-002",
            Name = "Ông Nguyễn Minh Trí (Biệt thự Thảo Điền)",
            Type = CustomerType.Individual,
            Phone = "0933456789",
            Email = "tri.nguyen@gmail.com",
            Address = "Khu Biệt thự Thảo Điền, TP. Thủ Đức, TP.HCM",
            Representative = "Nguyễn Minh Trí",
            Notes = "Thiết kế thi công trọn gói kiến trúc & nội thất tân cổ điển"
        };

        context.Customers.AddRange(customer1, customer2);
        context.SaveChanges();

        // CRM Opportunity
        var opp1 = new Opportunity
        {
            CustomerId = customer1.Id,
            Title = "Dự án Tòa nhà Xanh ConsBase Tower (12 Tầng)",
            EstimatedValue = 15000000000m,
            Stage = OpportunityStage.ContractSigned,
            SurveyDate = DateTime.UtcNow.AddDays(-30),
            SurveyNotes = "Đã khảo sát địa chất và mặt bằng 1200m2",
            AssignedUserId = pmUser.Id
        };
        context.Opportunities.Add(opp1);
        context.SaveChanges();

        // 3. Quotation & BOQ
        var quotation = new Quotation
        {
            QuotationCode = "BG-2026-008",
            CustomerId = customer1.Id,
            OpportunityId = opp1.Id,
            Title = "Báo giá Chi tiết Thi công Phần thô & M&E Tòa nhà ConsBase",
            Version = 1,
            TotalAmount = 14500000000m,
            DiscountPercent = 2,
            FinalAmount = 14210000000m,
            Status = QuotationStatus.Approved,
            Notes = "Báo giá đã phê duyệt bởi Ban Giám Đốc"
        };
        context.Quotations.Add(quotation);
        context.SaveChanges();

        var boq1 = new QuotationItem
        {
            QuotationId = quotation.Id,
            Category = "A. PHẦN MÓNG & BỂ CHỨA",
            WorkName = "Đào đất móng bắng máy đào 1.2m3",
            Unit = "m3",
            Length = 40, Width = 30, Height = 3.5m, Quantity = 1, Coefficient = 1.1m,
            UnitPrice = 95000m
        };

        var boq2 = new QuotationItem
        {
            QuotationId = quotation.Id,
            Category = "A. PHẦN MÓNG & BỂ CHỨA",
            WorkName = "Bê tông lót móng M100 đá 4x6",
            Unit = "m3",
            Length = 40, Width = 30, Height = 0.1m, Quantity = 1, Coefficient = 1.05m,
            UnitPrice = 1250000m
        };

        var boq3 = new QuotationItem
        {
            QuotationId = quotation.Id,
            Category = "B. PHẦN KHUNG BÊ TÔNG CỐT THÉP",
            WorkName = "Bê tông cột dầm sàn Cột M350",
            Unit = "m3",
            Length = 40, Width = 30, Height = 3.6m, Quantity = 12, Coefficient = 0.25m,
            UnitPrice = 2450000m
        };

        context.QuotationItems.AddRange(boq1, boq2, boq3);
        context.SaveChanges();

        // 4. Contract
        var contract = new Contract
        {
            ContractNumber = "HĐ-2026/CONSBASE-SUN",
            Title = "Hợp đồng Thi công Trọn gói ConsBase Tower",
            CustomerId = customer1.Id,
            QuotationId = quotation.Id,
            TotalValue = 14210000000m,
            AdvancePayment = 2842000000m,
            SignedDate = DateTime.UtcNow.AddDays(-20),
            StartDate = DateTime.UtcNow.AddDays(-15),
            EndDate = DateTime.UtcNow.AddDays(250),
            Status = ContractStatus.Active
        };
        context.Contracts.Add(contract);
        context.SaveChanges();

        // Payment Terms
        var term1 = new ContractPaymentTerm
        {
            ContractId = contract.Id,
            StageNumber = 1,
            Description = "Tạm ứng đợt 1 sau khi ký hợp đồng (20%)",
            Percentage = 20,
            Amount = 2842000000m,
            DueDate = DateTime.UtcNow.AddDays(-15),
            IsPaid = true,
            PaidDate = DateTime.UtcNow.AddDays(-14)
        };

        var term2 = new ContractPaymentTerm
        {
            ContractId = contract.Id,
            StageNumber = 2,
            Description = "Thanh toán đợt 2 hoàn thành dầm sàn tầng 6 (30%)",
            Percentage = 30,
            Amount = 4263000000m,
            DueDate = DateTime.UtcNow.AddDays(60),
            IsPaid = false
        };

        context.ContractPaymentTerms.AddRange(term1, term2);
        context.SaveChanges();

        // 5. Project (Strict 1-to-1 with Contract)
        var project = new Project
        {
            ProjectCode = "DA-2026-SUN-01",
            Name = "Dự án Tòa nhà ConsBase Tower (12 Tầng)",
            ContractId = contract.Id,
            CustomerId = customer1.Id,
            Budget = 12000000000m,
            ActualCost = 2150000000m,
            ProgressPercentage = 28.5m,
            Status = ProjectStatus.InExecution,
            StartDate = DateTime.UtcNow.AddDays(-15),
            EndDate = DateTime.UtcNow.AddDays(250),
            ProjectManagerId = pmUser.Id
        };
        context.Projects.Add(project);
        context.SaveChanges();

        // Update contract link back
        contract.ProjectId = project.Id;
        context.SaveChanges();

        // Project Tasks (for Gantt & Kanban)
        var task1 = new ProjectTask
        {
            ProjectId = project.Id,
            TaskCode = "CV-01",
            Title = "Khảo sát & Chuẩn bị Mặt bằng Công trường",
            StartDate = DateTime.UtcNow.AddDays(-15),
            EndDate = DateTime.UtcNow.AddDays(-10),
            PlannedVolume = 100,
            ActualVolume = 100,
            Unit = "%",
            ProgressPercentage = 100,
            Status = TaskStatusEnum.Completed,
            Priority = TaskPriority.High,
            AssignedUserId = siteUser.Id
        };

        var task2 = new ProjectTask
        {
            ProjectId = project.Id,
            TaskCode = "CV-02",
            Title = "Thi công Ép cọc bê tông & Đào đất móng",
            StartDate = DateTime.UtcNow.AddDays(-9),
            EndDate = DateTime.UtcNow.AddDays(10),
            PlannedVolume = 1540,
            ActualVolume = 1200,
            Unit = "m3",
            ProgressPercentage = 78,
            Status = TaskStatusEnum.InProgress,
            Priority = TaskPriority.Urgent,
            AssignedUserId = siteUser.Id,
            PredecessorTaskId = task1.Id
        };

        var task3 = new ProjectTask
        {
            ProjectId = project.Id,
            TaskCode = "CV-03",
            Title = "Đổ bê tông dầm sàn Tầng 1 đến Tầng 4",
            StartDate = DateTime.UtcNow.AddDays(11),
            EndDate = DateTime.UtcNow.AddDays(60),
            PlannedVolume = 3200,
            ActualVolume = 0,
            Unit = "m3",
            ProgressPercentage = 0,
            Status = TaskStatusEnum.Todo,
            Priority = TaskPriority.High,
            AssignedUserId = siteUser.Id,
            PredecessorTaskId = task2.Id
        };

        context.ProjectTasks.AddRange(task1, task2, task3);
        context.SaveChanges();

        // 6. Daily Log (ConsBase Field)
        var dailyLog = new DailyLog
        {
            ProjectId = project.Id,
            LogDate = DateTime.UtcNow.Date,
            Weather = "Nắng ráo, nhiệt độ 32°C",
            Shift = "Ca ngày (07:00 - 17:00)",
            GeneralNotes = "Tiến hành đào đất hố móng khu vực dầm D3-D5. Máy đào vận hành ổn định.",
            IncidentReport = "Không phát sinh sự cố an toàn lao động.",
            Status = DailyLogStatus.Approved,
            CreatedById = siteUser.Id,
            ApprovedById = pmUser.Id
        };
        context.DailyLogs.Add(dailyLog);
        context.SaveChanges();

        var workerLog = new DailyLogWorker
        {
            DailyLogId = dailyLog.Id,
            TeamName = "Tổ thi công Bê tông Cốp pha Hùng Cường",
            WorkerCount = 18,
            WorkDescription = "Gia công lắp đặt thép móng M1",
            HoursWorked = 8
        };

        var materialLog = new DailyLogMaterial
        {
            DailyLogId = dailyLog.Id,
            MaterialName = "Thép Hòa Phát D18 CB400-V",
            Unit = "Tấn",
            Quantity = 4.5m,
            Supplier = "Công ty CP Thép Việt Ý"
        };

        var photoLog = new DailyLogPhoto
        {
            DailyLogId = dailyLog.Id,
            PhotoUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
            Caption = "Công nhân kiểm tra khoảng cách bố trí thép dầm móng hố M1"
        };

        context.DailyLogWorkers.Add(workerLog);
        context.DailyLogMaterials.Add(materialLog);
        context.DailyLogPhotos.Add(photoLog);
        context.SaveChanges();

        // 7. Finance & Debts & Payment Requests
        var debt1 = new DebtRecord
        {
            ProjectId = project.Id,
            PartnerName = "Công ty TNHH Bất Động Sản SunGroup",
            Type = "Receivable",
            OriginalAmount = 14210000000m,
            PaidAmount = 2842000000m,
            DueDate = DateTime.UtcNow.AddDays(60)
        };

        var debt2 = new DebtRecord
        {
            ProjectId = project.Id,
            PartnerName = "Công ty CP Thép Việt Ý",
            Type = "Payable",
            OriginalAmount = 850000000m,
            PaidAmount = 500000000m,
            DueDate = DateTime.UtcNow.AddDays(15)
        };

        context.DebtRecords.AddRange(debt1, debt2);

        var payReq1 = new PaymentRequest
        {
            RequestCode = "DN-PAY-20260728-001",
            ProjectId = project.Id,
            PayeeName = "Công ty CP Thép Việt Ý",
            RequestedAmount = 350000000m,
            ApprovedAmount = 0,
            Reason = "Thanh toán đợt 2 tiền vật tư thép D18 công trình Tòa nhà ConsBase",
            Status = PaymentRequestStatus.Submitted,
            RequestDate = DateTime.UtcNow.AddDays(-2)
        };

        context.PaymentRequests.Add(payReq1);
        context.SaveChanges();

        // 8. Change Orders (Phát sinh VO)
        var co1 = new ChangeOrder
        {
            ChangeOrderCode = "VO-PS-202607-001",
            ProjectId = project.Id,
            Description = "Bổ sung gia cố móng cọc nhồi sâu thêm 3.5m do phát sinh địa chất hang karst",
            AdditionalCost = 450000000m,
            ExtensionDays = 7,
            Status = ChangeOrderStatus.Submitted
        };
        context.ChangeOrders.Add(co1);

        // 9. Materials & Warehouses
        var wh1 = new Warehouse
        {
            Code = "KHO-HN-01",
            Name = "Kho Tổng Vật Tư Hà Nội (Gia Lâm)",
            Location = "KCN Đài Tư, Gia Lâm, Hà Nội"
        };
        context.Warehouses.Add(wh1);
        context.SaveChanges();

        var matReq1 = new MaterialRequisition
        {
            RequisitionCode = "DX-VT-202607-01",
            ProjectId = project.Id,
            Status = MaterialRequisitionStatus.PendingApproval,
            Notes = "Đề xuất cấp thêm 200 bao xi măng Nghi Sơn PCB40 cho công tác tô trát",
            Items = new List<MaterialRequisitionItem>
            {
                new MaterialRequisitionItem { MaterialName = "Xi măng Nghi Sơn PCB40", Specification = "Bao 50kg", Unit = "Bao", RequestedQuantity = 200, ApprovedQuantity = 200 }
            }
        };
        context.MaterialRequisitions.Add(matReq1);

        // 10. QC & HSE Incidents
        var hse1 = new QcHseIncident
        {
            ProjectId = project.Id,
            Title = "Nhắc nhở an toàn: Công nhân không đeo dây an toàn trên giáo Tầng 3",
            Severity = "Medium",
            Description = "Cán bộ HSE phát hiện 2 công nhân thầu phụ sơn bả không móc dây an toàn.",
            CorrectiveAction = "Đã tạm dừng công việc 30 phút để tập huấn lại quy định HSE hiện trường.",
            IsResolved = true,
            ReportedDate = DateTime.UtcNow.AddDays(-3)
        };
        context.QcHseIncidents.Add(hse1);

        // 11. Acceptance & Warranty
        var acc1 = new AcceptanceRecord
        {
            RecordCode = "NT-2026-001",
            ProjectId = project.Id,
            WorkCategory = "Nghiệm thu Đào hố móng & Bê tông lót M100",
            AcceptedVolume = 1200,
            AcceptanceDate = DateTime.UtcNow.AddDays(-5),
            Status = AcceptanceStatus.Accepted,
            InspectionReport = "Đạt tiêu chuẩn TCVN 4453:1995 về thi công kết cấu bê tông"
        };
        context.AcceptanceRecords.Add(acc1);

        // 12. Subcontractors
        var sub1 = new Subcontractor
        {
            Code = "NTP-2026-01",
            Name = "Công ty TNHH M&E Điện Lạnh BK",
            Specialty = "Thi công Hệ thống Điện nước & PCCC",
            Phone = "0904112233",
            TaxCode = "0108889999"
        };
        context.Subcontractors.Add(sub1);

        // 13. Documents
        var doc1 = new DocumentRecord
        {
            DocumentName = "Bản vẽ Kết cấu Móng & Khung Tòa nhà ConsBase Tower.pdf",
            Category = "Drawing",
            FilePath = "/docs/drawings/mong_khung_v2.pdf",
            FileExtension = "pdf",
            FileSizeBytes = 15420000,
            ProjectId = project.Id,
            Version = 2
        };
        context.DocumentRecords.Add(doc1);
        context.SaveChanges();
    }
}
