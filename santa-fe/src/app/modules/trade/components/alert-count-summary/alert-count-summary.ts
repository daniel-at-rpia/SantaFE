import {Component, Input, OnInit} from '@angular/core';
import {AlertTypes} from 'Core/constants/coreConstants.constant';
import {AlertCountSummaryDTO} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'alert-count-summary',
  templateUrl: './alert-count-summary.html',
  styleUrls: ['./alert-count-summary.scss']
})
export class AlertCountSummary implements OnInit {
  @Input() summary: AlertCountSummaryDTO;
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
