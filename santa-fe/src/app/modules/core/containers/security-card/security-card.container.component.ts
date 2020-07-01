import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { UtilityService } from 'Core/services/UtilityService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { SecurityDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.container.component.html',
  styleUrls: ['./security-card.container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityCard implements OnInit {
  @Input() cardData: SecurityDTO;

  constructor(
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) { }

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
    const yellowCard = this.utilityService.isCDS(false, this.cardData) ? `Corp` : 'Govt';
    const url = `bbg://securities/${this.cardData.data.globalIdentifier}%20${yellowCard}/${targetModule}`;
    window.open(url);
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.bloombergRedict,
      this.cardData.data.securityID,
      `BBG - ${targetModule}`,
      'Core - Security Card'
    );
  }

  public onClickSendToAlertConfig() {
    this.cardData.state.configAlertState = true;
  }

  public onMouseLeaveShortcutConfig() {
    this.cardData.state.configAlertState = false;
    this.cardData.state.isSelected = false;
  }
}
