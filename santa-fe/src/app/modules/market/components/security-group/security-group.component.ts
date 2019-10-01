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
  colorScheme: any;
  constructor(
    private graphService: GraphService
  ) {
    this.colorScheme = [
      {
        label: 'active',
        value: '#333'
      },
      {
        label: 'aaa',
        value: '#712f79'
      },{
        label: 'aa',
        value: '#293881'
      },{
        label: 'a',
        value: '#293881'
      },{
        label: 'bbb',
        value: '#0f8276'
      },{
        label: 'bb',
        value: '#968e7f'
      },{
        label: 'b',
        value: '#968e7f'
      },{
        label: 'ccctod',
        value: '#5e6c7c'
      }
    ];

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
      },
      graph: {
        pieChartLeft: null,
        pieChartRight: null
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
    this.groupData.graph.pieChartLeft = this.graphService.generateSecurityGroupPieChart('pieChart-1', data, this.colorScheme[this.groupData.data.ratingLevel].value);
    this.groupData.graph.pieChartRight = this.graphService.generateSecurityGroupPieChart('pieChart-2', data2, this.colorScheme[this.groupData.data.ratingLevel].value);
    const groupData = this.groupData;
    setTimeout(function(){
      groupData.state.isStencil = false;
    }, 2000);
  }

  onClickGroup(){
    if (!this.groupData.state.isStencil) {
      this.groupData.state.isSelected = !this.groupData.state.isSelected;
      const activeColor = this.colorScheme[0].value;
      const defaultColor = this.colorScheme[this.groupData.data.ratingLevel].value;
      this.graphService.changeSecurityGroupPieChartOnSelect(this.groupData.graph.pieChartLeft, this.groupData.state.isSelected, defaultColor, activeColor);
      this.graphService.changeSecurityGroupPieChartOnSelect(this.groupData.graph.pieChartRight, this.groupData.state.isSelected, defaultColor, activeColor);
    }
  }

}
