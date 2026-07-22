/**
 * Security Utility: Sanitizer & Anti-XSS Helper
 */
export class Sanitizer {
  /**
   * Escape HTML special characters to prevent script injection
   */
  static escapeHtml(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Clean input text by removing potentially dangerous HTML tags
   */
  static sanitizeText(input: string): string {
    if (!input) return '';
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+="[^"]*"/g, '')
                .trim();
  }

  /**
   * Sanitize query strings to prevent parameter tamper / injection
   */
  static sanitizeQuery(query: string): string {
    if (!query) return '';
    return query.replace(/[^\w\s\u00C0-\u1EF9-]/gi, '').trim();
  }
}
