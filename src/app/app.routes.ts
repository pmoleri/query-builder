import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { OrdersComponent } from './orders/orders.component';
import { ChildViewComponent } from './child-view/child-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'error', component: UncaughtErrorComponent },
  { path: 'orders', component: OrdersComponent, data: { text: 'Orders' } },
  { path: 'child-view', component: ChildViewComponent, data: { text: 'Child-View' } },
  { path: '**', component: PageNotFoundComponent } // must always be last
];
