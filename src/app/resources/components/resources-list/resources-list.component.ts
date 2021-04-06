import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatePipeArgs } from 'ngx-pagination/dist/paginate.pipe';
import { ResourcesService } from '../../_shared/resources.service';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
  public displayedColumns: string[] = ['title', 'mainCategory', 'subCategory', 'downloadImage', 'downloadCount'];
  public isLoading: boolean = true;
  public resourcesList: any = [];
  public dataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
  public paginateConfig: PaginatePipeArgs = {};
  currentPage: 0;

  constructor(private resourcesService: ResourcesService) { }

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

  private setPaginatorConfig() {
    this.paginateConfig.currentPage = 0;
    this.paginateConfig.itemsPerPage = 4;
    this.getAllResources();    
  }

  private initialiseTable(list: any[]) {
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.sort = this.sort;
    // this.paginateConfig.totalItems = this.resourcesList.length;
  }

  public onPageChange(pageChangedEvent: any) {
    this.currentPage = pageChangedEvent;
    this.initialiseTable(this.resourcesList.slice(pageChangedEvent * 4 - 4, pageChangedEvent * 4));
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

}
