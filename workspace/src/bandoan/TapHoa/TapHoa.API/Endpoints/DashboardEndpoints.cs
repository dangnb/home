using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TapHoa.Application.Dashboard.Queries.GetDashboardSummary;

namespace TapHoa.API.Endpoints;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/summary", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetDashboardSummaryQuery());
            return Results.Ok(result);
        })
        .WithTags("Dashboard")
        .RequireAuthorization();
    }
}
