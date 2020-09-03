import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { PortfolioBreakdownDTO, TargetBarDTO } from 'FEModels/frontend-models.interface';
import { UtilityService } from 'Core/services/UtilityService'
import { StructureSendSetTargetTransferEvent} from 'Structure/actions/structure.actions';

@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit {
  @Input() fund: PortfolioStructureDTO;
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private store$: Store<any>
  ){}

  public ngOnInit() {}

  public onClickedEditInBreakdown(targetBreakdown: PortfolioBreakdownDTO) {
    this.store$.dispatch(new StructureSendSetTargetTransferEvent({
      targetFund: this.utilityService.deepCopy(this.fund),
      targetBreakdown: this.utilityService.deepCopy(targetBreakdown)
    }));
  }
}