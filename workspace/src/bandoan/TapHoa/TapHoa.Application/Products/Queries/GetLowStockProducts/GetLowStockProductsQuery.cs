using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetLowStockProducts;

public record GetLowStockProductsQuery : IRequest<IEnumerable<ProductDto>>;


