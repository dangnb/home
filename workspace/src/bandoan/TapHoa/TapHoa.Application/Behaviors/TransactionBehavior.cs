using MediatR;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Behaviors;

/// <summary>
/// Pipeline quản lý Giao dịch CSDL (Database Transactions) tự động cho các Commands.
/// Đảm bảo tính toàn vẹn dữ liệu: Nếu một khối lệnh Command bị lỗi giữa chừng, toàn bộ các bảng 
/// sẽ tự động Rollback lại trạng thái ban đầu, tránh sai lệch Số liệu Kho (WMS).
/// Bỏ qua (không tạo transaction) khi chạy tính năng Queries để tối đa hóa tốc độ đọc.
/// </summary>
public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public TransactionBehavior(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var isCommand = request.GetType().Name.EndsWith("Command");
        
        if (!isCommand)
        {
            return await next();
        }

        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            return await next();
        });
    }
}
