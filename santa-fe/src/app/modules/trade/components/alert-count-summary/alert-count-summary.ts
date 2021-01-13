import {Component, Input, OnInit} from '@angular/core';
import {AlertTypes} from 'Core/constants/coreConstants.constant';
import { DTOs } from 'Core/models/frontend';

@Component({
  selector: 'alert-count-summary',
  templateUrl: './alert-count-summary.html',
  styleUrls: ['./alert-count-summary.scss']
})
export class AlertCountSummary implements OnInit {
  @Input() summary: DTOs.AlertCountSummaryDTO;
  constructor() {
  }

  ngOnInit() {
  }
}
