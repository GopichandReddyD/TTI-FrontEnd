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
  public displayedColumns: string[] = ['sno', 'title', 'mainCategory', 'subCategory', 'downloadImage', 'downloads', 'views', 'actionButton'];
  public isLoading: boolean = true;
  public resourcesList: any = [];
  public dataSource: MatTableDataSource<any[]> = new MatTableDataSource([]);
  public totalDownloads: number = 0;
  public totalViews: number = 0;
  public mainCategoryFilter = [
    { name: 'FBA', value: 'FBA', subCategory: [{ name: 'Indirect', value: 'Indirect' }, { name: 'Descriptive', value: 'Descriptive' }] },
    { name: 'Data Collection', value: 'Data Collection', subCategory: [{ name: 'Occurrences', value: 'Occurrences' }, { name: 'Temporal Dimensions', value: 'Temporal Dimensions' }, { name: 'Strength of a behaviour', value: 'Strength of a behaviour' }, { name: 'Sampling procedures', value: 'Sampling procedures' }] },
    { name: 'Preferencces', value: 'Preferencces', subCategory: [{ name: 'Indirect preference', value: 'Indirect preference' }, { name: 'Direct Preference', value: 'Direct Preference' }] },
    { name: 'Interobserver', value: 'Interobserver', subCategory: [{ name: 'Discrete Trail', value: 'Discrete Trail' }, { name: 'Frequency', value: 'Frequency' }, { name: 'Duration', value: 'Duration' }, { name: 'Occurrences per interval', value: 'Occurrences per interval' }] },
  ];
  public subCategoryFilter = [
    { name: 'Indirect', value: 'Indirect' },
    { name: 'Descriptive', value: 'Descriptive' },
    { name: 'Occurrences', value: 'Occurrences' },
    { name: 'Temporal Dimensions', value: 'Temporal Dimensions' },
    { name: 'Strength of a behaviour', value: 'Strength of a behaviour' },
    { name: 'Sampling procedures', value: 'Sampling procedures' },
    { name: 'Indirect preference', value: 'Indirect preference' },
    { name: 'Direct Preference', value: 'Direct Preference' },
    { name: 'Discrete Trail', value: 'Discrete Trail' }, { name: 'Frequency', value: 'Frequency' },
    { name: 'Duration', value: 'Duration' },
    { name: 'Occurrences per interval', value: 'Occurrences per interval' }
  ];

  constructor(private router: Router,
    private resourcesService: ResourcesService) { }

  ngOnInit(): void {
    this.getAllResources();
  }

  private getAllResources() {
    this.resourcesService.getAllResources()
      .subscribe(response => {
        if (response) {
          this.resourcesList = response;
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

}
