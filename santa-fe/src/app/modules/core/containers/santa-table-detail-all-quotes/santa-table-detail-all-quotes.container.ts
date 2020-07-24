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
      first
    } from 'rxjs/operators';
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

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
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
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.santaTableAllQuotesDisplayTradeHistory,
      this.rowData.data.security.data.securityID,
      '',
      'Trade Center Panel'
    );
  }

  public onClickSwitchViewToQuote() {
    this.rowData.state.viewHistoryState = false;
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.santaTableAllQuotesDisplayQuotes,
      this.rowData.data.security.data.securityID,
      '',
      'Trade Center Panel'
    );
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
}
