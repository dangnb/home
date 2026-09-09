using HrmPlatform.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
{
    public void Configure(EntityTypeBuilder<UserToken> builder)
    {
        builder.ToTable("user_tokens");

        builder.HasKey(ut => ut.Id);
        builder.Property(ut => ut.Id).HasColumnName("id");
        builder.Property(ut => ut.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(ut => ut.TokenHash).HasColumnName("token_hash").HasMaxLength(255).IsRequired();
        builder.Property(ut => ut.DeviceInfo).HasColumnName("device_info").HasMaxLength(255);
        builder.Property(ut => ut.IpAddress).HasColumnName("ip_address").HasMaxLength(50);
        builder.Property(ut => ut.ExpiresAt).HasColumnName("expires_at").HasPrecision(6).IsRequired();
        builder.Property(ut => ut.RevokedAt).HasColumnName("revoked_at").HasPrecision(6);
        builder.Property(ut => ut.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(ut => ut.CreatedAt).HasColumnName("created_at").HasPrecision(6);

        builder.HasIndex(ut => ut.UserId);
        builder.HasIndex(ut => ut.TokenHash);

        builder.HasOne(ut => ut.User)
            .WithMany(u => u.Tokens)
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
