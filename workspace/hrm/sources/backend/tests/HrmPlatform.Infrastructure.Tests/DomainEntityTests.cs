using System;
using HrmPlatform.Domain.Entities.Audit;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using Xunit;

namespace HrmPlatform.Infrastructure.Tests;

public class DomainEntityTests
{
    [Fact]
    public void Tenant_Create_WithValidData_ShouldInitializeCorrectly()
    {
        var tenant = Tenant.Create("corp-01", "Acme Corporation", "admin@acme.com", "0123456789");

        Assert.Equal("CORP-01", tenant.Code);
        Assert.Equal("Acme Corporation", tenant.Name);
        Assert.Equal("admin@acme.com", tenant.Email);
        Assert.Equal(EntityStatus.ACTIVE, tenant.Status);
    }

    [Theory]
    [InlineData("", "Acme Corp")]
    [InlineData("   ", "Acme Corp")]
    [InlineData("CORP", "")]
    [InlineData("CORP", "   ")]
    public void Tenant_Create_WithInvalidData_ShouldThrowDomainException(string code, string name)
    {
        Assert.Throws<DomainException>(() => Tenant.Create(code, name, "admin@acme.com"));
    }

    [Fact]
    public void User_Create_WithValidData_ShouldInitializeWithActiveStatus()
    {
        var user = User.Create(1, "john.doe", "john@example.com", "hashed_pwd_123", "John Doe", "0987654321");

        Assert.Equal(1, user.TenantId);
        Assert.Equal("john.doe", user.Username);
        Assert.Equal("john@example.com", user.Email);
        Assert.Equal("hashed_pwd_123", user.PasswordHash);
        Assert.Equal("John Doe", user.FullName);
        Assert.Equal(EntityStatus.ACTIVE, user.Status);
    }

    [Theory]
    [InlineData("", "email@example.com", "hash")]
    [InlineData("user", "", "hash")]
    [InlineData("user", "invalid-email", "hash")]
    [InlineData("user", "email@example.com", "")]
    public void User_Create_WithInvalidInvariants_ShouldThrowDomainException(string username, string email, string passwordHash)
    {
        Assert.Throws<DomainException>(() => User.Create(1, username, email, passwordHash, "Full Name"));
    }

    [Fact]
    public void User_ChangePassword_WithValidHash_ShouldUpdateHash()
    {
        var user = User.Create(1, "user1", "user1@example.com", "old_hash", "User One");
        user.ChangePassword("new_hash_456");

        Assert.Equal("new_hash_456", user.PasswordHash);
    }

    [Fact]
    public void User_ChangePassword_WithEmptyHash_ShouldThrowDomainException()
    {
        var user = User.Create(1, "user1", "user1@example.com", "old_hash", "User One");
        Assert.Throws<DomainException>(() => user.ChangePassword("   "));
    }

    [Fact]
    public void Department_Create_WithValidData_ShouldCapitalizeCode()
    {
        var dept = Department.Create("it_dev", "Phòng Công Nghệ Thông Tin", null, null, 1);

        Assert.Equal("IT_DEV", dept.Code);
        Assert.Equal("Phòng Công Nghệ Thông Tin", dept.Name);
        Assert.Equal(EntityStatus.ACTIVE, dept.Status);
        Assert.Equal(1, dept.TenantId);
    }

    [Theory]
    [InlineData("", "IT Department")]
    [InlineData("IT", "")]
    public void Department_Create_WithMissingCodeOrName_ShouldThrowDomainException(string code, string name)
    {
        Assert.Throws<DomainException>(() => Department.Create(code, name, null, null, 1));
    }

    [Fact]
    public void EmployeeProfile_Create_WithValidData_ShouldInitializeWithActiveStatus()
    {
        var profile = EmployeeProfile.Create(
            tenantId: 1,
            userId: 10,
            jobTitle: "Senior .NET Developer",
            gender: Gender.MALE,
            departmentId: 5,
            managerId: null,
            dateOfBirth: new DateOnly(1995, 5, 20),
            idCardNumber: "012345678901",
            joinedDate: new DateOnly(2026, 1, 1)
        );

        Assert.Equal(1, profile.TenantId);
        Assert.Equal(10, profile.UserId);
        Assert.Equal("Senior .NET Developer", profile.JobTitle);
        Assert.Equal(EntityStatus.ACTIVE, profile.Status);
    }

    [Fact]
    public void EmployeeProfile_Create_WithInvalidJobTitleOrUserId_ShouldThrowDomainException()
    {
        Assert.Throws<DomainException>(() => EmployeeProfile.Create(1, 0, "Developer", Gender.MALE));
        Assert.Throws<DomainException>(() => EmployeeProfile.Create(1, 10, "   ", Gender.MALE));
    }

    [Fact]
    public void LeaveRequest_Create_WithValidDates_ShouldInitializeAsPending()
    {
        var startDate = new DateOnly(2026, 10, 1);
        var endDate = new DateOnly(2026, 10, 3);

        var leave = LeaveRequest.Create(
            tenantId: 1,
            userId: 5,
            leaveType: LeaveType.ANNUAL,
            startDate: startDate,
            endDate: endDate,
            reason: "Nghỉ phép thường niên"
        );

        Assert.Equal(LeaveRequestStatus.PENDING, leave.Status);
        Assert.Equal(startDate, leave.StartDate);
        Assert.Equal(endDate, leave.EndDate);
        Assert.Equal("Nghỉ phép thường niên", leave.Reason);
    }

    [Fact]
    public void LeaveRequest_Create_WithEndDateBeforeStartDate_ShouldThrowDomainException()
    {
        var startDate = new DateOnly(2026, 10, 5);
        var endDate = new DateOnly(2026, 10, 1); // Invalid: earlier than start

        var ex = Assert.Throws<DomainException>(() => LeaveRequest.Create(
            tenantId: 1,
            userId: 5,
            leaveType: LeaveType.ANNUAL,
            startDate: startDate,
            endDate: endDate,
            reason: "Lỗi ngày"
        ));

        Assert.Contains("Ngày kết thúc nghỉ", ex.Message);
    }

    [Fact]
    public void LeaveRequest_Approve_WhenPending_ShouldUpdateStatusAndApprover()
    {
        var leave = LeaveRequest.Create(1, 5, LeaveType.ANNUAL, new DateOnly(2026, 10, 1), new DateOnly(2026, 10, 2), "Nghỉ phép");
        leave.Approve(1);

        Assert.Equal(LeaveRequestStatus.APPROVED, leave.Status);
        Assert.Equal(1, leave.ApproverId);
    }

    [Fact]
    public void LeaveRequest_Approve_WhenAlreadyApproved_ShouldThrowDomainException()
    {
        var leave = LeaveRequest.Create(1, 5, LeaveType.ANNUAL, new DateOnly(2026, 10, 1), new DateOnly(2026, 10, 2), "Nghỉ phép");
        leave.Approve(1);

        // Second approve should fail
        Assert.Throws<DomainException>(() => leave.Approve(1));
    }

    [Fact]
    public void Attendance_RecordCheckOut_EarlierThanCheckIn_ShouldThrowDomainException()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var checkInTime = DateTime.UtcNow;
        var invalidCheckOutTime = checkInTime.AddHours(-1); // Before check-in

        var attendance = Attendance.Create(1, 10, today);
        attendance.RecordCheckIn(checkInTime);

        var ex = Assert.Throws<DomainException>(() => attendance.RecordCheckOut(invalidCheckOutTime));
        Assert.Contains("Thời gian Check-out không thể diễn ra trước thời gian Check-in", ex.Message);
    }
}
