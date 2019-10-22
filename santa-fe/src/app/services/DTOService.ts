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
  SecurityGroupMetricBlock,
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
    areChartsReady: boolean
  ): SecurityGroupDTO {
    const object:SecurityGroupDTO = {
      data: {
        name: !!rawData ?  rawData.groupName : 'PLACEHOLDER',
        ratingLevel: !!rawData ? this.utility.mapRatings(rawData.metrics['ratingNoNotch']) : 1,
        ratingValue: !!rawData ? rawData.metrics['ratingNoNotch'] : 'AA',
        numOfSecurities: !!rawData ? rawData.numSecurities : 32,
        stats: [],
        metricPack: this.utility.packMetricData(rawData),
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
        isStencil: !rawData,
        areChartsReady: !!areChartsReady,
        averageCalculationComplete: false,
        pieChartComplete: false
      },
      graph: {
        leftPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupRatingColorScheme,
          chart: null,
          rawSupportingData: !areChartsReady ? {} : this.utility.retrieveRawSupportingDataForLeftPie(rawData)
        },
        rightPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupSeniorityColorScheme,
          chart: null,
          rawSupportingData: !areChartsReady ? {} : this.utility.retrieveRawSupportingDataForRightPie(rawData)
        }
      }
    };
    return object;
  }

  public updateSecurityGroupWithPieCharts(
    rawData: BESecurityGroupDTO,
    groupDTO: SecurityGroupDTO
  ) {
    const newObject = this.formSecurityGroupObject(rawData, true);
    groupDTO.graph.leftPie.rawSupportingData = newObject.graph.leftPie.rawSupportingData;
    groupDTO.graph.rightPie.rawSupportingData = newObject.graph.rightPie.rawSupportingData;
    groupDTO.state.areChartsReady = true;
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
          this.formSecurityGroupMetricObject(),
          this.formSecurityGroupMetricObject(),
          this.formSecurityGroupMetricObject()
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
    object.data.stats[1].isEmpty = false;
    object.data.stats[1].label = MetricOptions[3].label;
    object.data.stats[2].isEmpty = false;
    object.data.stats[2].label = MetricOptions[1].label;
    object.data.stats[2].sortHierarchy = 1;
    return object;
  }

  public formSecurityGroupMetricObject(): SecurityGroupMetricBlock{
    const object = {
      isEmpty: true,
      sortHierarchy: null,
      deltaScope: null,
      label: '',
      value: 100,
      max: 100,
      percentage: 100
    }
    return object;
  }
}