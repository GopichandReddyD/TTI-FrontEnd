import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesService } from '../../_shared/resources.service';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.scss']
})
export class ResourceDetailComponent implements OnInit {
  public isLoading: boolean = true;
  public resourceName: string;
  public resourceDetails: any;
  public pdfSource: any;
  public videoId: any;

  constructor(private resourcesService: ResourcesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.resourceName = this.activatedRoute.snapshot.params['resourceName'] || '';
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
    this.resourcesService.getResourceDetails(this.resourceName)
      .subscribe(response => {
        const resource = response.find(res => res.id.toString() === this.resourceName.toString());
        this.resourceDetails = resource;
        this.getFileDetails();
        this.isLoading = false;
      });
  }

}
