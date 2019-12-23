import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { QuantComparerDTO } from 'FEModels/frontend-models.interface';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'santa-table-quote-cell',
  templateUrl: './santa-table-quote-cell.component.html',
  styleUrls: ['./santa-table-quote-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SantaTableQuoteCell implements ICellRendererAngularComp {
  @Input() comparerData: QuantComparerDTO;
  constructor() { }

  agInit(params: any){
    // don't forget this is triggered when the row is updated in live too
    this.comparerData = params.value;
  }

  refresh(): boolean {
    return true;
  }

}
