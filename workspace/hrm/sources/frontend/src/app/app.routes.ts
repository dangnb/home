import { Routes } from '@angular/router';
import { MasterLayoutComponent } from './layout/master-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'hrm/dashboard',
        pathMatch: 'full'
      },
      // ==========================================
      // CORE HRM PLATFORM ROUTES
      // ==========================================
      {
        path: 'hrm',
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./pages/hrm/dashboard/hrm-dashboard.component').then(m => m.HrmDashboardComponent),
            title: 'HRM Dashboard - Tổng Quan Nhân Sự'
          },
          {
            path: 'departments',
            loadComponent: () => import('./pages/hrm/departments/departments-list.component').then(m => m.DepartmentsListComponent),
            title: 'Quản Lý Phòng Ban - HRM Platform'
          },
          {
            path: 'employees',
            loadComponent: () => import('./pages/hrm/employees/employees-list.component').then(m => m.EmployeesListComponent),
            title: 'Quản Lý Hồ Sơ Nhân Sự - HRM Platform'
          },
          {
            path: 'attendances',
            loadComponent: () => import('./pages/hrm/attendances/attendances-list.component').then(m => m.AttendancesListComponent),
            title: 'Bảng Công & Điểm Danh - HRM Platform'
          },
          {
            path: 'leave-requests',
            loadComponent: () => import('./pages/hrm/leave-requests/leave-requests-list.component').then(m => m.LeaveRequestsListComponent),
            title: 'Quản Lý Đơn Nghỉ Phép - HRM Platform'
          },
          {
            path: 'reward-disciplines',
            loadComponent: () => import('./pages/hrm/reward-disciplines/reward-disciplines-list.component').then(m => m.RewardDisciplinesListComponent),
            title: 'Quản Lý Thưởng & Phạt - HRM Platform'
          }
        ]
      },
      // ==========================================
      // EXISTING TEMPLATE ROUTES
      // ==========================================
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - Metronic'
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users-list/users-list.component').then(m => m.UsersListComponent),
        title: 'User Management - Metronic'
      },
      {
        path: 'users/list',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users/view',
        loadComponent: () => import('./pages/users/user-view/user-view.component').then(m => m.UserViewComponent),
        title: 'View User - Metronic'
      },
      {
        path: 'users/view/:id',
        loadComponent: () => import('./pages/users/user-view/user-view.component').then(m => m.UserViewComponent),
        title: 'View User - Metronic'
      },
      {
        path: 'users/roles',
        loadComponent: () => import('./pages/users/roles-list/roles-list.component').then(m => m.RolesListComponent),
        title: 'Roles & Permissions - Metronic'
      },
      {
        path: 'users/permissions',
        redirectTo: 'users/roles',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        redirectTo: 'profile/overview',
        pathMatch: 'full'
      },
      {
        path: 'profile/overview',
        loadComponent: () => import('./pages/profile/overview/profile-overview.component').then(m => m.ProfileOverviewComponent),
        title: 'User Profile - Metronic'
      },
      {
        path: 'ecommerce/catalog',
        loadComponent: () => import('./pages/ecommerce/catalog/products-list/products-list.component').then(m => m.ProductsListComponent),
        title: 'Products Catalog - Metronic'
      },
      {
        path: 'ecommerce/orders',
        loadComponent: () => import('./pages/ecommerce/sales/orders-list/orders-list.component').then(m => m.OrdersListComponent),
        title: 'Orders Listing - Metronic'
      },
      {
        path: 'ecommerce/customers',
        loadComponent: () => import('./pages/ecommerce/customers/customers-list/customers-list.component').then(m => m.CustomersListComponent),
        title: 'Customers Listing - Metronic'
      },
      {
        path: 'account/overview',
        loadComponent: () => import('./pages/account/overview/overview.component').then(m => m.AccountOverviewComponent),
        title: 'Account Overview - Metronic'
      },
      {
        path: 'account/settings',
        loadComponent: () => import('./pages/account/settings/settings.component').then(m => m.AccountSettingsComponent),
        title: 'Account Settings - Metronic'
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./pages/subscriptions/subscriptions-list/subscriptions-list.component').then(m => m.SubscriptionsListComponent),
        title: 'Subscriptions - Metronic'
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent),
        title: 'Projects - Metronic'
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
        title: 'Calendar - Metronic'
      }
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Sign In - Metronic'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 Not Found - Metronic'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
