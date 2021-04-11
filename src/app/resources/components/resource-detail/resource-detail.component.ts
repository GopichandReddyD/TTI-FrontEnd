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
  public resourceID: string;
  public resourceDetails: any;
  public pdfSource: any;

  constructor(private resourcesService: ResourcesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.resourceID = this.activatedRoute.snapshot.params['resourceId'] || '';
    this.getResourceDetails();
  }

  private getFileDetails() {
    if (this.resourceDetails.type.includes('pdf')) {
      this,this.resourcesService.downloadFileAPI()
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          this.pdfSource = url;
        });
    }
  }

  private getResourceDetails() {
    this.isLoading = true;
    this.resourcesService.getResourceDetails(this.resourceID)
      .subscribe(response => {
        const resource = response.data.find(res => res.id.toString() === this.resourceID.toString());
        this.resourceDetails = resource;
        this.getFileDetails();
        this.isLoading = false;
      });
  }

}
