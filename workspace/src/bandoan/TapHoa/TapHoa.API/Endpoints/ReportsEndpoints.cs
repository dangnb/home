using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System;
using TapHoa.Application.Reports.Queries.GetRevenueProfitReport;
using TapHoa.Application.Reports.Queries.GetTopProductsReport;
using TapHoa.Application.Reports.Queries.GetDeadStockReport;
using TapHoa.Application.Reports.Queries.GetTopCustomersReport;
using TapHoa.Application.Reports.Queries.GetEmployeePerformanceReport;

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

        group.MapGet("/dead-stock", async (
            [FromQuery] int? daysThreshold,
            IMediator mediator) =>
        {
            var query = new GetDeadStockQuery
            {
                DaysThreshold = daysThreshold ?? 30
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization()
        .WithName("GetDeadStockReport")
        .WithDescription("Gets dead stock report (products not sold recently)");

        group.MapGet("/top-customers", async (
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            [FromQuery] int? limit,
            IMediator mediator) =>
        {
            var query = new GetTopCustomersQuery
            {
                FromDate = fromDate,
                ToDate = toDate,
                Limit = limit ?? 10
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization()
        .WithName("GetTopCustomersReport")
        .WithDescription("Gets top customers by revenue");

        group.MapGet("/employee-performance", async (
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            IMediator mediator) =>
        {
            var query = new GetEmployeePerformanceQuery
            {
                FromDate = fromDate,
                ToDate = toDate
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithTags("Reports")
        .RequireAuthorization()
        .WithName("GetEmployeePerformanceReport")
        .WithDescription("Gets employee sales performance");
    }
}
