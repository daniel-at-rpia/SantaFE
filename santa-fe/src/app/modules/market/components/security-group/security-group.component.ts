import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  SecurityGroupRatingColorScheme,
  SecurityGroupSeniorityColorScheme
} from 'App/stubs/colorSchemes.stub';
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
    const colorSchemeLeft = SecurityGroupRatingColorScheme;
    const colorSchemeRight = SecurityGroupSeniorityColorScheme;
    groupData.graph.leftPie.chart = graphService.generateSecurityGroupPieChart(groupData.graph.leftPie);
    groupData.graph.rightPie.chart = graphService.generateSecurityGroupPieChart(groupData.graph.rightPie);
  }

  onClickGroup(){
    if (!this.groupData.state.isStencil) {
      this.groupData.state.isSelected = !this.groupData.state.isSelected;
      this.graphService.changeSecurityGroupPieChartOnSelect(this.groupData.graph.leftPie, this.groupData.state.isSelected);
      this.graphService.changeSecurityGroupPieChartOnSelect(this.groupData.graph.rightPie, this.groupData.state.isSelected);
    }
  }

}
