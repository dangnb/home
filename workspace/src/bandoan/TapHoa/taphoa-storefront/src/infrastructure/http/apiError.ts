/**
 * API Error Classes
 * Structured error handling for HTTP requests
 */

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isValidationError(): boolean {
    return this.statusCode === 422 || this.statusCode === 400;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.') {
    super(message);
    this.name = 'TimeoutError';
  }
}
