import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { permissionGuard } from '../guards/permission.guard';
import { AppPermissions } from '../models/permission.enum';

export const adminRoutes: Routes = [
    {
        path: 'shift-schedules',
        loadComponent: () => import('./shift-schedules/shift-schedules.component').then(m => m.ShiftSchedulesComponent),
        data: { title: 'Lịch Phân Ca' }
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'pos',
        loadComponent: () => import('./pos/pos.component').then(m => m.PosComponent)
    },
    {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent)
    },
    { 
        path: 'categories', 
        component: CategoriesComponent,
        canActivate: [permissionGuard],
        data: { permission: AppPermissions.ViewCategories }
    },
    { 
        path: 'inventory', 
        loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent) 
    },
    { 
        path: 'inventory/wastage', 
        loadComponent: () => import('./inventory/wastage-list/wastage-list.component').then(m => m.WastageListComponent) 
    },
    {
        path: 'inventory/:productId',
        loadComponent: () => import('./inventory/inventory-detail/inventory-detail.component').then(m => m.InventoryDetailComponent)
    },
    { 
        path: 'inventory/wastage/create', 
        loadComponent: () => import('./inventory/wastage-create/wastage-create.component').then(m => m.WastageCreateComponent) 
    },
    { 
        path: 'stock-takes', 
        loadComponent: () => import('./stock-takes/stock-takes.component').then(m => m.StockTakesComponent) 
    },
    { 
        path: 'stock-takes/create', 
        loadComponent: () => import('./stock-takes/stock-take-create/stock-take-create.component').then(m => m.StockTakeCreateComponent) 
    },
    { 
        path: 'stock-takes/:id', 
        loadComponent: () => import('./stock-takes/stock-take-detail/stock-take-detail.component').then(m => m.StockTakeDetailComponent) 
    },
    { 
        path: 'products', 
        component: ProductsComponent,
        canActivate: [permissionGuard],
        data: { permission: AppPermissions.ViewProducts }
    },
    { 
        path: 'products/low-stock', 
        loadComponent: () => import('./products/low-stock/low-stock.component').then(m => m.LowStockComponent) 
    },
    { 
        path: 'transactions', 
        loadComponent: () => import('./transactions/transactions.component').then(m => m.TransactionsComponent) 
    },
    { 
        path: 'transactions/create', 
        loadComponent: () => import('./transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) 
    },
    {
        path: 'purchase-orders',
        loadComponent: () => import('./purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent)
    },
    {
        path: 'purchase-orders/create',
        loadComponent: () => import('./purchase-orders/purchase-order-create/purchase-order-create.component').then(m => m.PurchaseOrderCreateComponent)
    },
    {
        path: 'purchase-orders/:id',
        loadComponent: () => import('./purchase-orders/purchase-order-detail/purchase-order-detail.component').then(m => m.PurchaseOrderDetailComponent)
    },
    { 
        path: 'transactions/edit/:id', 
        loadComponent: () => import('./transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) 
    },
    { 
        path: 'transactions/:id', 
        loadComponent: () => import('./transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent) 
    },
    { 
        path: 'roles', 
        component: RolesComponent,
        canActivate: [permissionGuard],
        data: { permission: AppPermissions.ViewRoles }
    },
    { 
        path: 'users', 
        component: UsersComponent,
        canActivate: [permissionGuard],
        data: { permission: AppPermissions.ViewUsers }
    },
    {
        path: 'customers',
        loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent)
    },
    {
        path: 'customer-debts',
        loadComponent: () => import('./customer-debts/customer-debts.component').then(m => m.CustomerDebtsComponent)
    },
    {
        path: 'suppliers',
        loadComponent: () => import('./suppliers/suppliers.component').then(m => m.SuppliersComponent)
    },
    {
        path: 'supplier-debts',
        loadComponent: () => import('./supplier-debts/supplier-debts.component').then(m => m.SupplierDebtsComponent)
    },
    {
        path: 'promotions',
        loadComponent: () => import('./promotions/promotions.component').then(m => m.PromotionsComponent)
    },
    {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
    },
    { 
        path: 'audits', 
        loadComponent: () => import('./audits/audits.component').then(m => m.AuditsComponent) 
    },
    {
        path: 'return-orders',
        loadComponent: () => import('./return-orders/return-order-list/return-order-list.component').then(m => m.ReturnOrderListComponent)
    },
    {
        path: 'return-orders/create',
        loadComponent: () => import('./return-orders/return-order-form/return-order-form.component').then(m => m.ReturnOrderFormComponent)
    },
    {
        path: 'return-orders/:id',
        loadComponent: () => import('./return-orders/return-order-detail/return-order-detail.component').then(m => m.ReturnOrderDetailComponent)
    },
    {
        path: 'attendance',
        loadComponent: () => import('./attendance/attendance.component').then(m => m.AttendanceComponent),
        data: { title: 'Chấm Công' }
    },
    {
        path: 'payroll',
        loadComponent: () => import('./payroll/payroll.component').then(m => m.PayrollComponent),
        data: { title: 'Tính Lương' }
    },
    {
        path: 'salary-templates',
        loadComponent: () => import('./salary-templates/salary-templates.component').then(m => m.SalaryTemplatesComponent),
        data: { title: 'Mẫu Lương' }
    },
    {
        path: 'employees',
        loadComponent: () => import('./employees/employees.component').then(m => m.EmployeesComponent)
    },
    {
        path: 'departments',
        loadComponent: () => import('./departments/departments.component').then(m => m.DepartmentsComponent)
    },
    {
        path: 'positions',
        loadComponent: () => import('./positions/positions.component').then(m => m.PositionsComponent)
    }
];
