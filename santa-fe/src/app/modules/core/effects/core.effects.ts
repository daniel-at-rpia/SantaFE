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
  CoreGlobalLiveUpdateInternalCountEvent
} from 'Core/actions/core.actions';
import {
  selectMainThreadOccupied,
  selectGlobalAlertIsReadyToMakeNextAlertCall,
  selectGlobalAlertProcessingAlertState
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
      this.store$.pipe(select(selectGlobalAlertProcessingAlertState))
    ),
    tap(([tick, isMainThreadOccupied, isReady, isProcessing]) => {
      // use remainder of 300 000 and then flip error state to false
      if (!isReady) {
        if (tick.count % 5 === 0) {
          this.store$.dispatch(new CoreIsReadyToMakeAlertCall());
        }
      }
    }),
    filter(([tick, isMainThreadOccupied, isReady, isProcessing]) => { // need another flag for a error (normally as false)
      return !!isReady && !isProcessing && !isMainThreadOccupied
    }),
    switchMap(() => {
      return of(new CoreGlobalAlertsMakeAPICallEvent(true));
    })
  )
}