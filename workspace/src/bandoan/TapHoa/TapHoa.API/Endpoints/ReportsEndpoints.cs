using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System;
using TapHoa.Application.Reports.Queries.GetRevenueProfitReport;
using TapHoa.Application.Reports.Queries.GetTopProductsReport;

namespace TapHoa.API.Endpoints;

public static class ReportsEndpoints
{
    public static void MapReportsEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/revenue", async (
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            [FromQuery] string groupBy,
            IMediator mediator) =>
        {
            var query = new GetRevenueProfitReportQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                GroupBy = string.IsNullOrEmpty(groupBy) ? "day" : groupBy
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization()
        .WithName("GetRevenueReport")
        .WithDescription("Gets revenue and profit report with chart data");

        group.MapGet("/top-products", async (
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            [FromQuery] int limit,
            [FromQuery] string orderBy,
            IMediator mediator) =>
        {
            var query = new GetTopProductsReportQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                Limit = limit > 0 ? limit : 10,
                OrderBy = string.IsNullOrEmpty(orderBy) ? "quantity" : orderBy
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization()
        .WithName("GetTopProductsReport")
        .WithDescription("Gets top selling products report");
        group.MapGet("/profit-loss", async (
            [FromQuery] int month,
            [FromQuery] int year,
            IMediator mediator) =>
        {
            var query = new TapHoa.Application.Reports.Queries.GetProfitLossReportQuery
            {
                Month = month,
                Year = year
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization()
        .WithName("GetProfitLossReport")
        .WithDescription("Gets profit and loss report for a specific month");
    }
}
