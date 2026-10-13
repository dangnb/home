using BharatRojgar.Application.Features.Dashboard.DTOs;
using MediatR;

namespace BharatRojgar.Application.Features.Dashboard.Queries.GetCandidateDashboardOverview;

public record GetCandidateDashboardOverviewQuery(long CandidateProfileId) : IRequest<CandidateDashboardOverviewDto>;
