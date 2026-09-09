using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Features.Attendances.Commands;
using HrmPlatform.Application.Features.Departments.Commands;
using HrmPlatform.Application.Features.Employees.Commands;
using HrmPlatform.Application.Features.LeaveRequests.Commands;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Infrastructure.Persistence;
using HrmPlatform.Infrastructure.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace HrmPlatform.Infrastructure.Tests;

public class HrmFeaturesTests
{
    private ApplicationDbContext CreateDbContext(TestCurrentUserService currentUserService, string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .AddInterceptors(new AuditableEntityInterceptor(currentUserService))
            .Options;

        return new ApplicationDbContext(options, currentUserService);
    }

    [Fact]
    public async Task Departments_CreateAndUpdate_ShouldWorkSuccessfully()
    {
        var dbName = Guid.NewGuid().ToString();
        var currentUserService = new TestCurrentUserService { UserId = 1, TenantId = 1, IsSuperAdmin = false };

        using var context = CreateDbContext(currentUserService, dbName);

        // 1. Tạo mới phòng ban
        var createHandler = new CreateDepartmentCommandHandler(context);
        var deptId = await createHandler.Handle(new CreateDepartmentCommand
        {
            Name = "Phòng Kỹ Thuật",
            Code = "IT"
        }, CancellationToken.None);

        Assert.True(deptId > 0);

        // 2. Kiểm tra trùng lặp mã phòng ban
        await Assert.ThrowsAsync<BadRequestException>(() =>
            createHandler.Handle(new CreateDepartmentCommand
            {
                Name = "Công Nghệ Thông Tin",
                Code = "IT"
            }, CancellationToken.None));

        // 3. Cập nhật phòng ban
        var updateHandler = new UpdateDepartmentCommandHandler(context);
        await updateHandler.Handle(new UpdateDepartmentCommand
        {
            Id = deptId,
            Name = "Phòng Công Nghệ & Kỹ Thuật",
            Code = "TECH"
        }, CancellationToken.None);

        var updatedDept = await context.Departments.FindAsync(deptId);
        Assert.NotNull(updatedDept);
        Assert.Equal("Phòng Công Nghệ & Kỹ Thuật", updatedDept.Name);
        Assert.Equal("TECH", updatedDept.Code);
    }

