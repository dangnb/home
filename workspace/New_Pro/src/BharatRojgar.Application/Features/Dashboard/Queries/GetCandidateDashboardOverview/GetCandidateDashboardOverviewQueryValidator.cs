using FluentValidation;

namespace BharatRojgar.Application.Features.Dashboard.Queries.GetCandidateDashboardOverview;

public class GetCandidateDashboardOverviewQueryValidator : AbstractValidator<GetCandidateDashboardOverviewQuery>
{
    public GetCandidateDashboardOverviewQueryValidator()
    {
        RuleFor(x => x.CandidateProfileId)
            .GreaterThan(0)
            .WithMessage("Candidate Profile Id must be a valid positive number.");
    }
}
