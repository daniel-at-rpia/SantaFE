import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { TargetBarDTO } from 'App/modules/core/models/frontend/frontend-models.interface';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
@Component({
  selector: 'target-bar',
  templateUrl: './target-bar.component.html',
  styleUrls: ['./target-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TargetBar implements OnInit {
  @Input() targetBar: TargetBarDTO;
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration
  }
  constructor() {}

  public ngOnInit() {}
  
}