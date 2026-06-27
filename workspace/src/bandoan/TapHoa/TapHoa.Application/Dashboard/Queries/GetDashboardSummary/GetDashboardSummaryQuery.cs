using MediatR;
using TapHoa.Application.Dashboard.DTOs;

namespace TapHoa.Application.Dashboard.Queries.GetDashboardSummary
{
    public class GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>
    {
    }
}
