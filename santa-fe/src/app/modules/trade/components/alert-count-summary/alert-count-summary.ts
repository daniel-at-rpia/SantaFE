import {Component, Input, OnInit} from '@angular/core';
import {AlertTypes} from "Core/constants/coreConstants.constant";

@Component({
  selector: 'alert-count-summary',
  templateUrl: './alert-count-summary.html',
  styleUrls: ['./alert-count-summary.scss']
})
export class AlertCountSummary implements OnInit {
  @Input() type: AlertTypes = null;
  @Input() count: number = 0;
  constants = {
    alertTypes: AlertTypes,
  };

  constructor() {
  }

  ngOnInit() {
  }

  getAlertNameFromType(type: AlertTypes) {
    switch (type) {
      case AlertTypes.axeAlert:
        return AlertTypes.axeAlert;
      case AlertTypes.markAlert:
        return AlertTypes.markAlert;
      case AlertTypes.marketListAlert:
        return 'Inquiry';
      default:
        return '';
    }
  }

}
