import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  MoveVisualizerDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'move-visualizer',
  templateUrl: './move-visualizer.component.html',
  styleUrls: ['./move-visualizer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MoveVisualizer {
  @Input() visualizerData: MoveVisualizerDTO;
  constructor() { }

}
