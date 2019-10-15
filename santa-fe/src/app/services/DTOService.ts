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
import { SecurityGroupDefinitionMap } from 'App/stubs/securityGroupDefinitions.stub';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupRatingColorScheme,
  SecurityGroupSeniorityColorScheme
} from 'App/stubs/colorSchemes.stub';
import { MetricOptions } from 'App/stubs/averageVisualizerMetrics.stub';

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
        ratingValue: this.utility.mapRatings(ratingLevel),
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
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:SecurityGroupDTO = {
      data: {
        name: isStencil ? 'PLACEHOLDER' : rawData.groupName,
        ratingLevel: ratingLevel,
        ratingValue: this.utility.mapRatings(ratingLevel),
        numOfSecurities: isStencil ? 32 : rawData.numOfSecurities,
        stats: []
      },
      state: {
        isSelected: false,
        isExpanded: false,
        isStencil: !!isStencil,
        stencilAnimationComplete: false
      },
      graph: {
        leftPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupRatingColorScheme,
          chart: null
        },
        rightPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupSeniorityColorScheme,
          chart: null
        }
      }
    };
    return object;
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
            label: MetricOptions[1].label,
            value: 100,
            max: 100,
            percentage: 100
          },{
            isEmpty: true,
            label: '',
            value: 100,
            max: 100,
            percentage: 100
          },{
            isEmpty: true,
            label: '',
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