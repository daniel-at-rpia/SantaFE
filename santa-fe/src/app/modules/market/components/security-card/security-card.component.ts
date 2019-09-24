import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
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

}
