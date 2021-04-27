import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResourcesService } from '../../_shared/resources.service';
import { SharedService } from 'src/app/_shared/services/shared.service';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('resourcePaginator', { static: false }) paginator: MatPaginator;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
  public displayedColumns: string[] = ['sno', 'title', 'mainCategory', 'subCategory', 'downloadImage', 'downloads', 'views', 'actionButton'];
  public isLoading: boolean = true;
  public isPageChangeLoader: boolean = false;
  public resourcesList: any = [];
  public dataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
  public pageIndex: number = 0;
  public totalSize: number = 0;
  public totalDownloads: number = 0;
  public totalViews: number = 0;
  public mainCategoryFilter = [];
  public subCategoryFilter = [];
  public selectedMainCategory: any;
  public selectedSubCategory: any;
  public searchKeyword: string = ''; 
  //   { name: 'Indirect', value: 'Indirect' },
  //   { name: 'Descriptive', value: 'Descriptive' },
  //   { name: 'Occurrences', value: 'Occurrences' },
  //   { name: 'Temporal Dimensions', value: 'Temporal Dimensions' },
  //   { name: 'Strength of a behaviour', value: 'Strength of a behaviour' },
  //   { name: 'Sampling procedures', value: 'Sampling procedures' },
  //   { name: 'Indirect preference', value: 'Indirect preference' },
  //   { name: 'Direct Preference', value: 'Direct Preference' },
  //   { name: 'Discrete Trail', value: 'Discrete Trail' }, { name: 'Frequency', value: 'Frequency' },
  //   { name: 'Duration', value: 'Duration' },
  //   { name: 'Occurrences per interval', value: 'Occurrences per interval' }
  // ];

  constructor(private router: Router,
    private sharedService: SharedService,
    private resourcesService: ResourcesService) { }

  ngOnInit(): void {
    this.sharedService.getMainCategories()
      .subscribe(response => {
        this.mainCategoryFilter = response;
        this.getResourcesList();
      });
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private getPageQueryObj() {
    return {
      pageNo: this.pageIndex,
      pageSize: 10,
      sortBy: 'id',
      mainCategory: this.selectedMainCategory ? this.selectedMainCategory.mainCategory : 'ALL',
      subCategory: this.selectedSubCategory || 'ALL',
      search: this.searchKeyword || 'ALL'
    };
  }

  private getResourcesList() {
    const queryObj = this.getPageQueryObj();
    this.resourcesService.getResourcesList(queryObj)
      .subscribe(response => {
        if (response && response.data) {
          this.resourcesList = response.data;
          this.totalSize = response.totalSize;
          this.totalDownloads = response.totalDownloads;
          this.totalViews = response.totalViews;
          this.initialiseTable(this.resourcesList);
          this.isLoading = false;
          this.isPageChangeLoader = false;
        }
      })
  }


  private initialiseTable(list: any[]) {
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.sort = this.sort;
  }


  downloadFile(fileName: string = 'sample.pdf') {
    this.resourcesService.downloadFileAPI(fileName)
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

  public onSelectionChange(checked: boolean, resourceId: number | string) {
    const resourceIndex = this.resourcesList.findIndex(resource => resource.id.toString() === resourceId.toString());
    this.resourcesList[resourceIndex]['isSelected'] = checked;
  }


  public onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.isPageChangeLoader = true;
    this.getResourcesList();
  }

  public onMainCategoryChange() {
    this.subCategoryFilter = this.selectedMainCategory.subCategory;
    this.getResourcesList();
  }

  public onSubCategoryChange() {
    this.getResourcesList();
  }

  public getSearchFilter() {
    this.getResourcesList();
  }

  public downloadSelectedFiles() {
    const filesList = [];
    this.resourcesList.forEach(resource => {
      if (resource.isSelected) {
        filesList.push(resource.name);
      }
    });
    if (filesList.length > 0) {
      this.resourcesService.downloadMultipleFiles(filesList)
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);    
          const link = this.downloadZipLink.nativeElement;
          link.href = url;
          link.download = 'Zip_Resources.zip';
          link.click();
          window.URL.revokeObjectURL(url);
        })
    }
  }
}
