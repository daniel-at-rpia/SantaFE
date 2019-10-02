import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SecurityGroupDTO } from 'App/models/frontend/frontend-models.interface';

@Component({
  selector: 'security-group-definition',
  templateUrl: './security-group-definition.component.html',
  styleUrls: ['./security-group-definition.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupDefinition implements OnInit {
  @Input() definitionData;
  constructor(
  ) {
    this.definitionData = {
      state: {
        
      }
    }
  }

  ngOnInit() {

  }

}
