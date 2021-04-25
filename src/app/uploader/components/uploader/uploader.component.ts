import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

import { UploaderService } from '../../_shared/uploader.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  isLoading: boolean = true;
  isFormSubmitted: boolean = false;
  uploadForm: FormGroup;
  selectedFileName: string = '';
  mainCategory = [
    { name: 'FBA', value: 'FBA', subCategory: [{ name: 'Indirect', value: 'Indirect' }, { name: 'Descriptive', value: 'Descriptive' }] },
    { name: 'Data Collection', value: 'Data Collection', subCategory: [{ name: 'Occurrences', value: 'Occurrences' }, { name: 'Temporal Dimensions', value: 'Temporal Dimensions' }, { name: 'Strength of a behaviour', value: 'Strength of a behaviour' }, { name: 'Sampling procedures', value: 'Sampling procedures' }] },
    { name: 'Preferences', value: 'Preferences', subCategory: [{ name: 'Indirect preference', value: 'Indirect preference' }, { name: 'Direct Preference', value: 'Direct Preference' }] },
    { name: 'Interobserver', value: 'Interobserver', subCategory: [{ name: 'Discrete Trail', value: 'Discrete Trail' }, { name: 'Frequency', value: 'Frequency' }, { name: 'Duration', value: 'Duration' }, { name: 'Occurrences per interval', value: 'Occurrences per interval' }] },
  ];
  subCategory: any;

  constructor(private uploaderService: UploaderService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
    this.setFormData();
  }

  private setFormData() {
    this.uploadForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      subCategory: new FormControl('', Validators.required),
      mainCategory: new FormControl(null, Validators.required),
      keywords: new FormControl(''),
      attachmentType: new FormControl('', Validators.required),
      resourceAttachment: new FormControl('', Validators.required),
      filePath: new FormControl('', Validators.required),
      references: new FormControl('')
    });
    this.isLoading = false;
  }

  public onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFileName = event.target.files[0].name;
      this.uploadForm.get('resourceAttachment').setValue(event.target.files[0]);
    }
  }

  public onResourceTypeChange() {
    if (this.uploadForm.get('attachmentType').value === 'file') {
      this.uploadForm.get('resourceAttachment').enable();
      this.uploadForm.get('filePath').setValue('');
      this.uploadForm.get('filePath').disable();
    } else if (this.uploadForm.get('attachmentType').value === 'video') {
      this.uploadForm.get('filePath').enable();
      this.uploadForm.get('resourceAttachment').setValue('');
      this.uploadForm.get('resourceAttachment').disable();
      this.selectedFileName = '';
    }
  }

  public submitUploadForm() {
    if (this.uploadForm.valid) {
      this.isFormSubmitted = true;
      if (this.uploadForm.value.attachmentType === 'file') {
        // Upload file API
        this.uploadFileData();
      } else if (this.uploadForm.value.attachmentType === 'video') {
        // Upload video API
        this.uploadVideoData();
      }
    }
  }

  private uploadFileData() {
    const formData = new FormData();
    const formDetails = {
      "title": this.uploadForm.value.title,
      "description": this.uploadForm.value.description,
      "mainCategory": this.uploadForm.value.mainCategory.value,
      "subCategory": this.uploadForm.value.subCategory,
      "keywords": this.uploadForm.value.keywords,
      "ref": this.uploadForm.value.references
    }
    formData.append('file', this.uploadForm.get('resourceAttachment').value);
    formData.append('fileDetails', JSON.stringify(formDetails));
    this.uploaderService.uploadResourceFileForm(formData)
      .subscribe(response => {
        this.uploadForm.reset();
        this.openSnackBar('Upload Successful');
        this.isFormSubmitted = false
      }, err => {
        this.openSnackBar('Upload Not Successful, Please retry');
        this.isFormSubmitted = false
      });
  }

  private uploadVideoData() {
    const payload = {
      "title": this.uploadForm.value.title,
      "description": this.uploadForm.value.description,
      "mainCategory": this.uploadForm.value.mainCategory.value,
      "subCategory": this.uploadForm.value.subCategory,
      "type": "video",
      "name": this.uploadForm.value.title,
      "filePath": this.uploadForm.value.filePath,
      "keywords": this.uploadForm.value.keywords,
      "ref": this.uploadForm.value.references,
      "downloads": 0,
      "views": 0
    };
    this.uploaderService.uploadResourceVideoForm(payload)
      .pipe(finalize(() => this.isFormSubmitted = false))
      .subscribe(response => {
        this.uploadForm.reset();
        this.openSnackBar('Upload Successful');
      }, err => {
        this.openSnackBar('Upload Not Successful, Please retry');
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }

  public onMainCategoryChange() {
    this.subCategory = this.uploadForm.value.mainCategory.subCategory;
  }

}
