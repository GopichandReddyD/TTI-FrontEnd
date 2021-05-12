import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/_shared/services/shared.service';
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
  public showEditView: boolean = false;
  public uploadForm: FormGroup;
  public mainCategory = [];
  public subCategory: any;
  public isLoadingEditView: boolean = true;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

  constructor(private resourcesService: ResourcesService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

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
    } else if(this.resourceDetails.type.includes('video')) {
      this.videoId = this.getVideoId(this.resourceDetails.filePath);
    }
  }

  private getVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
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

  public closeEdiView() {
    this.showEditView = false;
    this.isLoadingEditView = true;
  }

  public toggleEditView() {
    this.showEditView = true;
    if (this.showEditView) {
      this.sharedService.getMainCategories()
        .subscribe(response => {
          this.mainCategory = response;
          const categoryIndex = this.mainCategory.findIndex(ctg => ctg.mainCategory === this.resourceDetails.mainCategory);
          let selectedMainCategory;
          if (categoryIndex > -1) {
            selectedMainCategory = this.mainCategory[categoryIndex];
            this.subCategory = this.mainCategory[categoryIndex].subCategory
          }
          this.setFormData(selectedMainCategory);
        });
    }
  }

  public onMainCategoryChange() {
    this.subCategory = this.uploadForm.value.mainCategory.subCategory;
  }

  private setFormData(selectedMainCategory: any) {
    this.uploadForm = new FormGroup({
      title: new FormControl(this.resourceDetails.title, Validators.required),
      description: new FormControl(this.resourceDetails.description, Validators.required),
      mainCategory: new FormControl(selectedMainCategory, Validators.required),
      subCategory: new FormControl(this.resourceDetails.subCategory, Validators.required)
    });
    this.isLoadingEditView = false;
  }

  public submitUploadForm() {
    if (this.uploadForm.valid) {
      const formDetails = {
        "title": this.uploadForm.value.title,
        "description": this.uploadForm.value.description,
        "mainCategory": this.uploadForm.value.mainCategory.mainCategory,
        "subCategory": this.uploadForm.value.subCategory
      }
        this.resourcesService.updateResourceDetails(this.resourceDetails.uuid, formDetails)
          .subscribe(response => {
            this.closeEdiView();
            this.getResourceDetails();
          })
    }
  }

  public deleteResource() {
    this.resourcesService.deleteResourceDetails(this.resourceId)
      .subscribe(response => {
        this.router.navigate(['/resources/tti-resources-list/ALL']);
      });
  }

}
