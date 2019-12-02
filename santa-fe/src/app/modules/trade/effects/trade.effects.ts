import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

// import { TradeTestEvent } from 'Trade/actions/trade.actions';

@Injectable()
export class TradeEffect {

  constructor(
    private actions$: Actions
  ){ }

  @Effect({dispatch: false})
  testEffect$: Observable<any> = this.actions$.pipe(
    tap(() => {
      console.log('test, got here at effect');
    })
  );

}