using BharatRojgar.Application.Common.Interfaces;
using BharatRojgar.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BharatRojgar.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // User & Identity Domain
    public DbSet<User> Users => Set<User>();
    public DbSet<CandidateProfile> CandidateProfiles => Set<CandidateProfile>();
    public DbSet<CandidateEducation> CandidateEducations => Set<CandidateEducation>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<CandidateSkill> CandidateSkills => Set<CandidateSkill>();

    // Job & Recommendation Domain
    public DbSet<JobPost> JobPosts => Set<JobPost>();
    public DbSet<JobRequirement> JobRequirements => Set<JobRequirement>();
    public DbSet<JobMilestone> JobMilestones => Set<JobMilestone>();
    public DbSet<CandidateSavedJob> CandidateSavedJobs => Set<CandidateSavedJob>();

    // Application & Exam Lifecycle Domain
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<ExamSchedule> ExamSchedules => Set<ExamSchedule>();
    public DbSet<AdmitCard> AdmitCards => Set<AdmitCard>();
    public DbSet<ExamResult> ExamResults => Set<ExamResult>();

    // Mock Test & Assessment Domain
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<MockTest> MockTests => Set<MockTest>();
    public DbSet<CandidateExamAttempt> CandidateExamAttempts => Set<CandidateExamAttempt>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // MariaDB utf8mb4 charset and unicode collation
        modelBuilder.HasCharSet("utf8mb4")
            .UseCollation("utf8mb4_unicode_ci");

        // Automatically discover and apply all IEntityTypeConfiguration classes in assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
