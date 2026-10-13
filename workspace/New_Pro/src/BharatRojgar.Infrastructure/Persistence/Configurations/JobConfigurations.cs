using BharatRojgar.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BharatRojgar.Infrastructure.Persistence.Configurations;

public class JobPostConfiguration : IEntityTypeConfiguration<JobPost>
{
    public void Configure(EntityTypeBuilder<JobPost> builder)
    {
        builder.ToTable("job_posts");

        builder.HasKey(j => j.Id);
        builder.Property(j => j.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(j => j.Title)
            .HasColumnName("title")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(j => j.Department)
            .HasColumnName("department")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(j => j.Vacancies)
            .HasColumnName("vacancies")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(j => j.ApplicationFee)
            .HasColumnName("application_fee")
            .HasColumnType("decimal(12,2)")
            .HasPrecision(12, 2)
            .IsRequired();

        builder.Property(j => j.StartDate)
            .HasColumnName("start_date")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(j => j.EndDate)
            .HasColumnName("end_date")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(j => j.IsActive)
            .HasColumnName("is_active")
            .HasColumnType("tinyint(1)")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(j => j.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime")
            .IsRequired();

        // Single and composite indexes for query performance
        builder.HasIndex(j => j.EndDate)
            .HasDatabaseName("ix_job_posts_end_date");

        builder.HasIndex(j => new { j.IsActive, j.EndDate })
            .HasDatabaseName("ix_job_posts_is_active_end_date");
    }
}

public class JobRequirementConfiguration : IEntityTypeConfiguration<JobRequirement>
{
    public void Configure(EntityTypeBuilder<JobRequirement> builder)
    {
        builder.ToTable("job_requirements");

        builder.HasKey(jr => jr.Id);
        builder.Property(jr => jr.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(jr => jr.JobPostId)
            .HasColumnName("job_post_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.HasIndex(jr => jr.JobPostId)
            .IsUnique()
            .HasDatabaseName("ix_job_requirements_job_post_id");

        builder.Property(jr => jr.MinimumDegree)
            .HasColumnName("minimum_degree")
            .HasColumnType("varchar(150)")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(jr => jr.MinAge)
            .HasColumnName("min_age")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(jr => jr.MaxAge)
            .HasColumnName("max_age")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(jr => jr.EligibleState)
            .HasColumnName("eligible_state")
            .HasColumnType("varchar(100)")
            .HasMaxLength(100);

        builder.Property(jr => jr.EligibleCategory)
            .HasColumnName("eligible_category")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20);

        builder.HasOne(jr => jr.JobPost)
            .WithOne(jp => jp.Requirement)
            .HasForeignKey<JobRequirement>(jr => jr.JobPostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class JobMilestoneConfiguration : IEntityTypeConfiguration<JobMilestone>
{
    public void Configure(EntityTypeBuilder<JobMilestone> builder)
    {
        builder.ToTable("job_milestones");

        builder.HasKey(jm => jm.Id);
        builder.Property(jm => jm.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(jm => jm.JobPostId)
            .HasColumnName("job_post_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(jm => jm.Type)
            .HasColumnName("type")
            .HasConversion<string>()
            .HasColumnType("varchar(30)")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(jm => jm.Title)
            .HasColumnName("title")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(jm => jm.DeadlineDate)
            .HasColumnName("deadline_date")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(jm => jm.AlertDispatched)
            .HasColumnName("alert_dispatched")
            .HasColumnType("tinyint(1)")
            .HasDefaultValue(false)
            .IsRequired();

        builder.HasIndex(jm => jm.DeadlineDate)
            .HasDatabaseName("ix_job_milestones_deadline_date");

        builder.HasIndex(jm => new { jm.JobPostId, jm.DeadlineDate })
            .HasDatabaseName("ix_job_milestones_job_post_id_deadline_date");

        builder.HasOne(jm => jm.JobPost)
            .WithMany(jp => jp.Milestones)
            .HasForeignKey(jm => jm.JobPostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CandidateSavedJobConfiguration : IEntityTypeConfiguration<CandidateSavedJob>
{
    public void Configure(EntityTypeBuilder<CandidateSavedJob> builder)
    {
        builder.ToTable("candidate_saved_jobs");

        // Composite PK
        builder.HasKey(csj => new { csj.CandidateProfileId, csj.JobPostId });

        builder.Property(csj => csj.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint");

        builder.Property(csj => csj.JobPostId)
            .HasColumnName("job_post_id")
            .HasColumnType("bigint");

        builder.Property(csj => csj.SavedAt)
            .HasColumnName("saved_at")
            .HasColumnType("datetime")
            .IsRequired();

        builder.HasOne(csj => csj.CandidateProfile)
            .WithMany(cp => cp.SavedJobs)
            .HasForeignKey(csj => csj.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(csj => csj.JobPost)
            .WithMany(jp => jp.SavedByCandidates)
            .HasForeignKey(csj => csj.JobPostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
