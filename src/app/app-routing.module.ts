import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SettingsComponent } from './components/settings/settings.component';
import { USER_ROLES } from './_shared/constants/constants';
import { AuthGuard } from './_shared/guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
  },
  {
    path: 'resources',
    loadChildren: () => import('./resources/resources.module').then(module => module.ResourcesModule)
  },
  {
    path: 'uploader',
    canLoad: [AuthGuard],
    loadChildren: () => import('./uploader/uploader.module').then(module => module.UploaderModule),
    data: {
      roles: [ USER_ROLES.ADMIN, USER_ROLES.UPLOADER ]
    }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [ USER_ROLES.ADMIN ]
    }
  },
  { path: '', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
