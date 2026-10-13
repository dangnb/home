using BharatRojgar.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BharatRojgar.Infrastructure.Persistence.Configurations;

public class JobApplicationConfiguration : IEntityTypeConfiguration<JobApplication>
{
    public void Configure(EntityTypeBuilder<JobApplication> builder)
    {
        builder.ToTable("job_applications");

        builder.HasKey(ja => ja.Id);
        builder.Property(ja => ja.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(ja => ja.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(ja => ja.JobPostId)
            .HasColumnName("job_post_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(ja => ja.ApplicationNumber)
            .HasColumnName("application_number")
            .HasColumnType("varchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(ja => ja.ApplicationNumber)
            .IsUnique()
            .HasDatabaseName("ix_job_applications_application_number");

        builder.Property(ja => ja.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasColumnType("varchar(30)")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(ja => ja.PaymentStatus)
            .HasColumnName("payment_status")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(ja => ja.AppliedAt)
            .HasColumnName("applied_at")
            .HasColumnType("datetime")
            .IsRequired();

        builder.HasIndex(ja => new { ja.CandidateProfileId, ja.Status })
            .HasDatabaseName("ix_job_applications_candidate_status");

        builder.HasOne(ja => ja.CandidateProfile)
            .WithMany(cp => cp.Applications)
            .HasForeignKey(ja => ja.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ja => ja.JobPost)
            .WithMany(jp => jp.Applications)
            .HasForeignKey(ja => ja.JobPostId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ExamScheduleConfiguration : IEntityTypeConfiguration<ExamSchedule>
{
    public void Configure(EntityTypeBuilder<ExamSchedule> builder)
    {
        builder.ToTable("exam_schedules");

        builder.HasKey(es => es.Id);
        builder.Property(es => es.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(es => es.JobPostId)
            .HasColumnName("job_post_id")
            .HasColumnType("bigint");

        builder.Property(es => es.ExamName)
            .HasColumnName("exam_name")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(es => es.ConductingBody)
            .HasColumnName("conducting_body")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(es => es.ExamDate)
            .HasColumnName("exam_date")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(es => es.AdmitCardReleaseDate)
            .HasColumnName("admit_card_release_date")
            .HasColumnType("datetime");

        builder.Property(es => es.ResultReleaseDate)
            .HasColumnName("result_release_date")
            .HasColumnType("datetime");

        builder.HasIndex(es => es.ExamDate)
            .HasDatabaseName("ix_exam_schedules_exam_date");

        builder.HasIndex(es => new { es.JobPostId, es.ExamDate })
            .HasDatabaseName("ix_exam_schedules_job_post_id_exam_date");

        builder.HasOne(es => es.JobPost)
            .WithMany(jp => jp.ExamSchedules)
            .HasForeignKey(es => es.JobPostId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class AdmitCardConfiguration : IEntityTypeConfiguration<AdmitCard>
{
    public void Configure(EntityTypeBuilder<AdmitCard> builder)
    {
        builder.ToTable("admit_cards");

        builder.HasKey(ac => ac.Id);
        builder.Property(ac => ac.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(ac => ac.ExamScheduleId)
            .HasColumnName("exam_schedule_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(ac => ac.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(ac => ac.RollNumber)
            .HasColumnName("roll_number")
            .HasColumnType("varchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(ac => ac.RollNumber)
            .IsUnique()
            .HasDatabaseName("ix_admit_cards_roll_number");

        builder.Property(ac => ac.CenterName)
            .HasColumnName("center_name")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(ac => ac.ExamShift)
            .HasColumnName("exam_shift")
            .HasColumnType("varchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(ac => ac.PdfFileUrl)
            .HasColumnName("pdf_file_url")
            .HasColumnType("varchar(500)")
            .HasMaxLength(500);

        builder.HasOne(ac => ac.ExamSchedule)
            .WithMany(es => es.AdmitCards)
            .HasForeignKey(ac => ac.ExamScheduleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ac => ac.CandidateProfile)
            .WithMany(cp => cp.AdmitCards)
            .HasForeignKey(ac => ac.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ExamResultConfiguration : IEntityTypeConfiguration<ExamResult>
{
    public void Configure(EntityTypeBuilder<ExamResult> builder)
    {
        builder.ToTable("exam_results");

        builder.HasKey(er => er.Id);
        builder.Property(er => er.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(er => er.ExamScheduleId)
            .HasColumnName("exam_schedule_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(er => er.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(er => er.RollNumber)
            .HasColumnName("roll_number")
            .HasColumnType("varchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(er => er.RollNumber)
            .HasDatabaseName("ix_exam_results_roll_number");

        builder.Property(er => er.ScoreObtained)
            .HasColumnName("score_obtained")
            .HasColumnType("decimal(6,2)")
            .HasPrecision(6, 2)
            .IsRequired();

        builder.Property(er => er.TotalMarks)
            .HasColumnName("total_marks")
            .HasColumnType("decimal(6,2)")
            .HasPrecision(6, 2)
            .IsRequired();

        builder.Property(er => er.Rank)
            .HasColumnName("rank")
            .HasColumnType("int");

        builder.Property(er => er.QualifyingStatus)
            .HasColumnName("qualifying_status")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(er => er.ScorecardUrl)
            .HasColumnName("scorecard_url")
            .HasColumnType("varchar(500)")
            .HasMaxLength(500);

        builder.HasIndex(er => new { er.ExamScheduleId, er.QualifyingStatus })
            .HasDatabaseName("ix_exam_results_schedule_qualifying");

        builder.HasOne(er => er.ExamSchedule)
            .WithMany(es => es.ExamResults)
            .HasForeignKey(er => er.ExamScheduleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(er => er.CandidateProfile)
            .WithMany(cp => cp.ExamResults)
            .HasForeignKey(er => er.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
