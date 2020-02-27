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
  @Input() slideOutAllAlerts: boolean;
  @Input() hideAllAlerts: boolean;
  @Output() mouseEntered = new EventEmitter<AlertDTO>();
  @Output() mouseLeft = new EventEmitter<AlertDTO>();
  @Output() clickedAlert = new EventEmitter<AlertDTO>();
  @Output() clickedRemove = new EventEmitter<AlertDTO>();

  constructor() { }

  public onMouseEnter() {
    !!this.mouseEntered && this.mouseEntered.emit(this.alertData);
  }

  public onMouseLeave() {
    !!this.mouseLeft && this.mouseLeft.emit(this.alertData);
  }

  public onClickAlert() {
    !!this.clickedAlert && this.clickedAlert.emit(this.alertData);
  }

  public onClickRemove() {
    !!this.clickedRemove && this.clickedRemove.emit(this.alertData);
  }
}
