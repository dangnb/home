using BharatRojgar.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BharatRojgar.Infrastructure.Persistence.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("questions");

        builder.HasKey(q => q.Id);
        builder.Property(q => q.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(q => q.Subject)
            .HasColumnName("subject")
            .HasColumnType("varchar(100)")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(q => q.Content)
            .HasColumnName("content")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(q => q.OptionA)
            .HasColumnName("option_a")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(q => q.OptionB)
            .HasColumnName("option_b")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(q => q.OptionC)
            .HasColumnName("option_c")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(q => q.OptionD)
            .HasColumnName("option_d")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(q => q.CorrectOption)
            .HasColumnName("correct_option")
            .HasColumnType("char(1)")
            .HasMaxLength(1)
            .IsRequired();

        builder.Property(q => q.Explanation)
            .HasColumnName("explanation")
            .HasColumnType("text");

        builder.Property(q => q.Difficulty)
            .HasColumnName("difficulty")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(q => q.Subject)
            .HasDatabaseName("ix_questions_subject");

        builder.HasIndex(q => q.Difficulty)
            .HasDatabaseName("ix_questions_difficulty");
    }
}

public class MockTestConfiguration : IEntityTypeConfiguration<MockTest>
{
    public void Configure(EntityTypeBuilder<MockTest> builder)
    {
        builder.ToTable("mock_tests");

        builder.HasKey(mt => mt.Id);
        builder.Property(mt => mt.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(mt => mt.Title)
            .HasColumnName("title")
            .HasColumnType("varchar(255)")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(mt => mt.DurationMinutes)
            .HasColumnName("duration_minutes")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(mt => mt.TotalQuestions)
            .HasColumnName("total_questions")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(mt => mt.TotalScore)
            .HasColumnName("total_score")
            .HasColumnType("decimal(5,2)")
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(mt => mt.Type)
            .HasColumnName("type")
            .HasConversion<string>()
            .HasColumnType("varchar(30)")
            .HasMaxLength(30)
            .IsRequired();
    }
}

public class CandidateExamAttemptConfiguration : IEntityTypeConfiguration<CandidateExamAttempt>
{
    public void Configure(EntityTypeBuilder<CandidateExamAttempt> builder)
    {
        builder.ToTable("candidate_exam_attempts");

        builder.HasKey(cea => cea.Id);
        builder.Property(cea => cea.Id)
            .HasColumnName("id")
            .HasColumnType("bigint")
            .ValueGeneratedOnAdd();

        builder.Property(cea => cea.CandidateProfileId)
            .HasColumnName("candidate_profile_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(cea => cea.MockTestId)
            .HasColumnName("mock_test_id")
            .HasColumnType("bigint")
            .IsRequired();

        builder.Property(cea => cea.StartTime)
            .HasColumnName("start_time")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(cea => cea.EndTime)
            .HasColumnName("end_time")
            .HasColumnType("datetime");

        builder.Property(cea => cea.Score)
            .HasColumnName("score")
            .HasColumnType("decimal(5,2)")
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(cea => cea.CorrectAnswersCount)
            .HasColumnName("correct_answers_count")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(cea => cea.WrongAnswersCount)
            .HasColumnName("wrong_answers_count")
            .HasColumnType("int")
            .IsRequired();

        builder.Property(cea => cea.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasColumnType("varchar(20)")
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(cea => new { cea.CandidateProfileId, cea.MockTestId })
            .HasDatabaseName("ix_candidate_exam_attempts_candidate_mock_test");

        builder.HasOne(cea => cea.CandidateProfile)
            .WithMany(cp => cp.ExamAttempts)
            .HasForeignKey(cea => cea.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cea => cea.MockTest)
            .WithMany(mt => mt.Attempts)
            .HasForeignKey(cea => cea.MockTestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
