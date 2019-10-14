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
import {
  SecurityDefinitionStub
} from 'FEModels/frontend-stub-models.interface';
import {
  SecurityGroupDefinitionMap
} from 'App/stubs/securityGroupDefinitions.stub';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupRatingColorScheme,
  SecurityGroupSeniorityColorScheme
} from 'App/stubs/colorSchemes.stub';

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
        stats: [
          {
            label: 'Attr1',
            value: Math.floor(Math.random()*1000),
            max: 1000,
            percentage: null
          },{
            label: 'Attr2',
            value: Math.floor(Math.random()*1000),
            max: 1000,
            percentage: null
          },{
            label: 'Attr3',
            value: Math.floor(Math.random()*1000)/100,
            max: 10,
            percentage: null
          }
        ]
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
    }
    object.data.stats.forEach((eachStat) => {
      eachStat.percentage = Math.round(eachStat.value/eachStat.max * 10000)/100;
    })
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
            label: 'Tenor',
            value: 142,
            max: 492,
            percentage: 32
          },{
            label: 'Size',
            value: 23,
            max: 392,
            percentage: 42
          },{
            label: 'T-Spread WoW',
            value: 34,
            max: 942,
            percentage: 95
          }
        ]
      },
      state: {
        isLoading: false,
        isExpanded: false
      }
    }
    return object;
  }
}