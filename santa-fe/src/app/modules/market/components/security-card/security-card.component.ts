import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { securityDTO } from 'App/models/frontend/frontend-models.interface';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityCard implements OnInit {
  @Input() cardData: securityDTO;
  constructor() { }

  ngOnInit() {
    // this is for demo only
    if (!!this.cardData.state.isStencil) {
      this.cardData.data.name = 'LONG PLACEHOLDER';
      this.cardData.data.ratingValue = 'AA';
    }
  }

  onClickCard(){
    if (!this.cardData.state.isTable) {
      this.cardData.state.isSelected = !this.cardData.state.isSelected;
    }
  }

}
