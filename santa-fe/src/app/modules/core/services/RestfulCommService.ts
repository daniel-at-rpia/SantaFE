import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RestfulCommService {

  //private endpoint = 'https://rpiadev01:1225';
  private endpoint = 'https://rpia-trader17:51225';

  constructor(private http: HttpClient){}

  public callAPI(
    url: string,
    opts: Object = {},
    payload: Object = {},
    needDateStamp: boolean = false,
    dateStampForPrevDay: boolean = true
  ) : Observable<any>{
    const fullUrl = `${this.endpoint}/${url}`;
    const queryOpts = {
      ...opts,
      withCredentials: true
    };
    !!needDateStamp && this.generateCurrentTimeForPayload(payload, dateStampForPrevDay);
    const method = opts['req'];
    console.log('Start REST call', url, opts, payload);
    switch (method) {
      case 'POST':
        return this.http.post<any>(fullUrl, payload, queryOpts);
      case 'GET':
        return this.http.get<any>(fullUrl, queryOpts);
    }
  }

  public generateCurrentTimeForPayload(payload: Object, dateStampForPrevDay: boolean) {
    const currentTime = new Date();
    if (dateStampForPrevDay) {
      if (currentTime.getDay() === 1) {
        currentTime.setDate(currentTime.getDate() - 3);
      } else if (currentTime.getDay() === 7) {
        currentTime.setDate(currentTime.getDate() - 2);
      } else {
        currentTime.setDate(currentTime.getDate() - 1);
      }
    } else {
      if (currentTime.getDay() === 6) {
        currentTime.setDate(currentTime.getDate() - 1);
      } else if (currentTime.getDay() === 7) {
        currentTime.setDate(currentTime.getDate() - 2);
      }
    }
    const parsedMonth = ('0' + (currentTime.getMonth()+1)).slice(-2);
    const parsedDate = ('0' + currentTime.getDate()).slice(-2);
    payload['yyyyMMdd'] = parseInt(`${currentTime.getFullYear()}${parsedMonth}${parsedDate}`);
  }
}