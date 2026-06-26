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
            { path: 'dashboard', component: ProductsComponent }, // Temp dashboard
            { path: 'products', component: ProductsComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: 'inventory', loadComponent: () => import('./admin/inventory/inventory.component').then(m => m.InventoryComponent) },
            { path: 'transactions', loadComponent: () => import('./admin/transactions/transactions.component').then(m => m.TransactionsComponent) },
            { path: 'transactions/create', loadComponent: () => import('./admin/transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) },
            { path: 'transactions/edit/:id', loadComponent: () => import('./admin/transaction-create/transaction-create.component').then(m => m.TransactionCreateComponent) },
            { path: 'transactions/:id', loadComponent: () => import('./admin/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent) },
            { path: 'roles', component: RolesComponent },
            { path: 'users', component: UsersComponent },
            { path: 'audits', loadComponent: () => import('./admin/audits/audits.component').then(m => m.AuditsComponent) }
        ]
    }
];
