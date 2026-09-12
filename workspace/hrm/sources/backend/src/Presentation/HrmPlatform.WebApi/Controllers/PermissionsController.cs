using HrmPlatform.Application.Features.Roles.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class PermissionsController : ControllerBase
{
    private readonly ISender _sender;

    public PermissionsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách toàn bộ quyền hạn trong hệ thống, nhóm theo module
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? module,
        [FromQuery] string? search,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetPermissionsQuery
        {
            Module = module,
            Search = search
        }, cancellationToken);

        return Ok(result);
    }
}
