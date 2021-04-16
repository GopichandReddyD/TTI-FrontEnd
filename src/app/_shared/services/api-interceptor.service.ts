import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../constants/constants';

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = {
      'Accept': 'application/json',
      //'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
       //'Authorization': TODO: To be added
    };
    if(!req.url.includes('upload/file')){
      headers['Content-Type'] = 'application/json'
    }
    const apiRequest = req.clone({
      setHeaders: headers,
      url: `${BASE_API_URL}${req.url}`
    })
    return next.handle(apiRequest);
  }
}
