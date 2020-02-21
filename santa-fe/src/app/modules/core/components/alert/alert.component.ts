import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  AlertDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Alert {
  @Input() alertData: AlertDTO;
  @Output() mouseEntered = new EventEmitter<AlertDTO>();
  @Output() mouseLeft = new EventEmitter<AlertDTO>();

  constructor() { }

  public onMouseEnter() {
    !!this.mouseEntered && this.mouseEntered.emit(this.alertData);
  }

  public onMouseLeave() {
    !!this.mouseLeft && this.mouseLeft.emit(this.alertData);
  }
}
