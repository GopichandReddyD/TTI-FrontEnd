import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ResourcesService {

  constructor(private http: HttpClient) { }

  public getAllResources(): Observable<any> {
    return this.http.get('/getAllFiles');
    // return this.http.get('../../../assets/mockData/getAllResourcesMock.json');
  }

  public getResourceDetails(name): Observable<any> {
    return this.http.get(`/getFileDetails/${name}`);
    // return this.http.get('/getAllFiles');
    // return this.http.get('../../../assets/mockData/getResourceDetail.json');
  }

  downloadFileAPI(fileName: string): Observable<any> {
    return this.http.get(`/getFile/${fileName}`, {
      responseType: 'blob' as 'json'
    });
    // return this.http.get('../../../assets/mockData/downloadFIleMockResponse.json', {
    //   responseType: 'blob' as 'json'
    // });
  }
}
