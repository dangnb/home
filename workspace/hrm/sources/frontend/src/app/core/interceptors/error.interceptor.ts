import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let title = 'Lỗi hệ thống';
      let message = 'Đã có lỗi xảy ra. Vui lòng thử lại.';

      if (error.error) {
        // RFC 7807 ProblemDetails
        if (typeof error.error === 'object') {
          if (error.error.title) {
            title = error.error.title;
          }
          if (error.error.detail) {
            message = error.error.detail;
          } else if (error.error.message) {
            message = error.error.message;
          } else if (error.error.errors) {
            const errs = error.error.errors;
            if (typeof errs === 'object') {
              const details = Object.entries(errs)
                .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
                .join('; ');
              message = details || message;
            }
          }
        } else if (typeof error.error === 'string') {
          message = error.error;
        }
      } else if (error.status === 0) {
        title = 'Không thể kết nối';
        message = 'Không thể kết nối đến máy chủ backend (Port 5000/5050). Vui lòng kiểm tra dịch vụ.';
      } else if (error.status === 404) {
        title = 'Không tìm thấy';
        message = 'Bản ghi không tồn tại hoặc đã bị xóa.';
      } else if (error.status === 401 || error.status === 403) {
        title = 'Quyền truy cập';
        message = 'Bạn không có quyền thực hiện thao tác này.';
      }

      toastService.error(title, message);
      return throwError(() => error);
    })
  );
};
