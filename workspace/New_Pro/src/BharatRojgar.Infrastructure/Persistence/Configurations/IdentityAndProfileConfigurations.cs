using BharatRojgar.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BharatRojgar.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .HasColumnType("varchar(150)")
            .HasMaxLength(150)
            .IsRequired();

        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("ix_users_email");

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.PhoneNumber)
            .HasColumnName("phone_number")
            .HasColumnType("varchar(20)")
            .HasMaxLength(20);

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(u => u.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("datetime");
    }
}

public class CandidateProfileConfiguration : IEntityTypeConfiguration<CandidateProfile>
{
    public void Configure(EntityTypeBuilder<CandidateProfile> builder)
    {
        builder.ToTable("candidate_profiles");

        builder.HasKey(cp => cp.Id);
        builder.Property(cp => cp.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(cp => cp.UserId)
            .HasColumnName("user_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.HasIndex(cp => cp.UserId)
            .IsUnique()
            .HasDatabaseName("ix_candidate_profiles_user_id");

        builder.Property(cp => cp.FirstName)
            .HasColumnName("first_name")
            .HasColumnType("varchar(100)")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(cp => cp.LastName)
            .HasColumnName("last_name")
            .HasColumnType("varchar(100)")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(cp => cp.AvatarUrl)
            .HasColumnName("avatar_url")
            .HasColumnType("varchar(500)")
            .HasMaxLength(500);

        builder.Property(cp => cp.DateOfBirth)
            .HasColumnName("date_of_birth")
            .HasColumnType("date");

        builder.Property(cp => cp.Gender)
            .HasColumnName("gender")
            .HasColumnType("varchar(10)")
            .HasMaxLength(10);

        builder.Property(cp => cp.State)
            .HasColumnName("state")
            .HasColumnType("varchar(100)")
            .HasMaxLength(100);

        builder.Property(cp => cp.Category)
            .HasColumnName("category")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(cp => cp.ProfileCompletionRate)
            .HasColumnName("profile_completion_rate")
            .HasColumnType("int")
            .HasDefaultValue(0)
            .IsRequired();

        builder.HasOne(cp => cp.User)
            .WithOne(u => u.CandidateProfile)
            .HasForeignKey<CandidateProfile>(cp => cp.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CandidateEducationConfiguration : IEntityTypeConfiguration<CandidateEducation>
{
    public void Configure(EntityTypeBuilder<CandidateEducation> builder)
    {
        builder.ToTable("candidate_educations");

        builder.HasKey(ce => ce.Id);
        builder.Property(ce => ce.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(ce => ce.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(ce => ce.Degree)
            .HasColumnName("degree")
            .HasColumnType("varchar(150)")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(ce => ce.Institution)
            .HasColumnName("institution")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(ce => ce.StartYear)
            .HasColumnName("start_year")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(ce => ce.EndYear)
            .HasColumnName("end_year")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(ce => ce.Percentage)
            .HasColumnName("percentage")
            .HasColumnType("decimal(5,2)")
            .HasPrecision(5, 2)
            .IsRequired();

        builder.HasIndex(ce => ce.CandidateProfileId)
            .HasDatabaseName("ix_candidate_educations_candidate_profile_id");

        builder.HasOne(ce => ce.CandidateProfile)
            .WithMany(cp => cp.Educations)
            .HasForeignKey(ce => ce.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class SkillConfiguration : IEntityTypeConfiguration<Skill>
{
    public void Configure(EntityTypeBuilder<Skill> builder)
    {
        builder.ToTable("skills");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(s => s.Name)
            .HasColumnName("name")
            .HasColumnType("varchar(100)")
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(s => s.Name)
            .IsUnique()
            .HasDatabaseName("ix_skills_name");
    }
}

public class CandidateSkillConfiguration : IEntityTypeConfiguration<CandidateSkill>
{
    public void Configure(EntityTypeBuilder<CandidateSkill> builder)
    {
        builder.ToTable("candidate_skills");

        // Composite PK
        builder.HasKey(cs => new { cs.CandidateProfileId, cs.SkillId });

        builder.Property(cs => cs.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint");

        builder.Property(cs => cs.SkillId)
            .HasColumnName("skill_id")
            .HasColumnType("bigint");

        builder.HasOne(cs => cs.CandidateProfile)
            .WithMany(cp => cp.CandidateSkills)
            .HasForeignKey(cs => cs.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cs => cs.Skill)
            .WithMany(s => s.CandidateSkills)
            .HasForeignKey(cs => cs.SkillId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
