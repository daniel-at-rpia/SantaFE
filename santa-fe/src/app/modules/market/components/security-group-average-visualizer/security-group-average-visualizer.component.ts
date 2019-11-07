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
import { MetricOptions } from 'Core/constants/marketConstants.constant';

@Component({
  selector: 'security-group-average-visualizer',
  templateUrl: './security-group-average-visualizer.component.html',
  styleUrls: ['./security-group-average-visualizer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityGroupAverageVisualizer implements OnInit {

  metricOptions = MetricOptions;
  @Input() visualizerData: SecurityGroupAverageVisualizerDTO;
  @Input() panelAtEmptyState: boolean;
  @Output() onMetricChange = new EventEmitter();
  @Output() onSortHierarchyChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  public onClickActionEdit(targetMetricDTO: SecurityGroupMetricBlock){
    this.visualizerData.state.editingStat = targetMetricDTO;
    const matchedMetric = this.metricOptions.find((eachOption) => {
      return eachOption.label == targetMetricDTO.label;
    })
    this.visualizerData.state.editingStatSelectedMetric = matchedMetric;
    this.visualizerData.state.editingStatSelectedMetricValueType = targetMetricDTO.deltaScope ? 'DELTA' : 'RAW';
    this.visualizerData.state.editingStatSelectedMetricDeltaType = targetMetricDTO.deltaScope;
  }

  public onClickActionDelete(targetMetricDTO: SecurityGroupMetricBlock){
    targetMetricDTO.isEmpty = true;
    targetMetricDTO.sortHierarchy = null;
    targetMetricDTO.percentage = 100;
    targetMetricDTO.deltaScope = null;
    this.onMetricChange.emit();
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

  public onClickMetricSort(targetMetric: SecurityGroupMetricBlock){
    if (targetMetric.sortHierarchy > 0) {
      targetMetric.sortHierarchy = null;
    } else {
      this.visualizerData.data.stats.forEach((eachStat) => {
        eachStat.sortHierarchy = null;
      });
      targetMetric.sortHierarchy = 1;
    }
    // This version is for soring on mutiple metrics, which we currently won't support
    // if (targetMetric.sortHierarchy > 0){
    //   this.visualizerData.data.stats.forEach((eachStat) => {
    //     if (eachStat.sortHierarchy > targetMetric.sortHierarchy) {
    //       eachStat.sortHierarchy = eachStat.sortHierarchy - 1;
    //     }
    //   });
    //   targetMetric.sortHierarchy = null;
    // } else {
    //   let currentHierechyLevel = 0;
    //   this.visualizerData.data.stats.forEach((eachStat) => {
    //     if (eachStat.sortHierarchy > 0) {
    //       currentHierechyLevel++;
    //     }
    //   });
    //   targetMetric.sortHierarchy = currentHierechyLevel + 1;
    // }
    this.visualizerData.state.editingStat = null;
    this.onSortHierarchyChange.emit();
  }

  public dropdownSelectMetricValueType(targetValueType){
    this.visualizerData.state.editingStatSelectedMetricValueType = targetValueType;
    this.visualizerData.state.editingStatSelectedMetricDeltaType = null;
    if (targetValueType === 'RAW') {
      const targetStat = this.visualizerData.data.stats.find((eachStat)=> {
        return eachStat === this.visualizerData.state.editingStat;
      });
      targetStat.isEmpty = false;
      targetStat.deltaScope = null;
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
    targetStat.deltaScope = targetDeltaType;
    targetStat.label = this.visualizerData.state.editingStatSelectedMetric.label;
    this.clearEditingStatesBeforeExitDropdown();
    this.onMetricChange.emit();
  }

  public dropdownClose(){
    this.clearEditingStatesBeforeExitDropdown();
  }

  private clearEditingStatesBeforeExitDropdown(){
    this.visualizerData.state.editingStat = null;
    this.visualizerData.state.editingStatSelectedMetric = null;
    this.visualizerData.state.editingStatSelectedMetricDeltaType = null;
    this.visualizerData.state.editingStatSelectedMetricValueType = null;
  }
}