  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router, ActivatedRoute } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { UtilityService } from 'Core/services/UtilityService';
  //

@Component({
  selector: 'global-workflow',
  templateUrl: './global-workflow.container.html',
  styleUrls: ['./global-workflow.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalWorkflow implements OnInit, OnDestroy{
  subscriptions = {
    navigationStartSub: null,
    proofOfConcept: null
  };

  constructor(
    private store$: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService
  ) {

  }

  public ngOnInit() {
    this.subscriptions.proofOfConcept = interval(2000).subscribe(
      count => {
        this.router.navigateByUrl('/trade');
      }
    );
  }

  public ngOnDestroy() {

  }

}