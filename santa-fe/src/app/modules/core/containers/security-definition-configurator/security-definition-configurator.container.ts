import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityDefinitionConfiguratorDTO,SecurityDefinitionDTO } from 'FEModels/frontend-models.interface';
import { SecurityDefinitionFilterBlock } from 'FEModels/frontend-blocks.interface';
import { ConfiguratorDefinitionLayout } from 'Core/constants/securityDefinitionConstants.constant';

@Component({
  selector: 'security-definition-configurator',
  templateUrl: './security-definition-configurator.container.html',
  styleUrls: ['./security-definition-configurator.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityDefinitionConfigurator implements OnInit {
  configuratorDefinitionlayout: Array<any>;
  @Input() configuratorData: SecurityDefinitionConfiguratorDTO;
  @Input() highlightedVariant: boolean;
  @Output() onClickLoadLongOptionList = new EventEmitter<SecurityDefinitionDTO>();
  @Output() onClickSearch = new EventEmitter();
  constructor(
  ) {
  }

  ngOnInit() {
    this.configuratorData.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        if (eachDefinition.state.isLocked) {
          eachDefinition.state.isUnactivated = false;
        }
      });
    });
  }

  public onClickLoadLongOptionListForDefinition(targetDefinition: SecurityDefinitionDTO) {
    this.configuratorData.state.isLoadingLongOptionListFromServer = true;
    this.onClickLoadLongOptionList.emit(targetDefinition);
  }

  selectDefinitionForGrouping(targetDefinition: SecurityDefinitionDTO) {
    if (!targetDefinition.state.isLocked) {
      targetDefinition.state.groupByActive = !targetDefinition.state.groupByActive;
      // disable the two-step config workflow through commenting, so we can bring it back up easily if necessary
      // const existIndex = this.configuratorData.data.selectedDefinitionList.indexOf(targetDefinition);
      // if ( existIndex >= 0) {
      //   targetDefinition.state.isUnactivated = true;
      //   if (targetDefinition === this.configuratorData.state.showFiltersFromDefinition) {
      //     this.clearSearchFilter();
      //     this.configuratorData.state.showFiltersFromDefinition = null;
      //   }
      //   this.clearDefinitionFilterOptions(targetDefinition);
      //   this.configuratorData.data.selectedDefinitionList.splice(existIndex, 1);
      // } else {
      //   targetDefinition.state.isUnactivated = false;
      //   this.configuratorData.data.selectedDefinitionList.push(targetDefinition);
      // }
    }
  }

  onClickDefinition(targetDefinition: SecurityDefinitionDTO){
    if (!targetDefinition.state.isUnactivated) {
      this.clearSearchFilter();
      if (this.configuratorData.state.showFiltersFromDefinition && this.configuratorData.state.showFiltersFromDefinition.data.urlForGetLongOptionListFromServer) {
        // have to flush out the long options for performance concerns
        this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList = [];
      }
      this.configuratorData.state.showFiltersFromDefinition = this.configuratorData.state.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
      if (this.configuratorData.state.showFiltersFromDefinition) {
        this.configuratorData.state.showLongFilterOptions = this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.length > 5 || !!this.configuratorData.state.showFiltersFromDefinition.data.urlForGetLongOptionListFromServer;  // any list with more than five options or need to be loaded from server is considered a long list, will need extra room on the UI
      }
    }
  }

  onClickFilterOption(targetOption:SecurityDefinitionFilterBlock){
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

  applySearchFilter(targetOption: SecurityDefinitionFilterBlock, keyword: string):boolean {
    const normalizedTarget = targetOption.displayLabel.toLowerCase();
    const normalizedKeyword = keyword.toLowerCase();
    return normalizedTarget.includes(normalizedKeyword);
  }

  clearSearchFilter(){
    this.configuratorData.data.filterSearchInputValue = '';
    this.onSearchKeywordChange('');
  }

  clearDefinitionFilterOptions(targetDefinition: SecurityDefinitionDTO){
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
