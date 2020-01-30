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
  @Output() selectedCard = new EventEmitter<SecurityDTO>();
  @Output() clickedThumbDown = new EventEmitter<SecurityDTO>();
  @Output() clickedSendToGraph = new EventEmitter<SecurityDTO>();
  constructor() { }

  public ngOnInit() {
  }

  public onClickCard() {
    if (!this.cardData.state.isInteractionDisabled && !this.cardData.state.isStencil) {
      this.cardData.state.isSelected = !this.cardData.state.isSelected;
      !!this.selectedCard && this.selectedCard.emit(this.cardData);
    }
  }

  public onClickThumbDown() {
    !!this.clickedThumbDown && this.clickedThumbDown.emit(this.cardData);
  }

  public onClickSendToGraph() {
    !!this.clickedSendToGraph && this.clickedSendToGraph.emit(this.cardData);
  }
}
