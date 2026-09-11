// EduVN — Security & Input Protection Utilities
// Sanitization, File Validation, and Anti-Spam Rate Limiting

/**
 * Sanitizes raw string input to prevent XSS (Cross-Site Scripting) attacks
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onclick=/gi, '');
}

/**
 * Safely decodes sanitized string for display when needed
 */
export function unescapeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
}

/**
 * Validates uploaded video files for safe extensions, MIME types, and size limits
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Chưa chọn file nào.' };
  }

  const allowedExtensions = ['.mp4', '.webm', '.ogv', '.mov', '.m4v'];
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const maxSizeBytes = 500 * 1024 * 1024; // 500 MB

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  // Check extension
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Định dạng file không được hỗ trợ (${extension}). Chỉ chấp nhận file video: MP4, WebM, OGV, MOV.`,
    };
  }

  // Check MIME type if available
  if (file.type && !allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `MIME type không hợp lệ (${file.type}). Vui lòng chọn file video hợp lệ.`,
    };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Dung lượng file quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là 500MB.`,
    };
  }

  return { valid: true };
}

// In-memory rate limiting store (key -> timestamp)
const rateLimitStore: Record<string, number> = {};

/**
 * Checks client-side rate limiting to prevent spamming actions
 */
export function checkRateLimit(
  actionKey: string,
  cooldownMs: number = 3000
): { allowed: boolean; remainingSec?: number } {
  const now = Date.now();
  const lastTime = rateLimitStore[actionKey] || 0;
  const elapsed = now - lastTime;

  if (elapsed < cooldownMs) {
    const remainingSec = Math.ceil((cooldownMs - elapsed) / 1000);
    return { allowed: false, remainingSec };
  }

  rateLimitStore[actionKey] = now;
  return { allowed: true };
}
