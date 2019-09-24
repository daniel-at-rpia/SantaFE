import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from '@angular/core';

import { securityDTO } from 'app/models/frontend/frontend-models.interface';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityCard implements OnInit {
  @Input() cardData: any;
  @Input() isStencil: boolean;
  @Input() isTable: boolean;
  constructor() { }

  ngOnInit() {
  }

}
