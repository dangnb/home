using MediatR;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Commands.CreateCategory;

public class CreateCategoryCommand : IRequest<CategoryDto>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
}
