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
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'categories', component: CategoriesComponent },
            { path: 'inventory', loadComponent: () => import('./admin/inventory/inventory.component').then(m => m.InventoryComponent) },
            { path: 'inventory/wastage', loadComponent: () => import('./admin/inventory/wastage-list/wastage-list.component').then(m => m.WastageListComponent) },
            { path: 'inventory/wastage/create', loadComponent: () => import('./admin/inventory/wastage-create/wastage-create.component').then(m => m.WastageCreateComponent) },
            { path: 'stock-takes', loadComponent: () => import('./admin/stock-takes/stock-takes.component').then(m => m.StockTakesComponent) },
            { path: 'stock-takes/create', loadComponent: () => import('./admin/stock-takes/stock-take-create/stock-take-create.component').then(m => m.StockTakeCreateComponent) },
            { path: 'stock-takes/:id', loadComponent: () => import('./admin/stock-takes/stock-take-detail/stock-take-detail.component').then(m => m.StockTakeDetailComponent) },
            { path: 'products', component: ProductsComponent },
            { path: 'products/low-stock', loadComponent: () => import('./admin/products/low-stock/low-stock.component').then(m => m.LowStockComponent) },
            { path: 'transactions', loadComponent: () => import('./admin/transactions/transactions.component').then(m => m.TransactionsComponent) },
            { path: 'transactions/create', loadComponent: () => import('./admin/transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) },
            { path: 'transactions/edit/:id', loadComponent: () => import('./admin/transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) },
            { path: 'transactions/:id', loadComponent: () => import('./admin/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent) },
            { path: 'roles', component: RolesComponent },
            { path: 'users', component: UsersComponent },
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
            { path: 'audits', loadComponent: () => import('./admin/audits/audits.component').then(m => m.AuditsComponent) }
        ]
    }
];
