import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupDefinitionFilterDTO,
  SecurityGroupDefinitionDTO
} from 'App/models/frontend/frontend-models.interface';

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

  selectDefinitionForGrouping(targetDefinition: SecurityGroupDefinitionDTO) {
    if (!targetDefinition.state.isLocked) {
      const existIndex = this.configuratorData.data.selectedDefinitionList.indexOf(targetDefinition);
      if ( existIndex >= 0) {
        this.configuratorData.data.selectedDefinitionList.splice(existIndex, 1);
      } else {
        this.configuratorData.data.selectedDefinitionList.push(targetDefinition);
      }
    }
  }

  onClickDefinition(targetDefinition){
    this.configuratorData.data.showFiltersFromDefinition = this.configuratorData.data.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
  }

  onClickFilterOption(targetOption:SecurityGroupDefinitionFilterDTO){
    const targetDefinition = this.configuratorData.data.showFiltersFromDefinition;
    targetOption.isSelected = !targetOption.isSelected;
    let filterActive = false;
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      if (eachOption.isSelected) {
        filterActive = true;
      }
    });
    targetDefinition.state.filterActive = filterActive;
  }

}
