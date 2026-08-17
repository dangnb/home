using EduProCRM.Application.LegalJournals.Commands;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace EduProCRM.WebApi.Endpoints;

public static class LegalJournalEndpoints
{
    public static void MapLegalJournalEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/legal-journals")
                       .WithTags("Legal Journals - Sổ Nhật Ký Bằng Chứng Pháp Lý (Mục 7)");

        // 1. Minimal API POST: Ghi Nhật Ký Công Việc Mới
        group.MapPost("/", async (
            CreateLegalJournalCommand command,
            IServiceProvider serviceProvider,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var validator = serviceProvider.GetService<IValidator<CreateLegalJournalCommand>>();
            if (validator != null)
            {
                var validationResult = await validator.ValidateAsync(command, ct);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }
            }

            var id = await mediator.Send(command, ct);
            return Results.Created($"/api/legal-journals/{id}", new { Id = id, Message = "Đã lưu & khóa nhật ký pháp lý thành công!" });
        })
        .WithName("CreateLegalJournal")
        .Produces(StatusCodes.Status201Created)
        .ProducesValidationProblem();

        // 2. Minimal API GET: Lấy toàn bộ nhật ký theo Học viên
        group.MapGet("/student/{studentId:guid}", async (
            Guid studentId,
            ILegalJournalRepository repository,
            CancellationToken ct) =>
        {
            var logs = await repository.GetByStudentIdAsync(studentId, ct);
            return Results.Ok(logs);
        })
        .WithName("GetStudentLegalJournal")
        .Produces<IEnumerable<LegalJournalDto>>();
    }
}
