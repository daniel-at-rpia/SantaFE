import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RestfulCommService {

  constructor(private http: HttpClient){}

  callAPI(url: string, opts: any ={}, body: any = null): Observable<any>{
    //let params = new HttpParams();
    //params = params.append('apiCall', 'true');
    //const queryOpts = { ...opts, params };
    const queryOpts = {
      ...opts
    };
    switch (opts.req) {
      case 'POST':
        return this.http.post<any>(url, body, queryOpts);
      case 'GET':
        return this.http.get<any>(url, queryOpts);
    }
  }
}