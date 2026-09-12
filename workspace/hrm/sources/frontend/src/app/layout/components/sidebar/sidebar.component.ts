import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface MenuItem {
  title: string;
  icon?: string;
  route?: string;
  badge?: string;
  badgeClass?: string;
  isHeading?: boolean;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);

  @Input() isMobileOpen = false;
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() closeMobileSidebar = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    // ==========================================
    // 1. QUẢN TRỊ NHÂN SỰ (HRM)
    // ==========================================
    {
      title: 'Quản Trị Nhân Sự',
      isHeading: true
    },
    {
      title: 'Tổng Quan (Dashboard)',
      icon: 'bi-grid-1x2',
      route: '/hrm/dashboard'
    },
    {
      title: 'Quản Lý Phòng Ban',
      icon: 'bi-diagram-3',
      route: '/hrm/departments'
    },
    {
      title: 'Hồ Sơ Nhân Sự',
      icon: 'bi-people',
      route: '/hrm/employees'
    },
    {
      title: 'Bảng Công & Điểm Danh',
      icon: 'bi-calendar-check',
      route: '/hrm/attendances'
    },
    {
      title: 'Đơn Xin Nghỉ Phép',
      icon: 'bi-calendar-minus',
      route: '/hrm/leave-requests'
    },
    {
      title: 'Khen Thưởng & Kỷ Luật',
      icon: 'bi-award',
      route: '/hrm/reward-disciplines'
    },
    {
      title: 'Hợp Đồng Lao Động',
      icon: 'bi-file-earmark-text',
      route: '/hrm/contracts'
    },
    {
      title: 'Lệnh Điều Động',
      icon: 'bi-arrow-left-right',
      route: '/hrm/transfers'
    },
    {
      title: 'Chính Sách Công Ty',
      icon: 'bi-book-half',
      route: '/hrm/policies'
    },

    // ==========================================
    // 2. QUẢN LÝ THIẾT BỊ & TÀI SẢN (EQUIPMENT & ASSETS MODULE)
    // ==========================================
    {
      title: 'Thiết Bị & Tài Sản',
      isHeading: true
    },
    {
      title: 'Quản Lý Thiết Bị',
      icon: 'bi-box-seam',
      route: '/hrm/equipments'
    },
    {
      title: 'Báo Hỏng & Sửa IT',
      icon: 'bi-tools',
      route: '/hrm/equipment-repairs'
    },
    {
      title: 'Quản Lý Tài Sản',
      icon: 'bi-laptop',
      route: '/hrm/assets'
    },

    // ==========================================
    // 3. QUẢN LÝ DỰ ÁN (PM)
    // ==========================================
    {
      title: 'Dự Án & Phòng Ban',
      isHeading: true
    },
    {
      title: 'Quản Lý Dự Án PM',
      icon: 'bi-kanban',
      route: '/pm/dashboard'
    },

    // ==========================================
    // 2. QUẢN TRỊ HỆ THỐNG
    // ==========================================
    {
      title: 'Quản Trị Hệ Thống',
      isHeading: true
    },
    {
      title: 'Người Dùng & Tài Khoản',
      icon: 'bi-person-lines-fill',
      route: '/users'
    },
    {
      title: 'Vai Trò & Chức Năng',
      icon: 'bi-shield-lock',
      route: '/users/roles'
    },
    {
      title: 'Danh Mục Quyền Hạn',
      icon: 'bi-key',
      route: '/users/permissions'
    },

    // ==========================================
    // 3. TÀI KHOẢN CỦA TÔI
    // ==========================================
    {
      title: 'Cá Nhân',
      isHeading: true
    },
    {
      title: 'Hồ Sơ Cá Nhân',
      icon: 'bi-person-badge',
      route: '/profile/overview'
    },
    {
      title: 'Cài Đặt Tài Khoản',
      icon: 'bi-gear',
      route: '/account/settings'
    }
  ];

  ngOnInit(): void {
    this.updateActiveAccordions(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveAccordions(event.urlAfterRedirects || event.url);
      });
  }

  updateActiveAccordions(currentUrl: string): void {
    const checkActive = (items: MenuItem[]): boolean => {
      let anyActive = false;
      for (const item of items) {
        let isDirect = false;
        if (item.route && currentUrl.startsWith(item.route.split('?')[0])) {
          if (item.route === '/dashboard') {
            isDirect = currentUrl === '/dashboard' || currentUrl === '/';
          } else {
            isDirect = true;
          }
        }
        let childActive = false;
        if (item.children && item.children.length > 0) {
          childActive = checkActive(item.children);
          if (childActive) {
            item.isOpen = true;
          }
        }
        if (isDirect || childActive) {
          anyActive = true;
        }
      }
      return anyActive;
    };

    checkActive(this.menuItems);
  }

  isItemActive(item: MenuItem): boolean {
    if (item.route) {
      return this.router.isActive(item.route, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
    }
    if (item.children) {
      return this.hasActiveChild(item.children);
    }
    return false;
  }

  private hasActiveChild(items: MenuItem[]): boolean {
    return items.some(child => {
      if (child.route) {
        return this.router.isActive(child.route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
      }
      if (child.children) {
        return this.hasActiveChild(child.children);
      }
      return false;
    });
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  onCloseMobile(): void {
    this.closeMobileSidebar.emit();
  }
}

