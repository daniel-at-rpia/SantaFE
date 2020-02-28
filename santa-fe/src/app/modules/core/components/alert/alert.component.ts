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
  @Input() hideAllAlerts: boolean;
  @Output() clickedAlertThumbnail = new EventEmitter<AlertDTO>();
  @Output() clickedAlertDetail = new EventEmitter<AlertDTO>();
  @Output() clickedRemove = new EventEmitter<AlertDTO>();

  constructor() { }

  public onClickAlertThumbnail() {
    !!this.clickedAlertThumbnail && this.clickedAlertThumbnail.emit(this.alertData);
  }

  public onClickAlertDetail() {
    !!this.clickedAlertDetail && this.clickedAlertDetail.emit(this.alertData);
  }

  public onClickRemove() {
    !!this.clickedRemove && this.clickedRemove.emit(this.alertData);
  }
}
