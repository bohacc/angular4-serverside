import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Home } from './home/home.component';

const appRoutes: Routes = [
  { path: '',
    component: Home,
  },
  {
    path: ':code',
    component: Home,
  },
  { path: ':code/search/:searchStr', component: Home },
  { path: ':code/konfigurator/:redirect', component: Home },
  { path: ':code/konfigurator2/:redirect', component: Home },
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