    [Fact]
    public async Task Employees_CreateEmployee_ShouldCreateUserAndProfileWithHashedPassword()
    {
        var dbName = Guid.NewGuid().ToString();
        var currentUserService = new TestCurrentUserService { UserId = 1, TenantId = 1, IsSuperAdmin = false };

        using var context = CreateDbContext(currentUserService, dbName);

        // Seed default role
        context.Roles.Add(new Role { Id = 4, Code = "EMPLOYEE", Name = "Employee" });
        await context.SaveChangesAsync();

        var handler = new CreateEmployeeCommandHandler(context, currentUserService);
        var empId = await handler.Handle(new CreateEmployeeCommand
        {
            Username = "johndoe",
            Email = "johndoe@example.com",
            Password = "SecurePassword123",
            FullName = "John Doe",
            JobTitle = "Backend Developer",
            Gender = Gender.MALE
        }, CancellationToken.None);

        Assert.True(empId > 0);

        var profile = await context.EmployeeProfiles.Include(e => e.User).FirstOrDefaultAsync(e => e.Id == empId);
        Assert.NotNull(profile);
        Assert.Equal("Backend Developer", profile.JobTitle);
        Assert.NotNull(profile.User);
        Assert.Equal("johndoe", profile.User.Username);
        Assert.True(BCrypt.Net.BCrypt.Verify("SecurePassword123", profile.User.PasswordHash));

        // Kiểm tra gán role
        var userRole = await context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == profile.UserId);
        Assert.NotNull(userRole);
        Assert.Equal(4, userRole.RoleId);
    }

    [Fact]
    public async Task Attendances_CheckInAndCheckOut_ShouldCalculateLateAndEarlyMinutes()
    {
        var dbName = Guid.NewGuid().ToString();
        var currentUserService = new TestCurrentUserService { UserId = 50, TenantId = 1, IsSuperAdmin = false };

        using var context = CreateDbContext(currentUserService, dbName);

        // 1. Check-in lúc 08:45:00 (Đi muộn 15 phút so với chuẩn 08:30:00)
        var checkInTime = new DateTime(2026, 9, 10, 8, 45, 0, DateTimeKind.Utc);
        var checkInHandler = new CheckInCommandHandler(context, currentUserService);

        var attendanceId = await checkInHandler.Handle(new CheckInCommand
        {
            UserId = 50,
            CheckInTime = checkInTime
        }, CancellationToken.None);

        Assert.True(attendanceId > 0);

        var record = await context.Attendances.FindAsync(attendanceId);
        Assert.NotNull(record);
        Assert.Equal(15, record.LateMinutes);
        Assert.Equal(AttendanceStatus.LATE, record.Status);

        // 2. Thử Check-in lần thứ 2 trong cùng ngày -> Bị chặn
        await Assert.ThrowsAsync<BadRequestException>(() =>
            checkInHandler.Handle(new CheckInCommand
            {
                UserId = 50,
                CheckInTime = checkInTime.AddMinutes(5)
            }, CancellationToken.None));

        // 3. Check-out lúc 17:10:00 (Về sớm 20 phút so với chuẩn 17:30:00)
        var checkOutTime = new DateTime(2026, 9, 10, 17, 10, 0, DateTimeKind.Utc);
        var checkOutHandler = new CheckOutCommandHandler(context, currentUserService);

        await checkOutHandler.Handle(new CheckOutCommand
        {
            UserId = 50,
            CheckOutTime = checkOutTime
        }, CancellationToken.None);

        var updatedRecord = await context.Attendances.FindAsync(attendanceId);
        Assert.NotNull(updatedRecord);
        Assert.Equal(checkOutTime, updatedRecord.CheckOut);
        Assert.Equal(20, updatedRecord.EarlyMinutes);
    }

    [Fact]
    public async Task LeaveRequests_CreateAndApprove_ShouldTransitionStatus()
    {
        var dbName = Guid.NewGuid().ToString();
        var employeeUser = new TestCurrentUserService { UserId = 20, TenantId = 1, IsSuperAdmin = false };

        using var context = CreateDbContext(employeeUser, dbName);

        // 1. Nhân viên gửi đơn xin nghỉ phép
        var createHandler = new CreateLeaveRequestCommandHandler(context, employeeUser);
        var leaveId = await createHandler.Handle(new CreateLeaveRequestCommand
        {
            LeaveType = LeaveType.ANNUAL,
            StartDate = new DateOnly(2026, 9, 15),
            EndDate = new DateOnly(2026, 9, 17),
            Reason = "Nghỉ phép gia đình"
        }, CancellationToken.None);

        Assert.True(leaveId > 0);

        var request = await context.LeaveRequests.FindAsync(leaveId);
        Assert.NotNull(request);
        Assert.Equal(LeaveRequestStatus.PENDING, request.Status);

        // 2. Người quản lý phê duyệt đơn
        var managerUser = new TestCurrentUserService { UserId = 5, TenantId = 1, IsSuperAdmin = false };
        var approveHandler = new ApproveLeaveRequestCommandHandler(context, managerUser);

        await approveHandler.Handle(new ApproveLeaveRequestCommand
        {
            Id = leaveId,
            IsApproved = true
        }, CancellationToken.None);

        var approvedRequest = await context.LeaveRequests.FindAsync(leaveId);
        Assert.NotNull(approvedRequest);
        Assert.Equal(LeaveRequestStatus.APPROVED, approvedRequest.Status);
        Assert.Equal(5, approvedRequest.ApproverId);
    }
}
