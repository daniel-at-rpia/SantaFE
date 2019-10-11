import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupDefinitionDTO
} from 'FEModels/frontend-models.interface';
import {
  SecurityGroupDefinitionFilterBlock
} from 'FEModels/frontend-blocks.interface';

@Component({
  selector: 'security-group-definition-configurator',
  templateUrl: './definition-configurator.component.html',
  styleUrls: ['./definition-configurator.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityGroupDefinitionConfigurator implements OnInit {
  @Input() configuratorData: SecurityGroupDefinitionConfiguratorDTO;
  @Output() onClickSearch = new EventEmitter();
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
        if (targetDefinition === this.configuratorData.state.showFiltersFromDefinition) {
          this.clearSearchFilter();
          this.configuratorData.state.showFiltersFromDefinition = null;
        }
        this.clearDefinitionFilterOptions(targetDefinition);
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
      this.configuratorData.state.showFiltersFromDefinition = this.configuratorData.state.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
      if (this.configuratorData.state.showFiltersFromDefinition) {
        this.configuratorData.state.showLongFilterOptions = this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.length > 5;  // any list with more than five options is considered a long list, will need extra room on the UI
      }
    }
  }

  onClickFilterOption(targetOption:SecurityGroupDefinitionFilterBlock){
    const targetDefinition = this.configuratorData.state.showFiltersFromDefinition;
    targetOption.isSelected = !targetOption.isSelected;
    let filterActive = false;
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      if (eachOption.isSelected) {
        filterActive = true;
      }
    });
    targetDefinition.state.filterActive = filterActive;
  }

  onSearchKeywordChange(newKeyword){
    if (this.configuratorData.state.showFiltersFromDefinition) {
      this.configuratorData.data.filterSearchInputValue = newKeyword;
      if (!!newKeyword && newKeyword.length >= 1) {
        this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          if (this.applySearchFilter(eachOption, newKeyword)) {
            eachOption.isFilteredOut = false;
          } else {
            eachOption.isFilteredOut = true;
          }
        })
      } else {
        this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          eachOption.isFilteredOut = false;
        })
      }
    }
  }

  applySearchFilter(targetOption: SecurityGroupDefinitionFilterBlock, keyword: string):boolean {
    const normalizedTarget = targetOption.displayLabel.toLowerCase();
    const normalizedKeyword = keyword.toLowerCase();
    return normalizedTarget.includes(normalizedKeyword);
  }

  clearSearchFilter(){
    this.configuratorData.data.filterSearchInputValue = '';
    this.onSearchKeywordChange('');
  }

  clearDefinitionFilterOptions(targetDefinition: SecurityGroupDefinitionDTO){
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      eachOption.isSelected = false;
    });
    targetDefinition.state.filterActive = false;
  }

  triggerSearch(){
    this.configuratorData.state.isLoading = true;
    this.onClickSearch.emit();
  }

}
