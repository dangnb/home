using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
using Dapper;

namespace DbFixer
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
            using var conn = new MySqlConnection(connectionString);
            conn.Open();

            var companyId = Guid.Parse("01950000-0000-7000-8000-000000000000");

            Console.WriteLine("Starting Category & Product Seeding...");

            var categoriesData = new List<(Guid id, string name, string slug, string icon, string desc, List<(string name, string slug, decimal price, decimal cost, string unit, string img)> products)>
            {
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001001"), "Góc Quê Nhà", "goc-que-nha", "🏡", "Đặc sản quà quê 3 miền Bắc - Trung - Nam",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Bánh Tráng Nướng Tây Ninh Gói 200g", "banh-trang-nuong-tay-ninh-200g", 25000, 18000, "Gói", "/uploads/products/banh-trang.jpg"),
                        ("Kẹo Dừa Bến Tre Đậu Phộng Hộp 300g", "keo-dua-ben-tre-300g", 45000, 32000, "Hộp", "/uploads/products/keo-dua.jpg"),
                        ("Trà Atiso Đà Lạt Hộp 100g", "tra-atiso-da-lat-100g", 65000, 48000, "Hộp", "/uploads/products/tra-atiso.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001002"), "Góc Cao Tuổi", "goc-cao-tuoi", "❤️", "Sản phẩm dinh dưỡng & chăm sóc sức khỏe người cao tuổi",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Sữa Dưỡng Sinh Anlene Gold 800g", "sua-duong-sinh-anlene-gold-800g", 385000, 320000, "Hộp", "/uploads/products/sua-anlene.jpg"),
                        ("Nước Yến Sào Khánh Hòa Hộp 6 Hũ", "nuoc-yen-sao-khanh-hoa-6-hu", 240000, 195000, "Hộp", "/uploads/products/nuoc-yen.jpg"),
                        ("Mật Ong Rừng Nguyên Chất 500ml", "mat-ong-rung-nguyen-chat-500ml", 160000, 110000, "Chai", "/uploads/products/mat-ong.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001003"), "Góc Mẹ Và Bé", "goc-me-va-be", "👶", "Đồ dùng, tã sữa & thực phẩm ăn dặm cho mẹ và bé",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Tã Bỉm Dán Bobby Siêu Thấm Size M 76 Miếng", "ta-bim-dan-bobby-size-m-76m", 289000, 240000, "Gói", "/uploads/products/ta-bobby.jpg"),
                        ("Sữa Bột Frisolac Gold Số 1 800g", "sua-bot-frisolac-gold-so-1-800g", 495000, 420000, "Hộp", "/uploads/products/sua-friso.jpg"),
                        ("Bánh Ăn Dặm Gerber Vị Chuối 42g", "banh-an-dam-gerber-chuoi-42g", 72000, 55000, "Hộp", "/uploads/products/banh-gerber.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001004"), "Góc Phái Đẹp", "goc-phai-dep", "✨", "Mỹ phẩm, chăm sóc da & cá nhân dành riêng cho phái đẹp",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Dầu Gội Pantene Chăm Sóc Hư Tổn 650ml", "dau-goi-pantene-650ml", 145000, 115000, "Chai", "/uploads/products/dau-goi-pantene.jpg"),
                        ("Sữa Tắm Dove Dưỡng Ẩm Chuyên Sâu 530ml", "sua-tam-dove-530ml", 135000, 105000, "Chai", "/uploads/products/sua-tam-dove.jpg"),
                        ("Sữa Dưỡng Thể Nivea Trắng Da 350ml", "sua-duong-the-nivea-350ml", 98000, 75000, "Chai", "/uploads/products/sua-duong-the.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001005"), "Góc Nấu Ăn", "goc-nau-an", "🍳", "Gia vị, dầu ăn, nước mắm & nguyên liệu làm bếp",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Dầu Ăn Simply Đậu Nành Chai 1L", "dau-an-simply-dau-nanh-1l", 58000, 45000, "Chai", "/uploads/products/dau-an-simply.jpg"),
                        ("Nước Mắm Nam Ngư Đệ Nhị Chai 900ml", "nuoc-mam-nam-ngu-de-nhi-900ml", 32000, 24000, "Chai", "/uploads/products/nuoc-mam-nam-ngu.jpg"),
                        ("Hạt Nêm Knorr Nấm Hương Hạt Nêm 400g", "hat-nem-knorr-nam-huong-400g", 38000, 29000, "Gói", "/uploads/products/knorr.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001006"), "Góc Thực Phẩm", "goc-thuc-pham", "☕", "Bánh kẹo, nước giải khát, mì ăn liền & đồ đóng hộp",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Bánh Quy Chocopie Orion Hộp 12 Cái", "banh-quy-chocopie-orion-12c", 52000, 40000, "Hộp", "/uploads/products/chocopie.jpg"),
                        ("Mì Hảo Hảo Tôm Chua Cay Gói 75g", "mi-hao-hao-tom-chua-cay-75g", 4500, 3600, "Gói", "/uploads/products/hao-hao.jpg"),
                        ("Cà Phê Hòa Tan G7 3in1 Hộp 18 Gói", "ca-phe-hoa-tan-g7-3in1-18g", 56000, 44000, "Hộp", "/uploads/products/g7.jpg"),
                        ("Nước Ngọt Coca Cola Lon 320ml", "nuoc-ngot-coca-cola-lon-320ml", 10000, 7500, "Lon", "/uploads/products/coca.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001007"), "Góc Sạch Đẹp", "goc-sach-dep", "🧼", "Nước giặt, nước rửa chén & hóa phẩm chăm sóc nhà cửa",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Nước Giặt OMO Matic Cửa Trên Túi 3.6kg", "nuoc-giat-omo-matic-3-6kg", 195000, 155000, "Túi", "/uploads/products/omo.jpg"),
                        ("Nước Rửa Chén Sunlight Chanh Chai 750g", "nuoc-rua-chen-sunlight-chanh-750g", 33000, 25000, "Chai", "/uploads/products/sunlight.jpg"),
                        ("Giấy Vệ Sinh Pulppy 10 Cuộn 3 Lớp", "giay-ve-sinh-pulppy-10-cuon", 75000, 58000, "Lốc", "/uploads/products/pulppy.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001008"), "Góc Học Tập", "goc-hoc-tap", "📚", "Văn phòng phẩm, tập vở & đồ dùng học sinh",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Tập Vở Học Sinh Hồng Hà 96 Trang", "tap-vo-hoc-sinh-hong-ha-96-trang", 8500, 6000, "Quyển", "/uploads/products/tap-vo.jpg"),
                        ("Bút Bi Thiên Long TL-027 Hộp 20 Cây", "but-bi-thien-long-tl-027-20-cay", 70000, 52000, "Hộp", "/uploads/products/but-bi.jpg"),
                        ("Bộ Màu Sáp Thiên Long 18 Màu", "bo-mau-sap-thien-long-18-mau", 35000, 26000, "Hộp", "/uploads/products/mau-sap.jpg")
                    }
                ),
                (
                    Guid.Parse("01950000-0000-7000-8000-000000001009"), "Góc Điện Máy", "goc-dien-may", "⚡", "Quạt điện, ổ cắm, pin & thiết bị điện gia dụng",
                    new List<(string, string, decimal, decimal, string, string)>
                    {
                        ("Quạt Bàn Senko B102 Màu Ngẫu Nhiên", "quat-ban-senko-b102", 240000, 190000, "Cái", "/uploads/products/quat-senko.jpg"),
                        ("Ổ Cắm Điện Quang 5 Lỗ 2m", "o-cam-dien-quang-5-lo-2m", 85000, 65000, "Cái", "/uploads/products/o-cam.jpg"),
                        ("Vỉ 4 Pin AA Panasonic Everyday Power", "vi-4-pin-aa-panasonic", 32000, 22000, "Vỉ", "/uploads/products/pin-panasonic.jpg")
                    }
                )
            };

            foreach (var cat in categoriesData)
            {
                // Check if Category exists
                var catIdStr = cat.id.ToString();
                var catExists = conn.QuerySingleOrDefault<Guid?>(
                    "SELECT Id FROM Categories WHERE Id = @Id OR Slug = @Slug",
                    new { Id = catIdStr, Slug = cat.slug });

                if (catExists == null)
                {
                    conn.Execute(@"
                        INSERT INTO Categories (Id, Name, Slug, Description, Icon, CreatedDate, CreatedBy, IsDeleted, CompanyId)
                        VALUES (@Id, @Name, @Slug, @Description, @Icon, NOW(), 'Seeder', 0, @CompanyId);",
                        new { Id = catIdStr, Name = cat.name, Slug = cat.slug, Description = cat.desc, Icon = cat.icon, CompanyId = companyId.ToString() });
                    Console.WriteLine($"Inserted Category: {cat.name}");
                }
                else
                {
                    // Update existing
                    conn.Execute(@"
                        UPDATE Categories SET Name = @Name, Slug = @Slug, Description = @Description, Icon = @Icon WHERE Id = @Id;",
                        new { Id = catExists.Value.ToString(), Name = cat.name, Slug = cat.slug, Description = cat.desc, Icon = cat.icon });
                    Console.WriteLine($"Updated Category: {cat.name}");
                }

                var targetCatId = (catExists ?? cat.id).ToString();

                // Insert Products for Category
                foreach (var prod in cat.products)
                {
                    var prodSlug = prod.slug;
                    var prodExists = conn.QuerySingleOrDefault<Guid?>(
                        "SELECT Id FROM Products WHERE Slug = @Slug",
                        new { Slug = prodSlug });

                    if (prodExists == null)
                    {
                        var prodId = Guid.NewGuid().ToString();
                        conn.Execute(@"
                            INSERT INTO Products (Id, Name, Slug, CategoryId, Price, CostPrice, WholesalePrice, StockQuantity, Unit, MainImageUrl, AdditionalImages, Status, CreatedDate, CreatedBy, IsDeleted, CompanyId)
                            VALUES (@Id, @Name, @Slug, @CategoryId, @Price, @CostPrice, @WholesalePrice, @StockQuantity, @Unit, @MainImageUrl, '[]', 0, NOW(), 'Seeder', 0, @CompanyId);",
                            new
                            {
                                Id = prodId,
                                Name = prod.name,
                                Slug = prod.slug,
                                CategoryId = targetCatId,
                                Price = prod.price,
                                CostPrice = prod.cost,
                                WholesalePrice = prod.price * 0.9m,
                                StockQuantity = 100,
                                Unit = prod.unit,
                                MainImageUrl = prod.img,
                                CompanyId = companyId.ToString()
                            });
                        Console.WriteLine($"  + Inserted Product: {prod.name}");
                    }
                    else
                    {
                        conn.Execute(@"
                            UPDATE Products SET CategoryId = @CategoryId, Price = @Price, Unit = @Unit, MainImageUrl = @MainImageUrl WHERE Id = @Id;",
                            new { Id = prodExists.Value.ToString(), CategoryId = targetCatId, Price = prod.price, Unit = prod.unit, MainImageUrl = prod.img });
                        Console.WriteLine($"  ~ Updated Product: {prod.name}");
                    }
                }
            }

            Console.WriteLine("✅ Seeding completed successfully!");
        }
    }
}
