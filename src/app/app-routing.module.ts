import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

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
    loadChildren: () => import('./uploader/uploader.module').then(module => module.UploaderModule)
  },
  { path: '', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
