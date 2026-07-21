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
        canActivate: [authGuard],
        loadChildren: () => import('./_metronic/layout/layout.module').then(m => m.LayoutModule)
    }
];
