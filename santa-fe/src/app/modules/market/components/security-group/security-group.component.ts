import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  interval
} from 'rxjs';
import {
  tap,
  first
} from 'rxjs/operators';

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
export class SecurityGroup implements OnInit, OnChanges {
  @Input() groupData: SecurityGroupDTO;
  @Input() isDataReady: boolean;
  task$: Observable<any>;
  getGroupsSubscription: Subscription;

  constructor(
    private graphService: GraphService
  ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.groupData.state.isStencil && !this.groupData.state.stencilAnimationComplete) {
          this.groupData.state.stencilAnimationComplete = true;
      this.task$ = interval(400);
      this.getGroupsSubscription = this.task$.pipe(
        tap(() => {
          this.populateGraphs();
        }),
        first()
      ).subscribe();
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
