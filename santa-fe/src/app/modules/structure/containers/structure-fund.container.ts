import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';

import {PortfolioMetricValues } from 'Core/constants/structureConstants.constants';


@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit {
  @Input() fund; 
  @Input() selectedMetricValue;

  constants = {
    CS01: PortfolioMetricValues.CSO1,
    Leverage: PortfolioMetricValues.Leverage
  }


  constructor() {}

  public ngOnInit() {}
}