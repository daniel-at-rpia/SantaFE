import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { AlertDTO } from 'FEModels/frontend-models.interface';
import { AlertTypes, AlertSubTypes } from 'Core/constants/coreConstants.constant';
import * as moment from 'moment';



@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Alert implements OnInit{
  @Input() alertData: AlertDTO;
  @Input() hideAllAlerts: boolean;
  @Output() clickedAlertThumbnail = new EventEmitter<AlertDTO>();
  @Output() clickedAlertDetail = new EventEmitter<AlertDTO>();
  @Output() clickedRemove = new EventEmitter<AlertDTO>();
  @Output() countdownExpired = new EventEmitter<AlertDTO>();

  alertSubTypes = AlertSubTypes;
  alertTypes = AlertTypes;
  validUntil = moment(Date.now());

  constructor() { }

  public ngOnInit(): void {
    if (!!this.alertData.data.validUntilTime) {
     this.startCountdown();
    }
  }

  public onClickAlertThumbnail() {
    !!this.clickedAlertThumbnail && this.clickedAlertThumbnail.emit(this.alertData);
  }

  public onClickAlertDetail() {
    !!this.clickedAlertDetail && this.clickedAlertDetail.emit(this.alertData);
  }

  public onClickRemove() {
    !!this.clickedRemove && this.clickedRemove.emit(this.alertData);
  }

  private startCountdown( ){
    this.validUntil = moment(this.alertData.data.validUntilTime);
    const interval = setInterval(() => {
      if (this.hasExpired()) {
        !!this.countdownExpired && this.countdownExpired.emit(this.alertData);
        clearInterval(interval);
      }
      this.validUntil = moment(this.validUntil.toISOString());
    }, 1000);
  }

  private hasExpired() {
    return moment().diff(this.validUntil) > 0;
  }

}
