import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { intersection } from 'lodash';

@Injectable()
export class SharedService {
  public headerClick: BehaviorSubject<string> = new BehaviorSubject('');
  public transparentHeader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userloggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userDetails: any;
  public isNavigatedFromLogin: boolean = false;

  constructor(private http: HttpClient) { }

  public checkUserAuthentication(token: string, uuid: string): Observable<any> {
    return this.http.get(`/user/authenticate/${token}/${uuid}`);
    // return this.http.get('../../../assets/mockData/userAuthenticationCheckMockData.json');
  }

  public getMainCategories(): Observable<any> {
    return this.http.get('/admin/getAllCategory');
    // return this.http.get('../../../assets/mockData/getMainCategoriesMockData.json');
  }

  public saveMainCategory(name: string): Observable<any> {
    return this.http.post(`/admin/addMainCategory/${name}`, {});
  }

  public saveSubCategory(mainCategorName: string, subCategorName: string): Observable<any> {
    return this.http.post(`/admin/addMainCategory/${mainCategorName}/${subCategorName}`, {});
  }
  
  public setUserDetails(details: any) {
    this.userDetails = details;
  }

  public getUserDetails(): any {
    return this.userDetails;
  }

  public resetUserDetails() {
    this.userDetails = null;
  }

  public setUserLoggedIn(loggedIn: boolean) {
    this.userloggedIn.next(loggedIn);
  }  
  
  public updateHeaderClick(value: string) {
    this.headerClick.next(value);
  }

  public resetHeaderClick() {
    this.headerClick.next(null);
  }

  public updateTransparentHeader(value: boolean) {
    this.transparentHeader.next(value);
  }

  public hasAccessRole(roles: any[]) {
    const userRole = [];
    userRole.push(this.userDetails.permissions);
    const validRoles = intersection(roles, userRole);
    return (validRoles && validRoles.length > 0);
  }
}
