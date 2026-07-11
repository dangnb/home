using System;
using MediatR;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetRevenueProfitReport;

public class GetRevenueProfitReportQuery : IRequest<RevenueProfitReportDto>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    // GroupBy can be: "day", "week", "month"
    public string GroupBy { get; set; } = "day";
}
