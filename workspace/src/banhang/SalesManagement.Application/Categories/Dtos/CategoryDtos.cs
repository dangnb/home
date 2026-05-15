namespace SalesManagement.Application.Categories.Dtos;

public record CategoryDto(Guid Id, string Name, string Description);

public record CreateCategoryDto(string Name, string Description);

public record UpdateCategoryDto(Guid Id, string Name, string Description);
