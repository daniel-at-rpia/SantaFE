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
    import {
      MARKET_ANALYSIS_SPREAD_METRIC_KEY,
      MARKET_ANALYSIS_YIELD_METRIC_KEY
    } from 'Core/constants/tradeConstants.constant';
    import { QuantVisualizerParams } from 'FEModels/frontend-adhoc-packages.interface';

@Component({
  selector: 'trade-market-analysis-panel',
  templateUrl: './trade-market-analysis-panel.container.html',
  styleUrls: ['./trade-market-analysis-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeMarketAnalysisPanel {
  state: TradeMarketAnalysisPanelState;
  constants = {
    securityDefinitionMap: SecurityDefinitionMap,
    spreadMetricKey: MARKET_ANALYSIS_SPREAD_METRIC_KEY,
    yieldMetricKey: MARKET_ANALYSIS_YIELD_METRIC_KEY
  };

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.state = {
      quantVisualizer: {
        groupByOptions: [],
        dto: null
      }
    }
    this.populateDefinitionOptions();
    this.state.quantVisualizer.groupByOptions[0].state.groupByActive = true;
    this.fetchGroupData();
  }

  public onClickGroupByOption(targetOption: SecurityDefinitionDTO){
    targetOption.state.groupByActive = !targetOption.state.groupByActive;
    const activeOptions = this.state.quantVisualizer.groupByOptions.filter((eachOption) => {
      return eachOption.state.groupByActive;
    })
    if (activeOptions.length > 0) {
      this.fetchGroupData();
    }
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
        this.populateVisualizer(serverReturn);
      }),
      catchError(err => {
        console.error('error', err);
        return of('error');
      })
    ).subscribe();
  }

  private populateVisualizer(serverReturn) {
    const groupDTO = this.dtoService.formSecurityGroupObject(serverReturn);
    console.log('group is', groupDTO);
    const params: QuantVisualizerParams = {
      tRaw: 1,
      gRaw: groupDTO.data.metricPack.raw[this.constants.spreadMetricKey],
      tWoW: 123,
      gWow: groupDTO.data.metricPack.delta.WoW[this.constants.spreadMetricKey],
      tMoM: -32,
      gMoM: groupDTO.data.metricPack.delta.MoM[this.constants.spreadMetricKey],
      tYtD: 309,
      gYtD: groupDTO.data.metricPack.delta.Ytd[this.constants.spreadMetricKey]
    }
    this.state.quantVisualizer.dto = this.dtoService.formQuantVisualizerObject(params);
  }

}