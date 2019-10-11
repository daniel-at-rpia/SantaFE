import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityGroupAverageVisualizerDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-group-average-visualizer',
  templateUrl: './security-group-average-visualizer.component.html',
  styleUrls: ['./security-group-average-visualizer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupAverageVisualizer implements OnInit {

  @Input() visualizerData: SecurityGroupAverageVisualizerDTO;

  constructor() {}

  ngOnInit() {
  }

}