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
    this.configuratorData.data.definitionList.forEach((eachDefinition) => {
      if (eachDefinition.state.isLocked) {
        eachDefinition.state.isUnactivated = false;
      }
    });
  }

  selectDefinitionForGrouping(targetDefinition: SecurityGroupDefinitionDTO) {
    if (!targetDefinition.state.isLocked) {
      const existIndex = this.configuratorData.data.selectedDefinitionList.indexOf(targetDefinition);
      if ( existIndex >= 0) {
        targetDefinition.state.isUnactivated = true;
        if (targetDefinition === this.configuratorData.showFiltersFromDefinition) {
          this.clearSearchFilter();
          this.clearDefinitionFilterOptions(targetDefinition);
          this.configuratorData.showFiltersFromDefinition = null;
        }
        this.configuratorData.data.selectedDefinitionList.splice(existIndex, 1);
      } else {
        targetDefinition.state.isUnactivated = false;
        this.configuratorData.data.selectedDefinitionList.push(targetDefinition);
      }
    }
  }

  onClickDefinition(targetDefinition: SecurityGroupDefinitionDTO){
    if (!targetDefinition.state.isUnactivated) {
      this.clearSearchFilter();
      this.configuratorData.showFiltersFromDefinition = this.configuratorData.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
      if (this.configuratorData.showFiltersFromDefinition) {
        this.configuratorData.state.showLongFilterOptions = this.configuratorData.showFiltersFromDefinition.data.filterOptionList.length > 5;  // any list with more than five options is considered a long list, will need extra room on the UI
      }
    }
  }

  onClickFilterOption(targetOption:SecurityGroupDefinitionFilterDTO){
    const targetDefinition = this.configuratorData.showFiltersFromDefinition;
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
    if (this.configuratorData.showFiltersFromDefinition) {
      this.configuratorData.filterSearchInputValue = newKeyword;
      if (!!newKeyword && newKeyword.length >= 1) {
        this.configuratorData.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          if (this.applySearchFilter(eachOption, newKeyword)) {
            eachOption.state.isFilteredOut = false;
          } else {
            eachOption.state.isFilteredOut = true;
          }
        })
      } else {
        this.configuratorData.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
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

  clearSearchFilter(){
    this.configuratorData.filterSearchInputValue = '';
    this.onSearchKeywordChange('');
  }

  clearDefinitionFilterOptions(targetDefinition: SecurityGroupDefinitionDTO){
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      eachOption.state.isSelected = false;
    });
    targetDefinition.state.filterActive = false;
  }

  triggerSearch(){
    this.configuratorData.state.isLoading = true;
  }

}
