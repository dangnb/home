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

export interface Employee {
  id: number | string;
  tenantId?: number | string;
  userId?: number | string;
  username?: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  position?: string; // alias for jobTitle
  departmentId?: number | string;
  departmentName?: string;
  managerId?: number | string;
  managerName?: string;
  gender: string | number; // 'MALE', 'FEMALE', 'OTHER' or 1, 2, 3
  dateOfBirth?: string;
  idCardNumber?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  maritalStatus?: string;
  joinedDate?: string;
  probationEndDate?: string;
  officialJoinedDate?: string;
  hireDate?: string; // alias for joinedDate
  employeeCode?: string;
  baseSalary?: number;
  status: string | number; // 'ACTIVE', 'INACTIVE', 'DELETED' or 1, 2, 3
  createdAt?: string;
  avatarUrl?: string;
}

export interface CreateEmployeeDto {
  username: string;
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  departmentId?: number | string;
  managerId?: number | string;
  jobTitle: string;
  gender: string;
  dateOfBirth?: string;
  idCardNumber?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  maritalStatus?: string;
  joinedDate?: string;
  probationEndDate?: string;
  officialJoinedDate?: string;
  avatarUrl?: string;
  employeeCode?: string;
  position?: string;
  hireDate?: string;
  baseSalary?: number;
}

export interface UpdateEmployeeDto {
  id?: number | string;
  fullName: string;
  phone?: string;
  departmentId?: number | string;
  managerId?: number | string;
  jobTitle: string;
  gender: string;
  dateOfBirth?: string;
  idCardNumber?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  maritalStatus?: string;
  joinedDate?: string;
  probationEndDate?: string;
  officialJoinedDate?: string;
  avatarUrl?: string;
  position?: string;
  baseSalary?: number;
  status?: string | number;
}

export interface ImportEmployeeItemDto {
  fullName: string;
  email: string;
  username?: string;
  password?: string;
  phone?: string;
  jobTitle?: string;
  departmentId?: number | string;
  departmentName?: string;
  gender?: string;
  dateOfBirth?: string;
  idCardNumber?: string;
  joinedDate?: string;
  validationStatus?: 'VALID' | 'INVALID';
  validationMessage?: string;
}

export interface ImportEmployeesResult {
  total: number;
  successCount: number;
  failureCount: number;
  errors: string[];
  createdIds: number[];
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
