UPDATE Products SET Status = '0' WHERE Status = 'Đang bán';
UPDATE Products SET Status = '2' WHERE Status = 'Sắp hết' OR Status = 'Hết hàng';
UPDATE Products SET Status = '1' WHERE Status = 'Ngừng bán' OR Status = 'Ngừng kinh doanh';
UPDATE Products SET Status = '3' WHERE Status = 'Lưu nháp';
UPDATE Products SET Status = '4' WHERE Status = 'Chờ duyệt';
UPDATE Products SET Status = '0' WHERE Status NOT IN ('0','1','2','3','4');

ALTER TABLE Products MODIFY Status int NOT NULL DEFAULT 0;

INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260627160202_UpdateProductStatusToEnum', '8.0.10');
