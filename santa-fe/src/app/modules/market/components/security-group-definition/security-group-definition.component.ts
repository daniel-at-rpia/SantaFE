import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityGroupDefinitionDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-group-definition',
  templateUrl: './security-group-definition.component.html',
  styleUrls: ['./security-group-definition.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityGroupDefinition implements OnInit {
  @Input() definitionData: SecurityGroupDefinitionDTO;
  @Input() selected: boolean;
  @Input() backgroundVariant: boolean;
  @Input() heroVariant: boolean;
  @Input() interactionDisabled: boolean;
  @Output() onClick = new EventEmitter<SecurityGroupDefinitionDTO>();
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
