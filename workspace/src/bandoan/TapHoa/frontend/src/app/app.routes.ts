import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './store/store-layout/store-layout.component';
import { HomeComponent } from './store/home/home.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ProductsComponent } from './admin/products/products.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { LoginComponent } from './auth/login/login.component';
import { RolesComponent } from './admin/roles/roles.component';
import { UsersComponent } from './admin/users/users.component';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { AppPermissions } from './models/permission.enum';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: StoreLayoutComponent,
        children: [
            { path: '', component: HomeComponent }
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
            path: 'shift-schedules',
            loadComponent: () => import('./admin/shift-schedules/shift-schedules.component').then(m => m.ShiftSchedulesComponent),
            data: { title: 'Lịch Phân Ca' }
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'pos',
                loadComponent: () => import('./admin/pos/pos.component').then(m => m.PosComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./admin/orders/orders.component').then(m => m.OrdersComponent)
            },
            { 
                path: 'categories', 
                component: CategoriesComponent,
                canActivate: [permissionGuard],
                data: { permission: AppPermissions.ViewCategories }
            },
            { 
                path: 'inventory', 
                loadComponent: () => import('./admin/inventory/inventory.component').then(m => m.InventoryComponent) 
            },
            { 
                path: 'inventory/wastage', 
                loadComponent: () => import('./admin/inventory/wastage-list/wastage-list.component').then(m => m.WastageListComponent) 
            },
            {
                path: 'inventory/:productId',
                loadComponent: () => import('./admin/inventory/inventory-detail/inventory-detail.component').then(m => m.InventoryDetailComponent)
            },
            { 
                path: 'inventory/wastage/create', 
                loadComponent: () => import('./admin/inventory/wastage-create/wastage-create.component').then(m => m.WastageCreateComponent) 
            },
            { 
                path: 'stock-takes', 
                loadComponent: () => import('./admin/stock-takes/stock-takes.component').then(m => m.StockTakesComponent) 
            },
            { 
                path: 'stock-takes/create', 
                loadComponent: () => import('./admin/stock-takes/stock-take-create/stock-take-create.component').then(m => m.StockTakeCreateComponent) 
            },
            { 
                path: 'stock-takes/:id', 
                loadComponent: () => import('./admin/stock-takes/stock-take-detail/stock-take-detail.component').then(m => m.StockTakeDetailComponent) 
            },
            { 
                path: 'products', 
                component: ProductsComponent,
                canActivate: [permissionGuard],
                data: { permission: AppPermissions.ViewProducts }
            },
            { 
                path: 'products/low-stock', 
                loadComponent: () => import('./admin/products/low-stock/low-stock.component').then(m => m.LowStockComponent) 
            },
            { 
                path: 'transactions', 
                loadComponent: () => import('./admin/transactions/transactions.component').then(m => m.TransactionsComponent) 
            },
            { 
                path: 'transactions/create', 
                loadComponent: () => import('./admin/transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) 
            },
            {
                path: 'purchase-orders',
                loadComponent: () => import('./admin/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent)
            },
            {
                path: 'purchase-orders/create',
                loadComponent: () => import('./admin/purchase-orders/purchase-order-create/purchase-order-create.component').then(m => m.PurchaseOrderCreateComponent)
            },
            {
                path: 'purchase-orders/:id',
                loadComponent: () => import('./admin/purchase-orders/purchase-order-detail/purchase-order-detail.component').then(m => m.PurchaseOrderDetailComponent)
            },
            { 
                path: 'transactions/edit/:id', 
                loadComponent: () => import('./admin/transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) 
            },
            { 
                path: 'transactions/:id', 
                loadComponent: () => import('./admin/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent) 
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
                loadComponent: () => import('./admin/customers/customers.component').then(m => m.CustomersComponent)
            },
            {
                path: 'customer-debts',
                loadComponent: () => import('./admin/customer-debts/customer-debts.component').then(m => m.CustomerDebtsComponent)
            },
            {
                path: 'suppliers',
                loadComponent: () => import('./admin/suppliers/suppliers.component').then(m => m.SuppliersComponent)
            },
            {
                path: 'supplier-debts',
                loadComponent: () => import('./admin/supplier-debts/supplier-debts.component').then(m => m.SupplierDebtsComponent)
            },
            {
                path: 'promotions',
                loadComponent: () => import('./admin/promotions/promotions.component').then(m => m.PromotionsComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./admin/reports/reports.component').then(m => m.ReportsComponent)
            },
            { 
                path: 'audits', 
                loadComponent: () => import('./admin/audits/audits.component').then(m => m.AuditsComponent) 
            },
            {
                path: 'return-orders',
                loadComponent: () => import('./admin/return-orders/return-order-list/return-order-list.component').then(m => m.ReturnOrderListComponent)
            },
            {
                path: 'return-orders/create',
                loadComponent: () => import('./admin/return-orders/return-order-form/return-order-form.component').then(m => m.ReturnOrderFormComponent)
            },
            {
                path: 'return-orders/:id',
                loadComponent: () => import('./admin/return-orders/return-order-detail/return-order-detail.component').then(m => m.ReturnOrderDetailComponent)
            }
        ]
    }
];
