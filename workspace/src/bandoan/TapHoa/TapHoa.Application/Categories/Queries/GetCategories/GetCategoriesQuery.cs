using MediatR;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<IEnumerable<CategoryDto>>;
