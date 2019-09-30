import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { securityGroupDTO } from 'App/models/frontend/frontend-models.interface';
import { GraphService } from 'App/services/GraphService';

@Component({
  selector: 'security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityGroup implements OnInit {
  @Input() groupData: securityGroupDTO;
  constructor(
    private graphService: GraphService
  ) {
    this.groupData = {
      data: {
        name: 'lol',
        ratingLevel: 1,
        ratingValue: 'AAA',
        seniorityLevel: 1
      },
      state: {
        isSelected: false,
        isStencil: true
      }
    }
  }

  ngOnInit() {
    // this is for demo only
    if (!!this.groupData.state.isStencil) {
      this.groupData.data.name = 'LONG PLACEHOLDER';
      this.groupData.data.ratingValue = 'AA';
    }
    const data = [{
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czechia",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }];
    const data2 = [{
      "country": "Lithuania",
      "litres": 5
    }, {
      "country": "Czechia",
      "litres": 3
    }, {
      "country": "Ireland",
      "litres": 2
    }, {
      "litres": 9
    }];
    this.graphService.generateSecurityGroupPieChart('pieChart-1', data);
    this.graphService.generateSecurityGroupPieChart('pieChart-2', data2);
    const groupData = this.groupData;
    setTimeout(function(){
      groupData.state.isStencil = false;
    }, 2000);
  }

  onClickGroup(){
    if (!this.groupData.state.isStencil) {
      this.groupData.state.isSelected = !this.groupData.state.isSelected;
    }
  }

}
