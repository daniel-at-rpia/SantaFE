import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SecurityDTO } from 'FEModels/frontend-models.interface';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'santa-table-security-cell',
  templateUrl: './santa-table-security-cell.component.html',
  styleUrls: ['./santa-table-security-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SantaTableSecurityCell implements ICellRendererAngularComp {
  @Input() cardData: SecurityDTO;
  constructor() { }

  agInit(params: any){
    // don't forget this is triggered when the row is updated in live too
    this.cardData = params.value || null;
  }

  refresh(): boolean {
    return true;
  }

}
