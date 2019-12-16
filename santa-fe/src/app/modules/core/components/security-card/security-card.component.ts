import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SecurityDTO } from 'FEModels/frontend-models.interface';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityCard implements OnInit, ICellRendererAngularComp {
  @Input() cardData: SecurityDTO;
  constructor() { }

  ngOnInit() {
    // this is for demo only
    if (!!this.cardData.state.isStencil) {
      this.cardData.data.name = 'LONG PLACEHOLDER';
      this.cardData.data.ratingValue = 'AA';
    }
  }

  onClickCard(){
    if (!this.cardData.state.isTable && !this.cardData.state.isStencil) {
      this.cardData.state.isSelected = !this.cardData.state.isSelected;
    }
  }

  agInit(params: any){
    console.log('params is ', params);
    this.cardData = {
      data: {
        securityID: '1849',
        name: 'ABIBB 4.9 02/01/2046 Callable USD SENIOR_UNSECURED',
        ratingLevel: 3,
        ratingValue: 'A',
        ratingBucket: 'IG',
        seniorityLevel: 2,
        currency: 'USD',
        country: '',
        sector: '',
        industry: '',
        securityType: '',
        seniority: '',
        maturityType: '',
        primaryPmName: '',
        backupPmName: '',
        researchName: '',
        owner: [],
        mark: null,
        portfolios: [],
        strategyCurrent: '',
        strategyFirm: '',
        positionCurrent: null,
        positionFirm: null,
        positionHF: null,
        positionNLF: null,
        positionHFInMM: null,
        positionNLFInMM: null,
        positionCurrentInMM: null,
        positionFirmInMM: null,
        metricPack: null,
        couponType: null
      },
      state: {
        isSelected: false,
        isStencil: false,
        isTable: true,
        isTableExpanded: false
      }
    }
  }

  refresh(): boolean {
    return true;
  }

}
