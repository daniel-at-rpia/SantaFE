import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { UtilityService } from 'Core/services/UtilityService';
import { SecurityDTO } from 'FEModels/frontend-models.interface';
import { ClickedOpenSecurityInBloombergEmitterParams } from 'Core/models/frontend/frontend-adhoc-packages.interface';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityCard implements OnInit {
  @Input() cardData: SecurityDTO;
  constructor(private utilityService: UtilityService) { }

  public ngOnInit() {
  }

  public onClickCard() {
    if (!this.cardData.state.isInteractionDisabled && !this.cardData.state.isStencil) {
      this.cardData.state.isSelected = !this.cardData.state.isSelected;
      if (!!this.cardData.api.onClickCard) {
        this.cardData.api.onClickCard(this.cardData);
      }
    }
  }

  public onClickThumbDown() {
    if (!!this.cardData.api.onClickThumbDown) {
      this.cardData.api.onClickThumbDown(this.cardData);
    }
  }

  public onClickSendToGraph() {
    if (!!this.cardData.api.onClickSendToGraph) {
      this.cardData.api.onClickSendToGraph(this.cardData);
    }
  }

  public onClickOpenSecurityInBloomberg(targetModule: string) {
    if (!!this.cardData.api.onClickOpenSecurityInBloomberg) {
      const payload: ClickedOpenSecurityInBloombergEmitterParams = {
        targetBBGModule: targetModule,
        yellowCard: this.utilityService.isCDS(false, this.cardData) ? `Corp` : 'Govt',
        targetSecurity: this.cardData
      }
      this.cardData.api.onClickOpenSecurityInBloomberg(payload);
    }
  }

  public onClickSendToAlertConfig() {
    if (!!this.cardData.api.onClickSendToAlertConfig) {
      this.cardData.api.onClickSendToAlertConfig(this.cardData);
    }
  }
}
