import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  tap,
  withLatestFrom,
  filter,
  switchMap
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  TradeActions,
  TradeLiveUpdateUtilityInternalCountEvent,
  TradeLiveUpdateCount
} from 'Trade/actions/trade.actions';
import {
  selectLiveUpdateInProgress,
  selectLiveUpdateProcessingRawData
} from 'Trade/selectors/trade.selectors';

@Injectable()
export class TradeEffect {

  constructor(
    private store$: Store<any>,
    private actions$: Actions
  ){ }

  @Effect()
  receiveUtilityInternalCountEffect$: Observable<any> = this.actions$.pipe(
    ofType<TradeLiveUpdateUtilityInternalCountEvent>(
      TradeActions.LiveUpdateUtilityInternalCountEvent
    ),
    withLatestFrom(
      this.store$.pipe(select(selectLiveUpdateInProgress)),
      this.store$.pipe(select(selectLiveUpdateProcessingRawData))
    ),
    filter(([tick, isInProgress, isProcessingRawData]) => {
      return !isInProgress && !isProcessingRawData;
    }),
    switchMap(() => {
      return of(new TradeLiveUpdateCount());
    })
  );

}