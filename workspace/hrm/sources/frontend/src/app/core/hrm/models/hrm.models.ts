export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface Department {
  id: number | string;
  tenantId?: number;
  code: string;
  name: string;
  description?: string;
  managerId?: number | string;
  managerName?: string;
  parentId?: number | string;
  parentName?: string;
  status: string; // 'ACTIVE', 'INACTIVE', 'DELETED'
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description?: string;
  managerId?: number | string;
  parentId?: number | string;
}

export interface UpdateDepartmentDto {
  id?: number | string;
  code: string;
  name: string;
  description?: string;
  managerId?: number | string;
  parentId?: number | string;
  status?: string;
}

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3
}

export enum EmployeeStatus {
  Active = 1,
  Inactive = 2,
  Terminated = 3
}

export interface Employee {
  id: string;
  tenantId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: number;
  departmentId?: string;
  departmentName?: string;
  position?: string;
  hireDate: string;
  baseSalary: number;
  status: number;
  avatarUrl?: string;
}

export interface CreateEmployeeDto {
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: number;
  departmentId?: string;
  position?: string;
  hireDate: string;
  baseSalary: number;
}

export interface UpdateEmployeeDto {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender: number;
  departmentId?: string;
  position?: string;
  baseSalary: number;
  status: number;
}

export enum AttendanceStatus {
  Present = 1,
  Late = 2,
  EarlyLeave = 3,
  Absent = 4,
  HalfDay = 5
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  workingHours: number;
  status: number;
  notes?: string;
}

export interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  onLeaveToday: number;
}

export interface CheckInDto {
  employeeId: string;
  notes?: string;
}

export interface CheckOutDto {
  employeeId: string;
  notes?: string;
}

export enum LeaveType {
  Annual = 1,
  Sick = 2,
  Unpaid = 3,
  Maternity = 4,
  Bereavement = 5
}

export enum LeaveRequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Cancelled = 4
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
}

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveType: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApproveLeaveRequestDto {
  approverId: string;
  comment?: string;
}

export interface RejectLeaveRequestDto {
  approverId: string;
  reason: string;
}
