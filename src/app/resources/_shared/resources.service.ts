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

  public getResourceDetails(name): Observable<any> {
    //return this.http.get(`/getFileDetails/${name}`);
    return this.http.get('/getAllFiles');
  }

  downloadFileAPI(fileName: string): Observable<any> {
    return this.http.get(`/getFile/${fileName}`, {
      responseType: 'blob' as 'json'
    });
  }
}
