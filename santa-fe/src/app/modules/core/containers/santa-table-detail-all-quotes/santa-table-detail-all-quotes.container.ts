import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AgGridRowNode } from 'FEModels/frontend-blocks.interface';

import { SecurityTableRowDTO, SecurityQuoteDTO } from 'FEModels/frontend-models.interface';
import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';
import {
  AgGridRowParams,
  ClickedSortQuotesByMetricEmitterParams,
  ClickedSpecificQuoteEmitterParams
} from 'FEModels/frontend-adhoc-packages.interface';
import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { QuoteMetricList } from 'Core/constants/securityTableConstants.constant';

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

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService
  ) { }

  public agInit(params: any){
    // don't forget this is triggered when the row is updated in live too
    const typeSafeParams = params as AgGridRowParams;
    this.parentNode = typeSafeParams.node.parent;
    this.rowData = typeSafeParams.node.data.rowDTO;
    this.parent = typeSafeParams.context.componentParent;
  }

  public refresh(): boolean {
    return true;
  }

  public onClickClose() {
    this.parentNode.setExpanded(false);
    this.parent.onRowClickedToCollapse(this.rowData);
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

  public onClickedSpecificQuote(params: ClickedSpecificQuoteEmitterParams) {
    if (!!params) {
      this.rowData.data.presentQuotes.forEach((eachQuote) => {
        if (eachQuote.data.uuid === params.targetQuote.data.uuid) {
          const targetSide = params.isOnBidSide ? 'bid' : 'ask';
          if (eachQuote.state.menuActiveMetric === params.targetMetric && eachQuote.state.menuActiveSide === targetSide) {
            eachQuote.state.menuActiveSide = null;
            eachQuote.state.menuActiveMetric = null;
          } else {
            eachQuote.state.menuActiveSide = targetSide;
            eachQuote.state.menuActiveMetric = params.targetMetric;
          }
        } else {
          eachQuote.state.menuActiveMetric = null;
          eachQuote.state.menuActiveSide = null;
        }
      });
    }
  }

  public onClickThumbdown(targetQuote: SecurityQuoteDTO) {
    console.log('test, got', targetQuote);
  }

  public onClickShowMoreQuotes() {
    this.rowData.data.presentQuotes = this.utilityService.deepCopy(this.rowData.data.quotes);
  }
}
