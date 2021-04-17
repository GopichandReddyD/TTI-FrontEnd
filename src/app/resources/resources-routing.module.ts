import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResourcesListComponent } from './components/resources-list/resources-list.component';
import { ResourceDetailComponent } from './components/resource-detail/resource-detail.component';

const routes: Routes = [
  {
    path: 'tti-resources-list',
    component: ResourcesListComponent
  },
  {
    path: 'tti-resource-detail/:resourceId',
    component: ResourceDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }

