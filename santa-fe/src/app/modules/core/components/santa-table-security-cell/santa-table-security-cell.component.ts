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
    console.log('params is ', params);
    this.cardData = params.value;
  }

  refresh(): boolean {
    return true;
  }

}
