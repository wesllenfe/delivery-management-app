import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.page').then(m => m.OrdersPage)
  },
  {
    path: 'add-order',
    loadComponent: () => import('./pages/add-order/add-order.page').then(m => m.AddOrderPage)
  },
  {
    path: 'edit-order/:id',
    loadComponent: () => import('./pages/edit-order/edit-order.page').then(m => m.EditOrderPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
