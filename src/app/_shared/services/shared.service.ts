import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedService {
  public headerClick: BehaviorSubject<string> = new BehaviorSubject('');
  public transparentHeader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userloggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userDetails: any;

  constructor(private http: HttpClient) { }

  public checkUserAuthentication(token: string, uuid: string): Observable<any> {
    return this.http.get(`/user/authenticate/${token}/${uuid}`);
    // return this.http.get('../../../assets/mockData/userAuthenticationCheckMockData.json');
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
}
