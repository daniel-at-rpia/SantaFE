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
    // reset filter before changing selected Definition
    this.configuratorData.filterSearchInputValue = '';
    this.onSearchKeywordChange('');
    this.configuratorData.data.showFiltersFromDefinition = this.configuratorData.data.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
  }

  onClickFilterOption(targetOption:SecurityGroupDefinitionFilterDTO){
    const targetDefinition = this.configuratorData.data.showFiltersFromDefinition;
    targetOption.state.isSelected = !targetOption.state.isSelected;
    let filterActive = false;
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      if (eachOption.state.isSelected) {
        filterActive = true;
      }
    });
    targetDefinition.state.filterActive = filterActive;
  }

  onSearchKeywordChange(newKeyword){
    if (this.configuratorData.data.showFiltersFromDefinition) {
      this.configuratorData.filterSearchInputValue = newKeyword;
      if (!!newKeyword && newKeyword.length >= 1) {
        this.configuratorData.data.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          if (this.applySearchFilter(eachOption, newKeyword)) {
            eachOption.state.isFilteredOut = false;
          } else {
            eachOption.state.isFilteredOut = true;
          }
        })
      } else {
        this.configuratorData.data.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          eachOption.state.isFilteredOut = false;
        })
      }
    }
  }

  applySearchFilter(targetOption: SecurityGroupDefinitionFilterDTO, keyword: string):boolean {
    const normalizedTarget = targetOption.data.displayLabel.toLowerCase();
    const normalizedKeyword = keyword.toLowerCase();
    return normalizedTarget.includes(normalizedKeyword);
  }

}
