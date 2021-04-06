import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResourcesListComponent } from './components/resources-list/resources-list.component';

const routes: Routes = [
  {
    path: 'tti-resources-list',
    component: ResourcesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }

