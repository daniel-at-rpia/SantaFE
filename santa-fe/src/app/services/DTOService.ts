import { Injectable } from '@angular/core';
import {
  BESecurityDTO,
  BESecurityGroupDTO
} from 'BEModels/backend-models.interface';
import {
  SecurityDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupAverageVisualizerDTO
} from 'FEModels/frontend-models.interface';
import {
  SecurityGroupDefinitionFilterBlock
} from 'FEModels/frontend-blocks.interface';
import { SecurityDefinitionStub } from 'FEModels/frontend-stub-models.interface';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupRatingColorScheme,
  SecurityGroupSeniorityColorScheme
} from 'App/stubs/colorSchemes.stub';
import {
  MetricOptions,
  SecurityGroupDefinitionMap
} from 'App/stubs/marketModuleSpecifics.stub';

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    rawData: BESecurityDTO
  ): SecurityDTO {
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:SecurityDTO = {
      data: {
        name: rawData.name,
        ratingLevel: ratingLevel,
        ratingValue: this.utility.mapRatingsReverse(ratingLevel),
        seniorityLevel: Math.floor(Math.random()*5 + 1)
      },
      state: {
        isSelected: false,
        isStencil: false,
        isTable: false
      }
    };
    return object;
  }

  public formSecurityGroupObject(
    rawData: BESecurityGroupDTO,
    isStencil?: boolean
  ): SecurityGroupDTO {
    const object:SecurityGroupDTO = {
      data: {
        name: isStencil ? 'PLACEHOLDER' : rawData.groupName,
        ratingLevel: isStencil ? 1 : this.utility.mapRatings(rawData.metrics['ratingNoNotch']),
        ratingValue: isStencil ? 'AA' : rawData.metrics['ratingNoNotch'],
        numOfSecurities: isStencil ? 32 : rawData.numSecurities,
        stats: [],
        metrics: this.utility.packMetricData(rawData),
        primaryMetric: this.utility.retrievePrimaryMetricValue(rawData),
        sort: {
          primarySortMetricValue: null,
          secondarySortMetricValue: null,
          tertiarySortMetricValue: null
        }
      },
      state: {
        isSelected: false,
        isExpanded: false,
        isStencil: !!isStencil,
        averageCalculationComplete: !isStencil,
        pieChartComplete: false  // pie chart always needs to be drawn, while average may or may not be calculated instanteneously if it is not stencil
      },
      graph: {
        leftPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupRatingColorScheme,
          chart: null,
          rawSupportingData: isStencil ? {} : this.utility.retrieveRawSupportingDataForLeftPie(rawData)
        },
        rightPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupSeniorityColorScheme,
          chart: null,
          rawSupportingData: this.utility.retrieveRawSupportingDataForRightPie(rawData)
        }
      }
    };
    return object;
  }

  public updateSecurityGroupObject(
    rawData: BESecurityGroupDTO,
    oldStencilDTO: SecurityGroupDTO
  ) {
    const newObject = this.formSecurityGroupObject(rawData, false);
    oldStencilDTO.data = newObject.data;
    oldStencilDTO.graph.leftPie.rawSupportingData = newObject.graph.leftPie.rawSupportingData;
    oldStencilDTO.graph.rightPie.rawSupportingData = newObject.graph.rightPie.rawSupportingData;
    oldStencilDTO.state.isStencil = false;
  }

  public generateSecurityGroupDefinitionFilterOptionList(name, options): Array<SecurityGroupDefinitionFilterBlock> {
    return options.map((eachOption) => {
      const normalizedOption = this.utility.normalizeDefinitionFilterOption(eachOption);
      const newFilterDTO:SecurityGroupDefinitionFilterBlock = {
        isSelected: false,
        isFilteredOut: false,
        displayLabel: eachOption,
        shortKey: normalizedOption,
        key: this.utility.formDefinitionFilterOptionKey(name, normalizedOption)
      }
      return newFilterDTO;
    })
  };

  public formSecurityGroupDefinitionObject(
    rawData: SecurityDefinitionStub
  ): SecurityGroupDefinitionDTO {
    const object:SecurityGroupDefinitionDTO = {
      data: {
        name: rawData.displayName,
        key: rawData.key,
        filterOptionList: this.generateSecurityGroupDefinitionFilterOptionList(rawData.key, rawData.optionList)
      },
      style: {
        icon: rawData.icon,
        secondaryIcon: rawData.secondaryIcon || ''
      },
      state: {
        isLocked: rawData.locked,
        isUnactivated: true,
        filterActive: false
      }
    }
    return object;
  }

  public createSecurityGroupDefinitionConfigurator():SecurityGroupDefinitionConfiguratorDTO {
    const object:SecurityGroupDefinitionConfiguratorDTO = {
      data: {
        filterSearchInputValue: '',
        definitionList: SecurityGroupDefinitionMap.map((eachDefinitionStub) => {
          return this.formSecurityGroupDefinitionObject(eachDefinitionStub);
        }),
        selectedDefinitionList: []
      },
      state: {
        showFiltersFromDefinition: null,
        showLongFilterOptions: false,
        isLoading: false
      }
    };
    return object;
  }

  public formAverageVisualizerObject():SecurityGroupAverageVisualizerDTO{
    const object:SecurityGroupAverageVisualizerDTO = {
      data: {
        stats: [
          {
            isEmpty: true,
            sortHierarchy: null,
            deltaScope: null,
            label: '',
            value: 100,
            max: 100,
            percentage: 100
          },{
            isEmpty: true,
            sortHierarchy: null,
            deltaScope: null,
            label: '',
            value: 100,
            max: 100,
            percentage: 100
          },{
            isEmpty: false,
            sortHierarchy: null,
            deltaScope: null,
            label: MetricOptions[1].label,
            value: 100,
            max: 100,
            percentage: 100
          }
        ]
      },
      state: {
        isEmpty: true,
        isStencil: false,
        isExpanded: false,
        selectingStat: null,
        editingStat: null,
        editingStatSelectedMetric: null,
        editingStatSelectedMetricValueType: null,
        editingStatSelectedMetricDeltaType: null
      }
    }
    return object;
  }
}