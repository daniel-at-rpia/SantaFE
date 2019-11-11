import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SecurityTableDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-table',
  templateUrl: './security-table.component.html',
  styleUrls: ['./security-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTable {
  @Input() tableData: SecurityTableDTO;
  constructor() { }

}
