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

import { SecurityTableRowDTO } from 'FEModels/frontend-models.interface';
import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';
import { ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
import { DTOService } from 'Core/services/DTOService';
import { QuoteMetricList } from 'Core/constants/securityTableConstants.constant';

@Component({
  selector: 'santa-table-detail-all-quotes',
  templateUrl: './santa-table-detail-all-quotes.component.html',
  styleUrls: ['./santa-table-detail-all-quotes.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SantaTableDetailAllQuotes implements ICellRendererAngularComp {
  @Input() rowData: SecurityTableRowDTO;
  private rowNode: AgGridRowNode;
  private parentNode: AgGridRowNode;
  constructor(
    private dtoService: DTOService
  ) { }

  public agInit(params: any){
    // don't forget this is triggered when the row is updated in live to
    console.log('params are', params);
    // this.rowData = params.value;
    this.rowNode = params.node;
    this.parentNode = this.rowNode.parent;
    this.rowData = this.dtoService.formSecurityTableRowObject(null);
  }

  public refresh(): boolean {
    return true;
  }

  public onClickClose() {
    this.parentNode.setExpanded(false);
  }
}
