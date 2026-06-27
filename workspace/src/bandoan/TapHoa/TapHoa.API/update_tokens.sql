START TRANSACTION;
CREATE TABLE `UserTokens` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `Token` longtext NOT NULL,
    `ExpiresAt` datetime(6) NOT NULL,
    `IsRevoked` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_UserTokens_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_UserTokens_UserId` ON `UserTokens` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627053133_AddUserTokens', '10.0.9');

COMMIT;

