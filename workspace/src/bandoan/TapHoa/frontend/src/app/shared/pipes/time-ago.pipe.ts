import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    
    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));

    if (Number.isNaN(seconds)) return '';

    if (seconds <= 45) return 'vài giây trước';
    if (seconds <= 90) return '1 phút trước';
    if (minutes <= 45) return minutes + ' phút trước';
    if (minutes <= 90) return '1 giờ trước';
    if (hours <= 22) return hours + ' giờ trước';
    if (hours <= 36) return '1 ngày trước';
    if (days <= 25) return days + ' ngày trước';
    if (days <= 45) return '1 tháng trước';
    if (days <= 345) return months + ' tháng trước';
    if (days <= 545) return '1 năm trước';
    return years + ' năm trước';
  }
}
