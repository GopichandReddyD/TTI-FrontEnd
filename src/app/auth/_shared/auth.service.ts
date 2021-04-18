import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  public loginUser(payload: any): Observable<any> {
    return this.http.post('/user/login', payload);
    // return this.http.get('../../../assets/mockData/loginUserMockData.json')
  }
}
