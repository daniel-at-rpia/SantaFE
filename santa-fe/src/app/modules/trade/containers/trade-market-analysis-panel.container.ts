    import {
      Component,
      ViewEncapsulation
    } from '@angular/core';
    import { of } from 'rxjs';
    import {
      tap,
      first,
      catchError
    } from 'rxjs/operators';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      QuantitativeVisualizerDTO,
      SecurityDefinitionDTO
    } from 'FEModels/frontend-models.interface';
    import { TradeMarketAnalysisPanelState } from 'FEModels/frontend-page-states.interface';
    import { PayloadGetTargetSecurityGroup } from 'BEModels/backend-payloads.interface';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';

@Component({
  selector: 'trade-market-analysis-panel',
  templateUrl: './trade-market-analysis-panel.container.html',
  styleUrls: ['./trade-market-analysis-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeMarketAnalysisPanel {
  state: TradeMarketAnalysisPanelState;
  constants = {
    securityDefinitionMap: SecurityDefinitionMap
  };

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.state = {
      quantVisualizer: {
        groupByOptions: [],
        dto: this.dtoService.formQuantVisualizerObject(1, 1, 123, 145, -32, -45, 309, 210)
      }
    }
    this.populateDefinitionOptions();
    this.state.quantVisualizer.groupByOptions[0].state.groupByActive = true;
    this.fetchGroupData();
  }

  public onClickGroupByOption(targetOption: SecurityDefinitionDTO){
    targetOption.state.groupByActive = !targetOption.state.groupByActive;
  }

  private populateDefinitionOptions() {
    const options = [];
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.CURRENCY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.RATING_BUCKET));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SECTOR));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SENIORITY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.TENOR));
    this.state.quantVisualizer.groupByOptions = options;
  }

  private fetchGroupData() {
    const payload : PayloadGetTargetSecurityGroup = {
      source: "Default",
      santaGroupIdentifier: {},
      santaGroupFilters: {},
      tenorOptions: ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"]
    }
    this.state.quantVisualizer.groupByOptions.forEach((eachOption) => {
      if (eachOption.state.groupByActive) {
        const backendKey = this.utilityService.convertFEKey(eachOption.data.key);
        const value = [];
        value.push(eachOption.data.filterOptionList[0].displayLabel);
        payload.santaGroupIdentifier[backendKey] = value;
      }
    });
    payload.santaGroupIdentifier['SecurityType'] = ["Bond"];
    this.restfulCommService.callAPI('santaGroup/get-santa-group', {req: 'POST'}, payload, true).pipe(
      first(),
      tap((serverReturn) => {
        console.log('test', serverReturn);
      }),
      catchError(err => {
        console.error('error', err);
        return of('error');
      })
    ).subscribe();
  }

}