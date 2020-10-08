  // dependencies
    import {
      Component,
      OnInit,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter
    } from '@angular/core';
    import {
      tap,
      first,
      catchError
    } from 'rxjs/operators';
    import { of } from 'rxjs';
    import { ICellRendererAngularComp } from 'ag-grid-angular';

    import { AgGridRowNode } from 'FEModels/frontend-blocks.interface';
    import { SecurityTableRowDTO, SecurityQuoteDTO } from 'FEModels/frontend-models.interface';
    import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';
    import {
      AgGridRowParams,
      ClickedSortQuotesByMetricEmitterParams,
      ClickedSpecificQuoteEmitterParams
    } from 'FEModels/frontend-adhoc-packages.interface';
    import { PayloadSetQuoteStatus } from 'BEModels/backend-payloads.interface';
    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { QuoteHeaderConfigList } from 'Core/constants/securityTableConstants.constant';
    import * as BEModels from 'BEModels/backend-models.interface';
    import * as DTOs from 'FEModels/frontend-models.interface';
    import { GraphService } from 'Core/services/GraphService';

  //

@Component({
  selector: 'santa-table-detail-all-quotes',
  templateUrl: './santa-table-detail-all-quotes.container.html',
  styleUrls: ['./santa-table-detail-all-quotes.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SantaTableDetailAllQuotes implements ICellRendererAngularComp {
  @Input() rowData: SecurityTableRowDTO;
  private parentNode: AgGridRowNode;
  private parent: any; // a hacky way to talk to "santa-table.container.ts"
  private params: AgGridRowParams;
  public showAllTradeHistoryButton: boolean =  true;
  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private graphService: GraphService
  ) { }

  public agInit(params: any){
    // don't forget this is triggered when the row is updated in live too
    // agInit is triggered twice, once when the SantaTable's onRowClicked() sets the node via setExpanded(). And later triggered again when SantaTable's loadQuotes() recalc the height of the table view. There is no need to react to both agInit, just react to the 2nd one when all quotes data comes in 
    const typeSafeParams = params as AgGridRowParams;
    this.params = typeSafeParams;
    if (!!typeSafeParams && !!typeSafeParams.node.data.rowDTO && typeSafeParams.node.data.rowDTO.state.quotesLoaded) {
      this.parentNode = typeSafeParams.node.parent;
      this.rowData = typeSafeParams.node.data.rowDTO;
      this.parent = typeSafeParams.context.componentParent;
    }
  }

  public refresh(): boolean {
    return true;
  }

  public onClickClose() {
    // the pinned rows won't have a parent
    this.parentNode && this.parentNode.setExpanded(false);
    this.parent.onRowClickedToCollapse(this.rowData, !this.parentNode, this.params);
    this.rowData.data.historicalTradeVisualizer.state.graphReceived = true;
  }

  public onClickSelectForAnalysis() {
    if (!!this.parent && this.rowData && this.rowData.data.security) {
      this.parent.onSelectSecurityForAnalysis(this.rowData.data.security);
    }
  }

  public onClickSortQuotesByMetric(targetBlock: QuoteMetricBlock, targetLabel: string) {
    const payload: ClickedSortQuotesByMetricEmitterParams = {
      targetRow: this.rowData,
      targetBlock: targetBlock,
      targetMetricLabel: targetLabel
    };
    this.parent.onClickSortQuotesByMetric(payload);
  }

  public onClickedSpecificPrimaryQuote(params: ClickedSpecificQuoteEmitterParams) {
    if (!!params) {
      this.updateQuoteUponClick(params, this.rowData.data.quotes.primaryPresentQuotes);
    }
  }

  public onClickedSpecificSecondaryQuote(params: ClickedSpecificQuoteEmitterParams) {
    if (!!params) {
      this.updateQuoteUponClick(params, this.rowData.data.quotes.secondaryPresentQuotes);
    }
  }

  public onClickUpVote(targetQuote: SecurityQuoteDTO) {
    const targetSide = targetQuote.state.menuActiveSide === 'bid' ? targetQuote.data.bid : targetQuote.data.ask;
    const payload: PayloadSetQuoteStatus = {
      identifier: this.rowData.data.security.data.securityID,
      quoteType: targetSide.isAxe ? 'Axe' : 'Run',
      dealer: targetQuote.data.broker,
      side: targetQuote.state.menuActiveSide === 'bid' ? 'Bid' : 'Ask',
      quoteStatus: 'Good'
    };
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.setQuoteStatus, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn) => {
        if (targetQuote.state.menuActiveSide === 'bid') {
          targetQuote.state.isBidDownVoted = false;
        } else {
          targetQuote.state.isAskDownVoted = false;
        }
        targetQuote.state.menuActiveDriver = null;
        targetQuote.state.menuActiveSide = null;
      })
    ).subscribe();
  }

  public onClickDownVote(targetQuote: SecurityQuoteDTO) {
    const targetSide = targetQuote.state.menuActiveSide === 'bid' ? targetQuote.data.bid : targetQuote.data.ask;
    const payload: PayloadSetQuoteStatus = {
      identifier: this.rowData.data.security.data.securityID,
      quoteType: targetSide.isAxe ? 'Axe' : 'Run',
      dealer: targetQuote.data.broker,
      side: targetQuote.state.menuActiveSide === 'bid' ? 'Bid' : 'Ask',
      quoteStatus: 'Bad'
    };
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.setQuoteStatus, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn) => {
        if (targetQuote.state.menuActiveSide === 'bid') {
          targetQuote.state.isBidDownVoted = true;
        } else {
          targetQuote.state.isAskDownVoted = true;
        }
        targetQuote.state.menuActiveDriver = null;
        targetQuote.state.menuActiveSide = null;
      })
    ).subscribe();
  }

  public onClickShowMoreQuotes() {
    this.rowData.data.quotes.primaryPresentQuotes = this.utilityService.deepCopy(this.rowData.data.quotes.primaryQuotes);
    this.rowData.data.quotes.secondaryPresentQuotes = this.utilityService.deepCopy(this.rowData.data.quotes.secondaryPresentQuotes);
    this.rowData.state.presentingAllQuotes = true;
  }

  public onClickSwitchViewToHistory() {
    this.rowData.state.viewHistoryState = true;
    this.rowData.state.viewAllQuotesState = false;
    this.rowData.state.viewTraceState = false;
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.santaTableAllQuotesDisplayTradeHistory,
      this.rowData.data.security.data.securityID,
      '',
      'Trade Center Panel'
    );
  }

  public onClickSwitchViewToQuote() {
    this.rowData.state.viewHistoryState = false;
    this.rowData.state.viewAllQuotesState = true;
    this.rowData.state.viewTraceState = false;
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.santaTableAllQuotesDisplayQuotes,
      this.rowData.data.security.data.securityID,
      '',
      'Trade Center Panel'
    );
  }

  public onClickSwitchViewToTrace() {
    this.rowData.state.viewHistoryState = false;
    this.rowData.state.viewAllQuotesState = false;
    this.rowData.state.viewTraceState = true;
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.santaTableAllQuotesDisplayTrace,
      this.rowData.data.security.data.securityID,
      '',
      'Trade Center Panel'
    );
  }

  public onClickGetAllTradeHistory(showAllTradeHistory: boolean) {
    if (showAllTradeHistory) {
      this.fetchTradeAllHistory();
    }
  }

  private updateQuoteUponClick(params: ClickedSpecificQuoteEmitterParams, targetQuoteList: Array<SecurityQuoteDTO>){
    targetQuoteList.forEach((eachQuote) => {
      if (eachQuote.data.uuid === params.targetQuote.data.uuid) {
        const targetSide = params.isOnBidSide ? 'bid' : 'ask';
        if (eachQuote.state.menuActiveDriver === params.targetDriver && eachQuote.state.menuActiveSide === targetSide) {
          eachQuote.state.menuActiveSide = null;
          eachQuote.state.menuActiveDriver = null;
        } else {
          eachQuote.state.menuActiveSide = targetSide;
          eachQuote.state.menuActiveDriver = params.targetDriver;
        }
      } else {
        eachQuote.state.menuActiveDriver = null;
        eachQuote.state.menuActiveSide = null;
      }
    });
  }

  private fetchTradeAllHistory() {
    this.showAllTradeHistoryButton = false;
    const securityID = this.rowData.data.security.data.securityID;
    const payload = {
      "identifier": securityID
    }
    const security = this.rowData.data.security;
    this.rowData.data.historicalTradeVisualizer.state.graphReceived = true;
    this.graphService.destoryGraph(this.rowData.data.historicalTradeVisualizer.graph.positionPie);
    this.rowData.data.historicalTradeVisualizer.graph.positionPie = null;
    this.graphService.destoryGraph(this.rowData.data.historicalTradeVisualizer.graph.volumeLeftPie);
    this.rowData.data.historicalTradeVisualizer.graph.volumeLeftPie = null;
    this.graphService.destoryGraph(this.rowData.data.historicalTradeVisualizer.graph.volumeRightPie);
    this.rowData.data.historicalTradeVisualizer.graph.volumeRightPie = null;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAllTradeHistory, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((allTradeHistory: Object) => {
        if (!!allTradeHistory) {
          const securityAllTradeHistoryData = allTradeHistory[securityID];
          this.setAllTradeHistory(securityAllTradeHistoryData, security);
        }
      }),
      catchError(err => {
        this.restfulCommService.logError(`Get all trade history for security ${securityID} failed`);
        console.error('error', err);
        return of('error');
      })
    ).subscribe();
  }

  private setAllTradeHistory(rawData: BEModels.BETradeBlock, targetSecurity: DTOs.SecurityDTO ) {
    this.rowData.data.security.data.tradeHistory = []
    for (let fund in rawData) {
      if (Object.prototype.hasOwnProperty.call(rawData, fund)) {
        const currentFund = rawData[fund];
        currentFund.forEach(entry => {
          const newTradeBlock = this.dtoService.formTradeObject(entry, targetSecurity)
          this.rowData.data.security.data.tradeHistory.push(newTradeBlock);
        })
      }
    }
    this.setHistoricalTradeVisualizer(targetSecurity)
    this.rowData.data.historicalTradeVisualizer.state.showAllTradeHistory = true;
  }

  private setHistoricalTradeVisualizer(targetSecurity: DTOs.SecurityDTO) {
    this.rowData.data.historicalTradeVisualizer = this.dtoService.formHistoricalTradeObject(targetSecurity)
  }
}
