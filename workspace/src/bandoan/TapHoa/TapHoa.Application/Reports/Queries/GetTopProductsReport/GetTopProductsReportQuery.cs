using System;
using System.Collections.Generic;
using MediatR;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetTopProductsReport;

public class GetTopProductsReportQuery : IRequest<List<TopProductReportDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int Limit { get; set; } = 10;
    // OrderBy can be "quantity" or "revenue"
    public string OrderBy { get; set; } = "quantity";
}
