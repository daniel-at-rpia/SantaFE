import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SantaTableAlertStatusCellDTO } from 'FEModels/frontend-models.interface';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'santa-table-alert-status-cell',
  templateUrl: './santa-table-alert-status-cell.component.html',
  styleUrls: ['./santa-table-alert-status-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SantaTableAlertStatusCell implements ICellRendererAngularComp {
  @Input() statusData: SantaTableAlertStatusCellDTO;
  constructor() { }

  agInit(params: any){
    // don't forget this is triggered when the row is updated in live too
    this.statusData = params.value;
  }

  refresh(): boolean {
    return true;
  }

}
