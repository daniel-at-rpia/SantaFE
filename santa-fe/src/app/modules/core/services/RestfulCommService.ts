import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RestfulCommService {

  private endpoint = 'https://rpiadev01:1225';
  //private endpoint = 'https://rpia-msmith-dt:51225';

  constructor(private http: HttpClient){}

  callAPI(url: string, opts: any ={}, body: any = null): Observable<any>{
    console.log('Start REST call', url, opts, body);
    const fullUrl = `${this.endpoint}/${url}`;
    const queryOpts = {
      ...opts,
      withCredentials: true
    };
    switch (opts.req) {
      case 'POST':
        return this.http.post<any>(fullUrl, body, queryOpts);
      case 'GET':
        return this.http.get<any>(fullUrl, queryOpts);
    }
  }
}