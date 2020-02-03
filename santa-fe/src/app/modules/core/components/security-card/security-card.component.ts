import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityCard implements OnInit {
  @Input() cardData: SecurityDTO;
  constructor() { }

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
    const url = `bbg://securities/${this.cardData.data.globalIdentifier}%20Corp/${targetModule}`;
    window.open(url);
  }
}
