import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesService } from '../../_shared/resources.service';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.scss']
})
export class ResourceDetailComponent implements OnInit {
  public isLoading: boolean = true;
  public resourceId: string;
  public resourceDetails: any;
  public pdfSource: any;
  public videoId: any;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

  constructor(private resourcesService: ResourcesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.resourceId = this.activatedRoute.snapshot.params['resourceId'] || '';
    this.getResourceDetails();
  }

  private getFileDetails() {
    if (this.resourceDetails.type.includes('pdf')) {
      const fileName = this.resourceDetails.name;
      this.resourcesService.downloadFileAPI(fileName)
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          this.pdfSource = url;
        });
        
    }else if(this.resourceDetails.type.includes('video')) {
      this.videoId = this.resourceDetails.filePath.split('?v=')[1]
    }
  }

  private getResourceDetails() {
    this.isLoading = true;
    this.resourcesService.getResourceDetails(this.resourceId)
      .subscribe(response => {
        this.resourceDetails = response;
        this.getFileDetails();
        this.isLoading = false;
      });
  }

  public downloadFile() {
    this.resourcesService.downloadFileAPI(this.resourceDetails.name)
      .subscribe(response => {
        const url = window.URL.createObjectURL(response);    
        const link = this.downloadZipLink.nativeElement;
        link.href = url;
        link.download = this.resourceDetails.name;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

}
