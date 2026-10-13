using BharatRojgar.Application.Common.Exceptions;
using BharatRojgar.Application.Common.Interfaces;
using BharatRojgar.Application.Features.Dashboard.DTOs;
using BharatRojgar.Domain.Entities;
using BharatRojgar.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BharatRojgar.Application.Features.Dashboard.Queries.GetCandidateDashboardOverview;

public class GetCandidateDashboardOverviewQueryHandler : IRequestHandler<GetCandidateDashboardOverviewQuery, CandidateDashboardOverviewDto>
{
    private readonly IApplicationDbContext _context;

    public GetCandidateDashboardOverviewQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateDashboardOverviewDto> Handle(GetCandidateDashboardOverviewQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        // 1. Fetch Candidate Profile with .AsNoTracking() and explicit projections
        var profileData = await _context.CandidateProfiles
            .AsNoTracking()
            .Where(cp => cp.Id == request.CandidateProfileId)
            .Select(cp => new
            {
                cp.Id,
                cp.UserId,
                cp.FirstName,
                cp.LastName,
                cp.AvatarUrl,
                cp.DateOfBirth,
                cp.Gender,
                cp.State,
                Category = cp.Category.ToString(),
                cp.ProfileCompletionRate,
                Email = cp.User.Email,
                PhoneNumber = cp.User.PhoneNumber,
                Educations = cp.Educations.Select(e => new EducationItemDto
                {
                    Id = e.Id,
                    Degree = e.Degree,
                    Institution = e.Institution,
                    StartYear = e.StartYear,
                    EndYear = e.EndYear,
                    Percentage = e.Percentage
                }).ToList(),
                Skills = cp.CandidateSkills.Select(cs => cs.Skill.Name).ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (profileData == null)
        {
            throw new NotFoundException(nameof(CandidateProfile), request.CandidateProfileId);
        }

        // 2. Aggregate Application Stats
        var totalApplications = await _context.JobApplications
            .AsNoTracking()
            .CountAsync(ja => ja.CandidateProfileId == request.CandidateProfileId, cancellationToken);

        var underReviewCount = await _context.JobApplications
            .AsNoTracking()
            .CountAsync(ja => ja.CandidateProfileId == request.CandidateProfileId && ja.Status == ApplicationStatus.UnderReview, cancellationToken);

        var shortlistedCount = await _context.JobApplications
            .AsNoTracking()
            .CountAsync(ja => ja.CandidateProfileId == request.CandidateProfileId && ja.Status == ApplicationStatus.Shortlisted, cancellationToken);

        var admitCardsCount = await _context.AdmitCards
            .AsNoTracking()
            .CountAsync(ac => ac.CandidateProfileId == request.CandidateProfileId, cancellationToken);

        var savedJobsCount = await _context.CandidateSavedJobs
            .AsNoTracking()
            .CountAsync(csj => csj.CandidateProfileId == request.CandidateProfileId, cancellationToken);

        var attemptsCount = await _context.CandidateExamAttempts
            .AsNoTracking()
            .CountAsync(cea => cea.CandidateProfileId == request.CandidateProfileId, cancellationToken);

        // 3. Upcoming Exams for Candidate with Remaining Days calculation
        var upcomingExams = await _context.AdmitCards
            .AsNoTracking()
            .Where(ac => ac.CandidateProfileId == request.CandidateProfileId && ac.ExamSchedule.ExamDate >= now)
            .OrderBy(ac => ac.ExamSchedule.ExamDate)
            .Select(ac => new UpcomingExamDto
            {
                Id = ac.ExamSchedule.Id,
                ExamName = ac.ExamSchedule.ExamName,
                ConductingBody = ac.ExamSchedule.ConductingBody,
                ExamDate = ac.ExamSchedule.ExamDate,
                RemainingDays = (ac.ExamSchedule.ExamDate.Date - now.Date).Days,
                RollNumber = ac.RollNumber,
                CenterName = ac.CenterName,
                ExamShift = ac.ExamShift,
                PdfFileUrl = ac.PdfFileUrl
            })
            .ToListAsync(cancellationToken);

        // 4. Candidate Applied Job IDs for fast checking
        var appliedJobIds = await _context.JobApplications
            .AsNoTracking()
            .Where(ja => ja.CandidateProfileId == request.CandidateProfileId)
            .Select(ja => ja.JobPostId)
            .ToListAsync(cancellationToken);

        // 5. Top 4 Recent Jobs with IsNew Flag (CreatedAt <= 7 days ago)
        var recentJobs = await _context.JobPosts
            .AsNoTracking()
            .Where(j => j.IsActive && j.EndDate >= now)
            .OrderByDescending(j => j.CreatedAt)
            .Take(4)
            .Select(j => new RecentJobDto
            {
                Id = j.Id,
                Title = j.Title,
                Department = j.Department,
                Vacancies = j.Vacancies,
                ApplicationFee = j.ApplicationFee,
                StartDate = j.StartDate,
                EndDate = j.EndDate,
                CreatedAt = j.CreatedAt,
                IsNew = (now - j.CreatedAt).TotalDays <= 7,
                HasApplied = appliedJobIds.Contains(j.Id)
            })
            .ToListAsync(cancellationToken);

        // 6. Recent Milestones / Notifications feed
        var recentMilestones = await _context.JobMilestones
            .AsNoTracking()
            .Where(jm => appliedJobIds.Contains(jm.JobPostId) && jm.DeadlineDate >= now)
            .OrderBy(jm => jm.DeadlineDate)
            .Take(5)
            .Select(jm => new NotificationItemDto
            {
                Id = jm.Id.ToString(),
                Title = jm.Title,
                Message = $"Deadline on {jm.DeadlineDate:MMM dd, yyyy} for {jm.JobPost.Title}",
                Type = jm.Type == MilestoneType.ExamDate ? "danger" : "warning",
                Timestamp = jm.DeadlineDate,
                TimeAgo = $"Due in {(jm.DeadlineDate.Date - now.Date).Days} days"
            })
            .ToListAsync(cancellationToken);

        return new CandidateDashboardOverviewDto
        {
            Profile = new CandidateProfileDto
            {
                Id = profileData.Id,
                UserId = profileData.UserId,
                FirstName = profileData.FirstName,
                LastName = profileData.LastName,
                Email = profileData.Email,
                PhoneNumber = profileData.PhoneNumber,
                AvatarUrl = profileData.AvatarUrl,
                State = profileData.State,
                Gender = profileData.Gender,
                Category = profileData.Category,
                DateOfBirth = profileData.DateOfBirth?.ToString("yyyy-MM-dd"),
                ProfileCompletionRate = profileData.ProfileCompletionRate
            },
            Educations = profileData.Educations,
            Skills = profileData.Skills,
            Stats = new DashboardStatsDto
            {
                TotalApplications = totalApplications,
                UnderReviewCount = underReviewCount,
                ShortlistedCount = shortlistedCount,
                AdmitCardsCount = admitCardsCount,
                SavedJobsCount = savedJobsCount,
                MockTestsAttempted = attemptsCount
            },
            UpcomingExams = upcomingExams,
            RecentJobs = recentJobs,
            RecentNotifications = recentMilestones
        };
    }
}
