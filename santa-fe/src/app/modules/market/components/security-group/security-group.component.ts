import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  SecurityGroupRatingColorScheme,
  SecurityGroupSeniorityColorScheme
} from 'Core/constants/colorSchemes.constant';
import { SecurityGroupDTO } from 'FEModels/frontend-models.interface';
import { GraphService } from 'Core/services/GraphService';

@Component({
  selector: 'security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityGroup implements OnInit, OnChanges {
  @Input() groupData: SecurityGroupDTO;
  @Input() areChartsReady: boolean;
  @Output() onGroupSelect = new EventEmitter<SecurityGroupDTO>();

  constructor(
    private graphService: GraphService
  ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.groupData.state.areChartsReady && !this.groupData.state.pieChartComplete) {
      this.groupData.state.pieChartComplete = true;
      this.populateGraphs();
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
    if (!!this.groupData.state.pieChartComplete && !!this.groupData.state.averageCalculationComplete) {
      this.groupData.state.isSelected = !this.groupData.state.isSelected;
      this.graphService.changeSecurityGroupPieChartOnSelect(this.groupData.graph.leftPie, this.groupData.state.isSelected);
      this.graphService.changeSecurityGroupPieChartOnSelect(this.groupData.graph.rightPie, this.groupData.state.isSelected);
      this.onGroupSelect.emit(this.groupData);
    }
  }

}
