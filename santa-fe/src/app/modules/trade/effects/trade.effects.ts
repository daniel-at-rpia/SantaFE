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
  selectLiveUpdatePaused,
  selectLiveUpdateInProgress
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
      this.store$.pipe(select(selectLiveUpdatePaused)),
      this.store$.pipe(select(selectLiveUpdateInProgress))
    ),
    filter(([tick, isPaused, isInProgress]) => {
      return !isPaused && !isInProgress;
    }),
    switchMap(() => {
      return of(new TradeLiveUpdateCount());
    })
  );

}