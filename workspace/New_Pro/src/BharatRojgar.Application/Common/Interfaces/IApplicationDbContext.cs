using BharatRojgar.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BharatRojgar.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<CandidateProfile> CandidateProfiles { get; }
    DbSet<CandidateEducation> CandidateEducations { get; }
    DbSet<Skill> Skills { get; }
    DbSet<CandidateSkill> CandidateSkills { get; }
    DbSet<JobPost> JobPosts { get; }
    DbSet<JobRequirement> JobRequirements { get; }
    DbSet<JobMilestone> JobMilestones { get; }
    DbSet<CandidateSavedJob> CandidateSavedJobs { get; }
    DbSet<JobApplication> JobApplications { get; }
    DbSet<ExamSchedule> ExamSchedules { get; }
    DbSet<AdmitCard> AdmitCards { get; }
    DbSet<ExamResult> ExamResults { get; }
    DbSet<Question> Questions { get; }
    DbSet<MockTest> MockTests { get; }
    DbSet<CandidateExamAttempt> CandidateExamAttempts { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
