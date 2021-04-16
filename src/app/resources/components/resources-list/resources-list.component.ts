import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResourcesService } from '../../_shared/resources.service';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('resourcePaginator') paginator: MatPaginator;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
  public displayedColumns: string[] = ['title', 'mainCategory', 'subCategory', 'downloadImage', 'downloads', 'views'];
  public isLoading: boolean = true;
  public resourcesList: any = [];
  public dataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);

  constructor(private router: Router,
    private resourcesService: ResourcesService) { }

  ngOnInit(): void {
    this.getAllResources();
  }

  private getAllResources() {
    this.resourcesService.getAllResources()
      .subscribe(response => {
        if (response && response.data) {
          this.resourcesList = response.data;
          console.log(this.resourcesList);
          this.initialiseTable(this.resourcesList);
          this.isLoading = false;
        }
      })
  }


  private initialiseTable(list: any[]) {
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  downloadFile(fileName: string = 'sample.pdf') {
    this.resourcesService.downloadFileAPI()
      .subscribe(response => {
        const url = window.URL.createObjectURL(response);    
        const link = this.downloadZipLink.nativeElement;
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  navigateToUrl(resourceId: any) {
    this.router.navigate(['/resources/tti-resource-detail', resourceId])
  }

}
