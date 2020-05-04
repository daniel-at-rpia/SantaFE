import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SantaTableAlertSideCellDTO } from 'FEModels/frontend-models.interface';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'santa-table-alert-side-cell',
  templateUrl: './santa-table-alert-side-cell.component.html',
  styleUrls: ['./santa-table-alert-side-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SantaTableAlertSideCell implements ICellRendererAngularComp {
  @Input() sideData: SantaTableAlertSideCellDTO;
  constructor() { }

  agInit(params: any){
    // don't forget this is triggered when the row is updated in live too
    this.sideData = params.value;
  }

  refresh(): boolean {
    return true;
  }

}
