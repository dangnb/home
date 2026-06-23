import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { InventoryComponent } from './inventory/inventory.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'sales', loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent) },
    { path: 'purchases', loadComponent: () => import('./purchases/purchases.component').then(m => m.PurchasesComponent) }
];
