import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { GestionProductComponent } from './gestion-product/gestion-product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        redirectTo: 'product',
    },
    { 
        path: 'product', 
        component: GestionProductComponent 
    },
    { 
        path: 'product/new', 
        component: ProductFormComponent 
    },
    { 
        path: 'product/:id/edit', 
        component: ProductEditComponent 
    }
];