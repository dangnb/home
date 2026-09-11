using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeContracts.Commands;

public class CreateEmployeeContractCommand : IRequest<long>
{
    public long EmployeeId { get; set; }
    public string? ContractNumber { get; set; }
    public EmployeeContractType ContractType { get; set; }
    public DateOnly SignDate { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal InsuranceSalary { get; set; }
    public string? Note { get; set; }
    public string? AttachmentUrl { get; set; }
}

public class CreateEmployeeContractCommandHandler : IRequestHandler<CreateEmployeeContractCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateEmployeeContractCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateEmployeeContractCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var employeeExists = await _context.EmployeeProfiles
            .AnyAsync(e => e.Id == request.EmployeeId && e.TenantId == tenantId, cancellationToken);

        if (!employeeExists)
            throw new NotFoundException($"Không tìm thấy nhân sự có ID = {request.EmployeeId}.");

        string finalContractNumber;

        if (!string.IsNullOrWhiteSpace(request.ContractNumber))
        {
            var trimmedNumber = request.ContractNumber.Trim().ToUpper();
            var duplicateExists = await _context.EmployeeContracts
                .AnyAsync(c => c.TenantId == tenantId && c.ContractNumber == trimmedNumber, cancellationToken);

            if (duplicateExists)
                throw new DomainException($"Mã hợp đồng '{trimmedNumber}' đã tồn tại trong hệ thống. Vui lòng nhập số khác.");

            finalContractNumber = trimmedNumber;
        }
        else
        {
            var currentYear = DateTime.Now.Year;
            var prefix = $"HDLD-{currentYear}/";

            var maxNumber = await _context.EmployeeContracts
                .Where(c => c.TenantId == tenantId && c.ContractNumber.StartsWith(prefix))
                .Select(c => c.ContractNumber)
                .ToListAsync(cancellationToken);

            var maxIndex = 0;
            foreach (var num in maxNumber)
            {
                var suffix = num.Replace(prefix, "");
                if (int.TryParse(suffix, out int parsedIndex))
                {
                    if (parsedIndex > maxIndex) maxIndex = parsedIndex;
                }
            }

            finalContractNumber = $"{prefix}{(maxIndex + 1):D4}";
        }

        var contract = EmployeeContract.Create(
            tenantId,
            request.EmployeeId,
            finalContractNumber,
            request.ContractType,
            request.SignDate,
            request.StartDate,
            request.EndDate,
            request.BasicSalary,
            request.InsuranceSalary,
            request.Note,
            request.AttachmentUrl);

        _context.EmployeeContracts.Add(contract);
        await _context.SaveChangesAsync(cancellationToken);

        return contract.Id;
    }
}
