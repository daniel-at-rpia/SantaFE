import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SecurityGroupDTO } from 'App/models/frontend/frontend-models.interface';
import { GraphService } from 'App/services/GraphService';

@Component({
  selector: 'security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityGroup implements OnInit {
  @Input() groupData: SecurityGroupDTO;
  colorScheme = [{
      label: 'active',
      value: '#333'
    },{
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
  constructor(
    private graphService: GraphService
  ) {}

  ngOnInit() {
    // this is for demo only
    if (!!this.groupData) {
      this.groupData.state.isStencil = true;
      // if (!!this.groupData.state.isStencil) {
      //   this.groupData.data.name = 'LONG PLACEHOLDER';
      //   this.groupData.data.ratingValue = 'AA';
      // }
      const groupData = this.groupData;
      const populateGraphs = this.populateGraphs.bind(this);
      setTimeout(function(){
        populateGraphs();
      }, 1);
      setTimeout(function(){
        groupData.state.isStencil = false;
      }, 2000);
    }
  }

  populateGraphs(){
      const groupData = this.groupData;
      const graphService = this.graphService;
      const colorScheme = this.colorScheme;
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
    groupData.graph.pieChartLeft = graphService.generateSecurityGroupPieChart(groupData.graph.chartNameLeft, data, colorScheme[groupData.data.ratingLevel].value);
    groupData.graph.pieChartRight = graphService.generateSecurityGroupPieChart(groupData.graph.chartNameRight, data2, colorScheme[groupData.data.ratingLevel].value);
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
