using EduProCRM.Application.Users.Commands;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace EduProCRM.WebApi.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
                       .WithTags("Users & RBAC - Quản Lý Người Dùng & Phân Quyền (Mục 1)");

        // 1. GET: Lấy danh sách tài khoản nhân viên & phân quyền
        group.MapGet("/", async (IUserRepository repository, CancellationToken ct) =>
        {
            var users = await repository.GetUsersAsync(ct);
            return Results.Ok(users);
        })
        .WithName("GetUsers")
        .Produces<IEnumerable<UserDto>>();

        // 2. GET: Lấy lịch sử thao tác hệ thống (Audit Trail Log)
        group.MapGet("/audit-logs", async (IUserRepository repository, CancellationToken ct) =>
        {
            var logs = await repository.GetAuditLogsAsync(ct);
            return Results.Ok(logs);
        })
        .WithName("GetAuditLogs")
        .Produces<IEnumerable<AuditLogDto>>();

        // 3. POST: Thêm tài khoản nhân viên mới & phân quyền
        group.MapPost("/", async (
            CreateUserCommand command,
            IServiceProvider serviceProvider,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var validator = serviceProvider.GetService<IValidator<CreateUserCommand>>();
            if (validator != null)
            {
                var validationResult = await validator.ValidateAsync(command, ct);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }
            }

            var userId = await mediator.Send(command, ct);
            return Results.Created($"/api/users/{userId}", new { 
                Id = userId, 
                Message = "Đã tạo tài khoản nhân viên mới và cấp quyền thành công!" 
            });
        })
        .WithName("CreateUser")
        .Produces(StatusCodes.Status201Created)
        .ProducesValidationProblem();
    }
}
