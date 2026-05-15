using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;

namespace SalesManagement.Application.WMS.Queries;

public record WarehouseDto(Guid Id, string Code, string Name);
public record GetWarehousesQuery() : IRequest<List<WarehouseDto>>;

public class GetWarehousesQueryHandler : IRequestHandler<GetWarehousesQuery, List<WarehouseDto>>
{
    private readonly IRepository<Warehouse> _repository;

    public GetWarehousesQueryHandler(IRepository<Warehouse> repository)
    {
        _repository = repository;
    }

    public async Task<List<WarehouseDto>> Handle(GetWarehousesQuery request, CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllAsync();
        return items.Select(w => new WarehouseDto(w.Id, w.Code, w.Name)).ToList();
    }
}
