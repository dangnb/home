using MediatR;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Queries.GetCategoryBySlug;

public class GetCategoryBySlugQuery : IRequest<CategoryDto>
{
    public string Slug { get; set; } = string.Empty;
}
