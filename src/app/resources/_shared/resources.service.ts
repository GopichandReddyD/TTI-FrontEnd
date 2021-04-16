import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResourcesService {

  constructor(private http: HttpClient) { }

  public getAllResources(): Observable<any> {
    return this.http.get('/getAllFiles');
  }

  public getResourceDetails(id): Observable<any> {
    return this.http.get('/getAllFiles');
  }

  downloadFileAPI(): Observable<any> {
    return this.http.get('../../../assets/mockData/downloadFIleMockResponse.json', {
      responseType: 'blob' as 'json'
    });
  }
}
