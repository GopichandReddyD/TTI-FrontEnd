import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UploaderService {

  constructor(private http: HttpClient) { }

  uploadResourceFileForm(formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','multipart/form-data')
    return this.http.post('/upload', formData, { headers: headers});
  }

  uploadResourceVideoForm(payload: any): Observable<any> {
    return this.http.post('/upload/video', payload);
  }
}
