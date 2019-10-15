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
import { MetricOptions } from 'App/stubs/averageVisualizerMetrics.stub';

@Component({
  selector: 'security-group-average-visualizer',
  templateUrl: './security-group-average-visualizer.component.html',
  styleUrls: ['./security-group-average-visualizer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupAverageVisualizer implements OnInit {

  metricOptions = MetricOptions;
  @Input() visualizerData: SecurityGroupAverageVisualizerDTO;
  @Output() onMetricChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  public onClickActionEdit(targetMetricDTO: SecurityGroupMetricBlock){
    this.visualizerData.state.editingStat = targetMetricDTO;
    const matchedMetric = this.metricOptions.find((eachOption) => {
      return eachOption.label == targetMetricDTO.label;
    })
    this.visualizerData.state.editingStatSelectedMetric = matchedMetric;
    this.visualizerData.state.editingStatSelectedMetricValueType = 'RAW';
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
      this.visualizerData.state.editingStat = this.visualizerData.state.editingStat === targetMetricDTO ? null : targetMetricDTO;
      !this.visualizerData.state.editingStat && this.clearEditingStatesBeforeExitDropdown();
    }
  }

  public dropdownSelectMetric(targetMetric){
    this.visualizerData.state.editingStatSelectedMetric = this.visualizerData.state.editingStatSelectedMetric === targetMetric ? null : targetMetric;
    this.visualizerData.state.editingStatSelectedMetricValueType = null;
    this.visualizerData.state.editingStatSelectedMetricDeltaType = null;
  }

  public dropdownSelectMetricValueType(targetValueType){
    this.visualizerData.state.editingStatSelectedMetricValueType = targetValueType;
    this.visualizerData.state.editingStatSelectedMetricDeltaType = null;
    if (targetValueType === 'RAW') {
      const targetStat = this.visualizerData.data.stats.find((eachStat)=> {
        return eachStat === this.visualizerData.state.editingStat;
      });
      targetStat.isEmpty = false;
      targetStat.label = this.visualizerData.state.editingStatSelectedMetric.label;
      this.clearEditingStatesBeforeExitDropdown();
      this.onMetricChange.emit();
    }
  }

  public dropdownSelectMetricDeltaType(targetDeltaType){
    this.visualizerData.state.editingStatSelectedMetricDeltaType = targetDeltaType;
    const targetStat = this.visualizerData.data.stats.find((eachStat)=> {
      return eachStat === this.visualizerData.state.editingStat;
    });
    targetStat.isEmpty = false;
    targetStat.label = this.visualizerData.state.editingStatSelectedMetric.label;
    this.clearEditingStatesBeforeExitDropdown();
    this.onMetricChange.emit();
  }

  private clearEditingStatesBeforeExitDropdown(){
    this.visualizerData.state.editingStat = null;
    this.visualizerData.state.editingStatSelectedMetric = null;
    this.visualizerData.state.editingStatSelectedMetricDeltaType = null;
    this.visualizerData.state.editingStatSelectedMetricValueType = null;
  }
}