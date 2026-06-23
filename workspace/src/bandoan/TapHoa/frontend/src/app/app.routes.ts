import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './store/store-layout/store-layout.component';
import { HomeComponent } from './store/home/home.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ProductsComponent } from './admin/products/products.component';
import { CategoriesComponent } from './admin/categories/categories.component';

export const routes: Routes = [
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
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', component: ProductsComponent },
            { path: 'categories', component: CategoriesComponent }
        ]
    }
];
