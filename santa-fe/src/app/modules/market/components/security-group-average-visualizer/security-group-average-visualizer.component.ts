import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityGroupAverageVisualizerDTO } from 'FEModels/frontend-models.interface';
import { SecurityGroupMetricBlock } from 'FEModels/frontend-blocks.interface';

@Component({
  selector: 'security-group-average-visualizer',
  templateUrl: './security-group-average-visualizer.component.html',
  styleUrls: ['./security-group-average-visualizer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupAverageVisualizer implements OnInit {

  @Input() visualizerData: SecurityGroupAverageVisualizerDTO;
  @Output() onMetricChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  public onClickActionEdit(targetMetricDTO: SecurityGroupMetricBlock){
    this.visualizerData.state.editingStat = targetMetricDTO;
  }

  public onClickActionDelete(targetMetricDTO: SecurityGroupMetricBlock){
    this.visualizerData.state.selectingStat = null;
    targetMetricDTO.isEmpty = true;
    this.onMetricChange.emit();
  }

  public onClickMetric(targetMetricDTO: SecurityGroupMetricBlock){
    if (!this.visualizerData.state.isStencil) {
      this.visualizerData.state.selectingStat = this.visualizerData.state.selectingStat === targetMetricDTO ? null : targetMetricDTO;
      if (this.visualizerData.state.editingStat === targetMetricDTO) {
        this.visualizerData.state.editingStat = null;
      }
    }
  }

  public addMetric(targetMetricDTO: SecurityGroupMetricBlock){
    if (!this.visualizerData.state.isStencil) {
      targetMetricDTO.isEmpty = false;
      this.onMetricChange.emit();
    }
  }

}