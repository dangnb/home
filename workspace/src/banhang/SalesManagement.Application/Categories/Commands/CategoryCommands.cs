using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Application.Categories.Dtos;
using SalesManagement.Domain.Entities;

namespace SalesManagement.Application.Categories.Commands;

public record CreateCategoryCommand(CreateCategoryDto Dto) : IRequest<CategoryDto>;
public record UpdateCategoryCommand(UpdateCategoryDto Dto) : IRequest<CategoryDto>;
public record DeleteCategoryCommand(Guid Id) : IRequest<bool>;

public class CategoryCommandHandlers : 
    IRequestHandler<CreateCategoryCommand, CategoryDto>,
    IRequestHandler<UpdateCategoryCommand, CategoryDto>,
    IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly IRepository<Category> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CategoryCommandHandlers(IRepository<Category> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new Category(request.Dto.Name, request.Dto.Description);
        await _repository.AddAsync(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return new CategoryDto(category.Id, category.Name, category.Description);
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Dto.Id);
        if (category == null) throw new Exception("Category not found");

        category.Update(request.Dto.Name, request.Dto.Description);
        _repository.Update(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CategoryDto(category.Id, category.Name, category.Description);
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id);
        if (category == null) return false;

        _repository.Remove(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
