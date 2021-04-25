import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/_shared/services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public isLoading: boolean = false;
  public mainCategories: any[] = [];
  public subCategories: any[] = [];
  public currentselectedMainCategoryIndex: number = -1;
  public isAddNewMainCategoryView: boolean = false;
  public isAddNewSubCategoryView: boolean = false;
  public newMainCategory: string = '';
  public newSubCategory: string = '';

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getMainCategories();
  }

  private getMainCategories() {
    this.sharedService.getMainCategories()
      .subscribe(response => {
        this.mainCategories = response.data;
      });
  }

  public onSelectMainCategory(index: number) {
    this.closeAddNewMainCategoryView();
    if (this.currentselectedMainCategoryIndex >= 0) {
      this.mainCategories[this.currentselectedMainCategoryIndex]['isSelected'] = false;
    }
    this.mainCategories[index]['isSelected'] = true;
    this.currentselectedMainCategoryIndex = index;
    this.subCategories = this.mainCategories[index].subCategory;
  }

  public addNewMainCategory() {
    this.isAddNewMainCategoryView = true;
    this.isAddNewSubCategoryView = false;
    this.subCategories = [];
    if (this.currentselectedMainCategoryIndex >= 0) {
      this.mainCategories[this.currentselectedMainCategoryIndex]['isSelected'] = false;
      this.currentselectedMainCategoryIndex = -1;
    }
  }

  public closeAddNewMainCategoryView() {
    this.newMainCategory = '';
    this.isAddNewMainCategoryView = false;
  }

  public onSaveNewMainCategory() {
    if (this.newMainCategory) {
    // TODO: API call to add New Main Category
      this.mainCategories.push({name: this.newMainCategory, value: this.newMainCategory, subCategory: []})
      this.closeAddNewMainCategoryView();
    }
  }

  public addNewSubCategory() {
    this.isAddNewSubCategoryView = true;
  }

  public closeAddNewSubCategoryView() {
    this.newSubCategory = '';
    this.isAddNewSubCategoryView = false;
  }

  public onSaveNewSubCategory() {
    if (this.newSubCategory) {
    // TODO: API call to add New Main Category
      this.subCategories.push({ name: this.newSubCategory, value: this.newSubCategory })
      this.closeAddNewSubCategoryView();
      console.log('mainCatregory', this.mainCategories);
      
    }
  }
}
