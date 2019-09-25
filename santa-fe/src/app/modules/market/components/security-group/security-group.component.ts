import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { securityGroupDTO } from 'App/models/frontend/frontend-models.interface';

@Component({
  selector: 'security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityGroup implements OnInit {
  @Input() groupData: securityGroupDTO;
  constructor() {
    this.groupData = {
      data: {
        name: 'lol',
        ratingLevel: 1,
        ratingValue: 'AAA',
        seniorityLevel: 1
      },
      state: {
        isSelected: false,
        isStencil: false
      }
    }
  }

  ngOnInit() {
    // this is for demo only
    if (!!this.groupData.state.isStencil) {
      this.groupData.data.name = 'LONG PLACEHOLDER';
      this.groupData.data.ratingValue = 'AA';
    }
  }

  onClickCard(){
    if (!this.groupData.state.isStencil) {
      this.groupData.state.isSelected = !this.groupData.state.isSelected;
    }
  }

}
