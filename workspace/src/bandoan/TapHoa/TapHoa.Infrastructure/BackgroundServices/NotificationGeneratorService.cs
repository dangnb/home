using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;
using TapHoa.Infrastructure.Data;

namespace TapHoa.Infrastructure.BackgroundServices;

public class NotificationGeneratorService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationGeneratorService> _logger;

    public NotificationGeneratorService(IServiceProvider serviceProvider, ILogger<NotificationGeneratorService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("NotificationGeneratorService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await GenerateNotifications(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while generating notifications.");
            }

            // Run every 30 minutes
            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }

        _logger.LogInformation("NotificationGeneratorService is stopping.");
    }

    private async Task GenerateNotifications(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await CheckLowStock(context, stoppingToken);
        await CheckOverdueDebt(context, stoppingToken);
        await CheckOverdueExpenses(context, stoppingToken);
        await CheckOpenShifts(context, stoppingToken);
    }

    private async Task CheckLowStock(AppDbContext context, CancellationToken stoppingToken)
    {
        var lowStockItems = await context.StockLevels
            .Include(sl => sl.Product)
            .Where(sl => sl.AvailableQuantity <= sl.ReorderPoint && sl.AvailableQuantity > 0) // Avoid duplicate for 0 if handled elsewhere
            .ToListAsync(stoppingToken);

        foreach (var item in lowStockItems)
        {
            var title = $"Sắp hết hàng: {item.Product.Name}";
            
            // Check if a similar notification was created in the last 24 hours
            var recentNotif = await context.Notifications
                .Where(n => n.Type == NotificationType.LowStock && n.ReferenceId == item.ProductId.ToString())
                .Where(n => n.CreatedDate >= DateTime.UtcNow.AddDays(-1))
                .AnyAsync(stoppingToken);

            if (!recentNotif)
            {
                var notif = Notification.Create(
                    title: title,
                    message: $"Sản phẩm {item.Product.Name} chỉ còn {item.AvailableQuantity} {item.Product.Unit}. Vui lòng nhập thêm hàng.",
                    type: NotificationType.LowStock,
                    priority: NotificationPriority.High,
                    targetUsername: null, // Broadcast to all admins/managers
                    actionUrl: $"/admin/inventory/stock-levels",
                    referenceId: item.ProductId.ToString()
                );
                
                // Inherit company ID from the stock level
                notif.CompanyId = item.Product.CompanyId;
                notif.CreatedBy = "System";
                notif.CreatedDate = DateTime.UtcNow;

                context.Notifications.Add(notif);
            }
        }

        await context.SaveChangesAsync(stoppingToken);
    }

    private async Task CheckOverdueDebt(AppDbContext context, CancellationToken stoppingToken)
    {
        // Example: logic to check customer debt that is very high or overdue
        // For now, let's just check customers with high debt
        var highDebtCustomers = await context.CustomerDebts
            .Where(c => !c.IsDeleted && c.TotalDebt > 5000000)
            .ToListAsync(stoppingToken);

        foreach (var debt in highDebtCustomers)
        {
            var recentNotif = await context.Notifications
                .Where(n => n.Type == NotificationType.DebtOverdue && n.ReferenceId == debt.CustomerId.ToString())
                .Where(n => n.CreatedDate >= DateTime.UtcNow.AddDays(-7)) // Remind weekly
                .AnyAsync(stoppingToken);

            if (!recentNotif)
            {
                var notif = Notification.Create(
                    title: $"Công nợ cao: {debt.CustomerName}",
                    message: $"Khách hàng {debt.CustomerName} đang có dư nợ {debt.TotalDebt:N0}đ.",
                    type: NotificationType.DebtOverdue,
                    priority: NotificationPriority.Medium,
                    targetUsername: null,
                    actionUrl: $"/admin/customer-ledger/{debt.CustomerId}",
                    referenceId: debt.CustomerId.ToString()
                );
                notif.CompanyId = debt.CompanyId;
                notif.CreatedBy = "System";
                notif.CreatedDate = DateTime.UtcNow;

                context.Notifications.Add(notif);
            }
        }
        await context.SaveChangesAsync(stoppingToken);
    }

    private async Task CheckOverdueExpenses(AppDbContext context, CancellationToken stoppingToken)
    {
        var overdueExpenses = await context.OperatingExpenses
            .Where(e => !e.IsDeleted && e.PaymentStatus == ExpensePaymentStatus.Pending && e.DueDate < DateTime.UtcNow)
            .ToListAsync(stoppingToken);

        foreach (var expense in overdueExpenses)
        {
            var recentNotif = await context.Notifications
                .Where(n => n.Type == NotificationType.ExpenseOverdue && n.ReferenceId == expense.Id.ToString())
                .Where(n => n.CreatedDate >= DateTime.UtcNow.AddDays(-1)) // Daily reminder
                .AnyAsync(stoppingToken);

            if (!recentNotif)
            {
                var notif = Notification.Create(
                    title: $"Chi phí quá hạn thanh toán: {expense.Name}",
                    message: $"Chi phí {expense.Name} ({expense.Amount:N0}đ) đã quá hạn thanh toán vào ngày {expense.DueDate:dd/MM/yyyy}.",
                    type: NotificationType.ExpenseOverdue,
                    priority: NotificationPriority.High,
                    targetUsername: null,
                    actionUrl: $"/admin/expenses",
                    referenceId: expense.Id.ToString()
                );
                
                notif.CompanyId = expense.CompanyId;
                notif.CreatedBy = "System";
                notif.CreatedDate = DateTime.UtcNow;

                context.Notifications.Add(notif);
            }
        }
        await context.SaveChangesAsync(stoppingToken);
    }

    private async Task CheckOpenShifts(AppDbContext context, CancellationToken stoppingToken)
    {
        var overdueShifts = await context.Shifts
            .Where(s => !s.IsDeleted && s.Status == ShiftStatus.Open && s.StartTime < DateTime.UtcNow.AddHours(-12))
            .ToListAsync(stoppingToken);

        foreach (var shift in overdueShifts)
        {
            var recentNotif = await context.Notifications
                .Where(n => n.Type == NotificationType.ShiftReminder && n.ReferenceId == shift.Id.ToString())
                .Where(n => n.CreatedDate >= DateTime.UtcNow.AddHours(-6)) // Remind every 6 hours
                .AnyAsync(stoppingToken);

            if (!recentNotif)
            {
                var notif = Notification.Create(
                    title: $"Ca làm việc chưa đóng",
                    message: $"Nhân viên {shift.Username} có ca làm việc mở từ {shift.StartTime:dd/MM HH:mm} (hơn 12 tiếng) chưa được đóng.",
                    type: NotificationType.ShiftReminder,
                    priority: NotificationPriority.Medium,
                    targetUsername: null,
                    actionUrl: $"/admin/shifts",
                    referenceId: shift.Id.ToString()
                );
                
                notif.CompanyId = shift.CompanyId;
                notif.CreatedBy = "System";
                notif.CreatedDate = DateTime.UtcNow;

                context.Notifications.Add(notif);
            }
        }
        await context.SaveChangesAsync(stoppingToken);
    }
}
