import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityGroupDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-group-simple',
  templateUrl: './security-group-simple.component.html',
  styleUrls: ['./security-group-simple.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityGroupSimple {
  @Input() groupData: SecurityGroupDTO;
  @Output() onGroupSelect = new EventEmitter<SecurityGroupDTO>();

  constructor() {}

  onClickGroup(){
    if (!this.groupData.state.isStencil) {
      this.groupData.state.isSelected = !this.groupData.state.isSelected;
      this.onGroupSelect.emit(this.groupData);
    }
  }

}
