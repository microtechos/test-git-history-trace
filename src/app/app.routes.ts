import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { NotificationBannerComponent } from './components/notification-banner/notification-banner.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'products', component: ProductCardComponent },
  { path: 'notifications', component: NotificationBannerComponent },
  { path: 'orders', component: OrderSummaryComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];
