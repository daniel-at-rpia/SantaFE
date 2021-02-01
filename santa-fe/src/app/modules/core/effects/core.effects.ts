import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  interval
} from 'rxjs';
import {
  tap,
  withLatestFrom,
  filter,
  switchMap
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  CoreActions,
  CoreIsReadyToMakeAlertCall,
  CoreGlobalAlertsMakeAPICallEvent,
  CoreGlobalLiveUpdateInternalCountEvent,
  CoreGlobalAlertFailedToMakeAlertAPICall
} from 'Core/actions/core.actions';
import {
  selectMainThreadOccupied,
  selectGlobalAlertIsReadyToMakeNextAlertCall,
  selectGlobalAlertProcessingAlertState,
  selectGlobalAlertFailedToMakeAlertAPICall
} from 'Core/selectors/core.selectors';

@Injectable()
export class CoreEffect {
  constructor(
    private store$: Store<any>,
    private actions$: Actions
  ){}
  @Effect() receiveGlobalAlertCountEffect$: Observable<any> = this.actions$.pipe(
    ofType<CoreGlobalLiveUpdateInternalCountEvent>(CoreActions.GlobalAlertIncrementInternalCountEvent),
    withLatestFrom(
      this.store$.pipe(select(selectMainThreadOccupied)),
      this.store$.pipe(select(selectGlobalAlertIsReadyToMakeNextAlertCall)),
      this.store$.pipe(select(selectGlobalAlertProcessingAlertState)),
      this.store$.pipe(select(selectGlobalAlertFailedToMakeAlertAPICall))
    ),
    tap(([tick, isMainThreadOccupied, isReady, isProcessing, isFailedAPICall]) => {
      if (!!isFailedAPICall) {
        // 5 min delay before making another API call
        if (tick.count % 300 === 0) {
          this.store$.dispatch(new CoreGlobalAlertFailedToMakeAlertAPICall(false))
        }
      } else {
        if (!isReady) {
          if (tick.count % 5 === 0) {
            this.store$.dispatch(new CoreIsReadyToMakeAlertCall());
          }
        }
      }
    }),
    filter(([tick, isMainThreadOccupied, isReady, isProcessing, isFailedAPICall]) => {
      return !!isReady && !isProcessing && !isMainThreadOccupied && !isFailedAPICall
    }),
    switchMap(() => {
      return of(new CoreGlobalAlertsMakeAPICallEvent(true));
    })
  )
}