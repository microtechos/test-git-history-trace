import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { NotificationBannerComponent } from './components/notification-banner/notification-banner.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'products', component: ProductCardComponent },
  { path: 'notifications', component: NotificationBannerComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];
