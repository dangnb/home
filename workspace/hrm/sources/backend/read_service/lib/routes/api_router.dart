import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../core/database/connection_pool.dart';
import '../core/database/query_executor.dart';
import '../core/errors/response_helper.dart';
import '../features/attendances/attendance_controller.dart';
import '../features/attendances/attendance_repository.dart';
import '../features/departments/department_controller.dart';
import '../features/departments/department_repository.dart';
import '../features/employees/employee_controller.dart';
import '../features/employees/employee_repository.dart';
import '../features/leave_requests/leave_request_controller.dart';
import '../features/leave_requests/leave_request_repository.dart';

/// Router tập trung toàn bộ các API Endpoints của Read Service
class ApiRouter {
  final MariaDbConnectionPool connectionPool;

  late final QueryExecutor _executor;
  late final DepartmentController _departmentController;
  late final EmployeeController _employeeController;
  late final AttendanceController _attendanceController;
  late final LeaveRequestController _leaveRequestController;

  ApiRouter(this.connectionPool) {
    _executor = QueryExecutor(connectionPool);

    // Khởi tạo Repositories & Controllers
    _departmentController = DepartmentController(DepartmentRepository(_executor));
    _employeeController = EmployeeController(EmployeeRepository(_executor));
    _attendanceController = AttendanceController(AttendanceRepository(_executor));
    _leaveRequestController = LeaveRequestController(LeaveRequestRepository(_executor));
  }

  Router get router {
    final router = Router();

    // 1. Health check & Ping
    router.get('/health', (Request request) async {
      final isDbAlive = await connectionPool.testConnection();
      return ResponseHelper.ok({
        'service': 'hrm_read_service',
        'status': isDbAlive ? 'UP' : 'DATABASE_DOWN',
        'timestamp': DateTime.now().toIso8601String(),
      });
    });

    // 2. Mount các Feature Routers (CQRS Read Endpoints)
    router.mount('/api/v1/departments', _departmentController.router.call);
    router.mount('/api/v1/employees', _employeeController.router.call);
    router.mount('/api/v1/attendances', _attendanceController.router.call);
    router.mount('/api/v1/leave-requests', _leaveRequestController.router.call);

    return router;
  }
}
