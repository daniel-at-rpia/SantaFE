import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';

@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit {
  @Input() fund: PortfolioStructureDTO; 

  constructor() {}

  public ngOnInit() {}
}