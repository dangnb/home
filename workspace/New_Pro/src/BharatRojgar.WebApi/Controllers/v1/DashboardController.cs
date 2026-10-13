using Asp.Versioning;
using BharatRojgar.Application.Features.Dashboard.DTOs;
using BharatRojgar.Application.Features.Dashboard.Queries.GetCandidateDashboardOverview;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BharatRojgar.WebApi.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ISender _sender;

    public DashboardController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Gets candidate dashboard overview with aggregated profile, upcoming exams, recent jobs, and stats.
    /// </summary>
    /// <param name="candidateProfileId">The candidate profile identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dashboard overview data</returns>
    [HttpGet("candidate/{candidateProfileId:long}/overview")]
    [ProducesResponseType(typeof(CandidateDashboardOverviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CandidateDashboardOverviewDto>> GetCandidateDashboardOverview(
        long candidateProfileId,
        CancellationToken cancellationToken)
    {
        var query = new GetCandidateDashboardOverviewQuery(candidateProfileId);
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }
}
