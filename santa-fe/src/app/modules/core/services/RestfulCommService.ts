import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { first, tap, catchError } from 'rxjs/operators';

import { APIUrlMap, EngagementActionList } from 'Core/constants/coreConstants.constant';

@Injectable()
export class RestfulCommService {

  // private endpoint = 'https://rpiadev01.rpia.ca:1225';
  private endpoint = 'https://rpia-quant-dt.ad.rpia:51225';
  // private endpoint = 'https://localhost:51225';
  //private endpoint = 'https://rpia-solutions:51225';
  //private endpoint = 'https://rpia-msmith-dt:51225';
  private user = 'anonymous';
  public apiMap = {
    ...APIUrlMap
  };
  public engagementMap = {
    ...EngagementActionList
  }

  constructor(private http: HttpClient){}

  public updateUser(user: string) {
    this.user = user;
  }

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
    switch (method) {
      case 'POST':
        return this.http.post<any>(fullUrl, payload, queryOpts);
      case 'GET':
        return this.http.get<any>(fullUrl, queryOpts);
    }
  }

  public generateCurrentTimeForPayload(
    payload: Object,
    dateStampForPrevDay: boolean
  ) {
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

  public logEngagement(
    type: string,
    security: string,
    value: string,
    container: string
  ) {
    const payload = {
      type: type,
      security: security,
      value: value,
      user: this.user,
      container: container,
      timestamp: new Date().getTime()
    };
    this.callAPI(this.apiMap.logEngagement, {req: 'POST'}, payload).pipe(
      first(),
      catchError(err => {
        return of('error');
      })
    ).subscribe();
  }

  public logError(
    message: string
  ) {
    const payload = {
      message: `Error: ${message} - From ${this.user}`,
      level: 'Error'
    };
    this.callAPI(this.apiMap.logError, {req: 'POST'}, payload).pipe(
      first(),
      catchError(err => {
        return of('error');
      })
    ).subscribe();
  }
}