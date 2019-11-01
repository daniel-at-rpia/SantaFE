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
  SecurityGroupAverageVisualizerDTO,
  QuantComparerDTO
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
} from 'Core/constants/colorSchemes.constant';
import {
  MetricOptions,
  SecurityGroupDefinitionMap
} from 'Core/constants/marketConstants.constant';

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    rawData: BESecurityDTO,
    isStencil: boolean
  ): SecurityDTO {
    const ratingLevel = Math.floor(Math.random()*7 + 1);
    const object:SecurityDTO = {
      data: {
        name: !isStencil ? rawData.name : 'PLACEHOLDER',
        ratingLevel: ratingLevel,
        ratingValue: !isStencil ? this.utility.mapRatingsReverse(ratingLevel) : 'AA',
        seniorityLevel: Math.floor(Math.random()*5 + 1)
      },
      state: {
        isSelected: false,
        isStencil: isStencil,
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
        },
        definitionConfig: !!rawData ? rawData.groupIdentifier.groupOptionValues : {}
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

  public generateSecurityGroupDefinitionFilterOptionList(
    name,
    options
  ): Array<SecurityGroupDefinitionFilterBlock> {
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
        urlForGetLongOptionListFromServer: rawData.urlForGetLongOptionListFromServer || null,
        filterOptionList: this.generateSecurityGroupDefinitionFilterOptionList(rawData.key, rawData.optionList)
      },
      style: {
        icon: rawData.icon,
        secondaryIcon: rawData.secondaryIcon || ''
      },
      state: {
        isLocked: rawData.locked,
        isUnactivated: false,
        // isUnactivated: true,
        groupByActive: false,
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
        })
      },
      state: {
        showFiltersFromDefinition: null,
        showLongFilterOptions: false,
        isLoading: false,
        isLoadingLongOptionListFromServer: false
      }
    };
    return object;
  }

  public formAverageVisualizerObject():SecurityGroupAverageVisualizerDTO{
    const object:SecurityGroupAverageVisualizerDTO = {
      data: {
        stats: [
          this.formSecurityGroupMetricObject(MetricOptions[0].label, 'DoD'),
          this.formSecurityGroupMetricObject(MetricOptions[0].label, 'WoW'),
          this.formSecurityGroupMetricObject(MetricOptions[0].label, 'MoM')
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
    object.data.stats[1].sortHierarchy = 1;
    return object;
  }

  public formSecurityGroupMetricObject(
    label?: string,
    deltaScope?: string
  ): SecurityGroupMetricBlock{
    const object = {
      isEmpty: !label,
      sortHierarchy: null,
      deltaScope: deltaScope || null,
      label: label || '',
      value: 100,
      absMax: 100,
      percentage: 100
    }
    return object;
  }

  public formQuantComparerObject(
    isStencil: boolean,
    isSpread: boolean,
    bidNumber: number,
    bidSize: number,
    offerNumber: number,
    offerSize: number
  ): QuantComparerDTO {
    const tier2Shreshold = isSpread ? 20 : 10;
    const delta = isSpread ? bidNumber - offerNumber : offerNumber - bidNumber;
    const object: QuantComparerDTO = {
      data: {
        isSpread: isSpread,
        delta: delta,
        bid: {
          number: !isStencil ? bidNumber : 33,
          broker: !isStencil ? 'GS' : 'PL',
          size: bidSize
        },
        offer: {
          number: !isStencil ? offerNumber : 33,
          broker: !isStencil ? 'JPM' : 'PL',
          size: offerSize
        }
      },
      style: {
        lineWidth: 80,
        bidLineHeight: 30,
        offerLineHeight: 30
      },
      state: {
        isStencil: isStencil,
        isCalculated: false,
        isCrossed: !isStencil && delta <= 0,
        isCrossedTier2: delta <= -tier2Shreshold,
      }
    };
    return object;
  }
}