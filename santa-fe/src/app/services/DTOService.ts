import { Injectable } from '@angular/core';
import {
  BESecurityDTO,
  BESecurityGroupDTO
} from 'App/models/backend/backend-models.interface';
import {
  SecurityDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupDefinitionFilterDTO
} from 'App/models/frontend/frontend-models.interface';
import {
  SecurityDefinitionStub
} from 'App/models/frontend/frontend-stub-models.interface';
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
    rawData: BESecurityGroupDTO
  ): SecurityGroupDTO {
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:SecurityGroupDTO = {
      data: {
        name: rawData.groupName,
        ratingLevel: ratingLevel,
        ratingValue: this.utility.mapRatings(ratingLevel),
        numOfSecurities: rawData.numOfSecurities,
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
        isStencil: false
      },
      graph: {
        leftPie: {
          name: `Some Group Name ${rawData.numOfSecurities}-1`,
          colorScheme: SecurityGroupRatingColorScheme,
          chart: null
        },
        rightPie: {
          name: `Some Group Name ${rawData.numOfSecurities}-2`,
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
        isStacked: rawData.isStacked || false,
        secondaryIcon: rawData.secondaryIcon || ''
      },
      state: {
        isStatic: false,
        filterActive: false
      }
    }
    return object;
  }

  public createSecurityGroupDefinitionConfigurator():SecurityGroupDefinitionConfiguratorDTO {
    const object:SecurityGroupDefinitionConfiguratorDTO = {
      data: {
        definitionList: SecurityGroupDefinitionMap.map((eachDefinitionStub) => {
          return this.formSecurityGroupDefinitionObject(eachDefinitionStub);
        }),
        selectedDefinitionList: [],
        showFiltersFromDefinition: null
      },
      state: {

      }
    };
    //object.data.showFiltersFromDefinition = object.data.definitionList[0];
    return object;
  }

  public generateSecurityGroupDefinitionFilterOptionList(name, options): Array<SecurityGroupDefinitionFilterDTO> {
    return options.map((eachOption) => {
      const normalizedOption = this.utility.normalizeDefinitionFilterOption(eachOption);
      const newFilterDTO:SecurityGroupDefinitionFilterDTO = {
        displayLabel: eachOption,
        shortKey: normalizedOption,
        key: this.utility.formDefinitionFilterOptionKey(name, normalizedOption),
        isSelected: false
      }
      return newFilterDTO;
    })
  };
}