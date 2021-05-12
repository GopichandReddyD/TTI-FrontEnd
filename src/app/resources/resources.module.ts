import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ResourcesListComponent } from './components/resources-list/resources-list.component';
import { ResourceDetailComponent } from './components/resource-detail/resource-detail.component';
import { ResourcesService } from './_shared/resources.service';
import { ResourcesRoutingModule } from './resources-routing.module';



@NgModule({
  declarations: [ResourcesListComponent, ResourceDetailComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    YouTubePlayerModule,
    PdfViewerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ResourcesRoutingModule
  ],
  providers: [
    ResourcesService
  ]
})
export class ResourcesModule { }
