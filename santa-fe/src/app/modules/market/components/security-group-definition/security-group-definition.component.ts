import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityGroupDefinitionDTO } from 'App/models/frontend/frontend-models.interface';

@Component({
  selector: 'security-group-definition',
  templateUrl: './security-group-definition.component.html',
  styleUrls: ['./security-group-definition.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupDefinition implements OnInit {
  @Input() definitionData: SecurityGroupDefinitionDTO;
  @Input() selected: boolean;
  @Output() onClick = new EventEmitter<SecurityGroupDefinitionDTO>();
  constructor(
  ) {
  }

  ngOnInit() {

  }

  onClickDefinition() {
    this.onClick.emit(this.definitionData);
  }

}
