import {Component, OnInit, Input, OnChanges, ViewEncapsulation} from '@angular/core';
import { TargetBarDTO } from 'App/modules/core/models/frontend/frontend-models.interface';

@Component({
  selector: 'target-bar',
  templateUrl: './target-bar.component.html',
  styleUrls: ['./target-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TargetBar implements OnInit, OnChanges {
  @Input() targetBar: TargetBarDTO;
  @Input() fetchDataFailedState: boolean;
  constructor() {}

  public ngOnInit() {
   this.loadTargetBarConfiguration(this.targetBar);
  }

  public ngOnChanges() {
    if (this.fetchDataFailedState) {
      this.targetBar.state.isStencil = false;
      this.targetBar.state.isError = true;
      this.targetBar.data.displayedResults = '-';
    }
  }

  private loadTargetBarConfiguration(targetBar: TargetBarDTO) {
    if (this.targetBar.state.isEmpty) return;
    this.targetBar.utility.getDisplayValues(targetBar);
    this.targetBar.utility.setInactiveMetric(targetBar);
    this.targetBar.utility.convertNumtoStr(targetBar);
  }
}