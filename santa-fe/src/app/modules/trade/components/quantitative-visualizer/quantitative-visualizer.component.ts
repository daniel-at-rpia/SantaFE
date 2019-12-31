import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  QuantitativeVisualizerDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'quantitative-visualizer',
  templateUrl: './quantitative-visualizer.component.html',
  styleUrls: ['./quantitative-visualizer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class QuantitativeVisualizer {
  @Input() visualizerData: QuantitativeVisualizerDTO;
  constructor() { }

}
