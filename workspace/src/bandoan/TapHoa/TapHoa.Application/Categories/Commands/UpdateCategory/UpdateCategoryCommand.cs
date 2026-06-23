using MediatR;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Categories.Commands.UpdateCategory;

public class UpdateCategoryCommand : IRequest<bool>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, bool>
{
    private readonly ICategoryRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCategoryCommandHandler(ICategoryRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (category == null) return false;

        category.Update(request.Name, request.Description, request.Icon);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
