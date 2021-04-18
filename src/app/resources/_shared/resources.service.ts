import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ResourcesService {

  constructor(private http: HttpClient) { }

  public getResourcesList(queryObject: any): Observable<any> {
    const queryString = `pageNo=${queryObject.pageNo}&pageSize=${queryObject.pageSize}&sortBy=${queryObject.sortBy}`
      + `&mainCategory=${queryObject.mainCategory}&subCategory=${queryObject.subCategory}&search=${queryObject.search}`;
    return this.http.get(`/getAllFiles?${queryString}`);
    // return this.http.get('../../../assets/mockData/getAllResourcesMock.json');
  }

  public getResourceDetails(id): Observable<any> {
    return this.http.get(`/getFileDetails?uuid=${id}`);
    // return this.http.get('../../../assets/mockData/getResourceDetail.json');
  }

  public downloadFileAPI(fileName: string): Observable<any> {
    return this.http.get(`/getFile/${fileName}`, {
      responseType: 'blob' as 'json'
    });
    // return this.http.get('../../../assets/mockData/downloadFIleMockResponse.json', {
    //   responseType: 'blob' as 'json'
    // });
  }

  public downloadMultipleFiles(list: any): Observable<any> {
    return this.http.post('/getFiles', list, {
      responseType: 'blob' as 'json'
    });
  }
}
