import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';



@Component({
    selector: 'structure-main-panel',
    templateUrl: './structure-main-panel.container.html', 
    styleUrls: ['./structure-main-panel.container.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class StructureMainPanel implements OnInit {
  funds = [];
  state: StructureMainPanelState; 
  constants = {};

  private initializePageState(): StructureMainPanelState { 
    const state: StructureMainPanelState = {
        isUserPM: true, 
    }
    return state; 
  }
  
  constructor(private dtoService: DTOService) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {}; 
}