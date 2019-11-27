import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityDefinitionDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-definition',
  templateUrl: './security-definition.component.html',
  styleUrls: ['./security-definition.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityDefinition implements OnInit {
  @Input() definitionData: SecurityDefinitionDTO;
  @Input() selected: boolean;
  @Input() backgroundVariant: boolean;
  @Input() heroVariant: boolean;
  @Input() interactionDisabled: boolean;
  @Input() groupByDisabled: boolean;
  @Output() onClick = new EventEmitter<SecurityDefinitionDTO>();
  constructor(
  ) {
  }

  ngOnInit() {

  }

  onClickDefinition() {
    if (!this.interactionDisabled) {
      this.onClick.emit(this.definitionData);
    }
  }

}
