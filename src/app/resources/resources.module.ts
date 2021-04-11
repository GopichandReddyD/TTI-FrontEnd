import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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
    ResourcesRoutingModule
  ],
  providers: [
    ResourcesService
  ]
})
export class ResourcesModule { }
