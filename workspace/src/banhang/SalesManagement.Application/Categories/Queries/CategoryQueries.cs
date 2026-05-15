using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Application.Categories.Dtos;
using SalesManagement.Domain.Entities;

namespace SalesManagement.Application.Categories.Queries;

public record GetCategoriesQuery() : IRequest<List<CategoryDto>>;
public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto?>;

public class CategoryQueryHandlers : 
    IRequestHandler<GetCategoriesQuery, List<CategoryDto>>,
    IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly IRepository<Category> _repository;

    public CategoryQueryHandlers(IRepository<Category> repository)
    {
        _repository = repository;
    }

    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _repository.GetAllAsync();
        return categories.Select(c => new CategoryDto(c.Id, c.Name, c.Description)).ToList();
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id);
        if (category == null) return null;
        
        return new CategoryDto(category.Id, category.Name, category.Description);
    }
}
