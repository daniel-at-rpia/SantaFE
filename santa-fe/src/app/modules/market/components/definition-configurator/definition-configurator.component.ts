import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import { SecurityGroupDefinitionConfiguratorDTO } from 'App/models/frontend/frontend-models.interface';

@Component({
  selector: 'security-group-definition-configurator',
  templateUrl: './definition-configurator.component.html',
  styleUrls: ['./definition-configurator.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupDefinitionConfigurator implements OnInit {
  @Input() configuratorData: SecurityGroupDefinitionConfiguratorDTO;
  constructor(
  ) {
  }

  ngOnInit() {

  }

  selectDefinitionForGrouping(targetDefinition) {
    const existIndex = this.configuratorData.data.selectedDefinitionList.indexOf(targetDefinition);
    if ( existIndex >= 0) {
      this.configuratorData.data.selectedDefinitionList.splice(existIndex, 1);
    } else {
      this.configuratorData.data.selectedDefinitionList.push(targetDefinition);
    }
  }

  onClickDefinition(targetDefinition){
    this.configuratorData.data.showFiltersFromDefinition = this.configuratorData.data.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
  }

}
