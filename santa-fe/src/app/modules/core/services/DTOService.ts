  // dependencies
    import { Injectable } from '@angular/core';
    import {
      BESecurityDTO,
      BESecurityGroupDTO
    } from 'BEModels/backend-models.interface';
    import {
      SecurityDTO,
      SecurityGroupDTO,
      SecurityGroupDefinitionDTO,
      SecurityGroupDefinitionBundleDTO,
      SecurityGroupDefinitionConfiguratorDTO,
      SecurityGroupAverageVisualizerDTO,
      QuantComparerDTO,
      SearchShortcutDTO,
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO,
      SecurityTableCellDTO,
      SecurityQuoteDTO
    } from 'FEModels/frontend-models.interface';
    import {
      SecurityGroupMetricBlock,
      SecurityGroupDefinitionFilterBlock,
      QuoteMetricBlock
    } from 'FEModels/frontend-blocks.interface';
    import {
      SecurityDefinitionStub,
      SecurityDefinitionBundleStub,
      SecurityTableMetricStub,
      SecurityMetricOptionStub
    } from 'FEModels/frontend-stub-models.interface';
    import { UtilityService } from './UtilityService';
    import {
      SecurityGroupRatingColorScheme,
      SecurityGroupSeniorityColorScheme
    } from 'Core/constants/colorSchemes.constant';
    import {
      GroupMetricOptions,
      ConfiguratorDefinitionLayout
    } from 'Core/constants/marketConstants.constant';
    import {
      QuoteMetricList
    } from 'Core/constants/securityTableConstants.constant';
  // 

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    rawData: BESecurityDTO,
    isStencil: boolean
  ): SecurityDTO {
    // !isStencil && console.log('rawData', rawData.name, rawData);
    const object:SecurityDTO = {
      data: {
        securityID: !isStencil ? rawData.securityIdentifier.securityId : null,
        name: !isStencil ? rawData.name : 'PLACEHOLDER',
        ratingLevel: !isStencil ? this.utility.mapRatings(rawData.metrics.ratingNoNotch) : 0,
        ratingValue: !isStencil ? rawData.metrics.ratingNoNotch : 'NR',
        seniorityLevel: !isStencil ? this.utility.mapSeniorities(rawData.seniority) : 5,
        position: 0,
        positionInMM: 'n/a',
        metricPack: this.utility.packMetricData(rawData)
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
    rawData: BESecurityGroupDTO
  ): SecurityGroupDTO {
    const object:SecurityGroupDTO = {
      data: {
        name: !!rawData ?  rawData.groupName.replace(/\|/g, ' | ') : 'PLACEHOLDER',
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
        isMetricCompleted: false,
        isLandscapeView: false
      },
      graph: {
        leftPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupRatingColorScheme,
          chart: null,
          rawSupportingData: {}
          // rawSupportingData: this.utility.retrieveRawSupportingDataForLeftPie(rawData)
        },
        rightPie: {
          name: this.utility.generateUUID(),
          colorScheme: SecurityGroupSeniorityColorScheme,
          chart: null,
          rawSupportingData: {} 
          // rawSupportingData: this.utility.retrieveRawSupportingDataForRightPie(rawData)
        }
      }
    };
    return object;
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

  public formSecurityGroupDefinitionBundleObject(
    stubData: SecurityDefinitionBundleStub
  ): SecurityGroupDefinitionBundleDTO {
    const object: SecurityGroupDefinitionBundleDTO = {
      data: {
        label: stubData.label,
        list: stubData.list.map((eachStubDefinition) => {
          return this.formSecurityGroupDefinitionObject(eachStubDefinition);
        })
      },
      state: {

      }
    }
    return object;
  }

  public createSecurityGroupDefinitionConfigurator(): SecurityGroupDefinitionConfiguratorDTO {
    const object:SecurityGroupDefinitionConfiguratorDTO = {
      data: {
        filterSearchInputValue: '',
        definitionList: ConfiguratorDefinitionLayout.map((eachBundle) => {
          return this.formSecurityGroupDefinitionBundleObject(eachBundle);
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

  public formAverageVisualizerObject(): SecurityGroupAverageVisualizerDTO {
    const object:SecurityGroupAverageVisualizerDTO = {
      data: {
        stats: [
          this.formSecurityGroupMetricObject(GroupMetricOptions[0].label, 'DoD'),
          this.formSecurityGroupMetricObject(GroupMetricOptions[0].label, 'WoW'),
          this.formSecurityGroupMetricObject(GroupMetricOptions[0].label, 'MoM')
        ]
      },
      state: {
        isEmpty: true,
        isStencil: false,
        isExpanded: false,
        editingStat: null,
        editingStatSelectedMetric: null,
        editingStatSelectedMetricValueType: null,
        editingStatSelectedMetricDeltaType: null
      }
    }
    return object;
  }

  public formSecurityGroupMetricObject(
    label?: string,
    deltaScope?: string
  ): SecurityGroupMetricBlock {
    const object = {
      isEmpty: !label,
      sortHierarchy: null,
      deltaScope: deltaScope || null,
      label: label || '',
      value: 100,
      absMax: 100,
      percentage: 75
    }
    return object;
  }

  public formSearchShortcutObject(
    definitionList: Array<SecurityGroupDefinitionDTO>,
    title: string
  ): SearchShortcutDTO {
    const object: SearchShortcutDTO = {
      data: {
        displayTitle: title,
        configuration: definitionList
      },
      style: {
        slotList: [null, null, null, null, null]
      },
      state: {
        isSelected: false,
        isUserInputBlocked: false
      }
    };
    definitionList.forEach((eachDefinition, index) => {
      if ( index !== 0 && index <= 5 ) {
        object.style.slotList[index-1] = eachDefinition;
      }
    });
    return object;
  }

  public formQuantComparerObject(
    isStencil: boolean,
    isSpread: boolean,
    bidNumber: number,
    bidSize: number,
    bidBroker: string,
    offerNumber: number,
    offerSize: number,
    offerBroker: string
  ): QuantComparerDTO {
    const tier2Shreshold = isSpread ? 20 : 10;
    const delta = isSpread ? bidNumber - offerNumber : offerNumber - bidNumber;
    const object: QuantComparerDTO = {
      data: {
        isSpread: isSpread,
        delta: delta,
        bid: {
          number: !isStencil ? bidNumber : 33,
          broker: !isStencil ? 'GS' : bidBroker,
          size: bidSize
        },
        offer: {
          number: !isStencil ? offerNumber : 33,
          broker: !isStencil ? 'JPM' : offerBroker,
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
        isCrossed: !isStencil && delta < 0,
        isCrossedTier2: delta <= -tier2Shreshold,
      }
    };
    return object;
  }

  public formSecurityTableObject(): SecurityTableDTO {
    const object: SecurityTableDTO = {
      data: {
        headers: [],
        rows: []
      },
      state: {
        initialDataLoaded: false,
        initialDataRendered: false,
        isAddingColumn: false,
        selectedHeader: null,
        sortedByHeader: null
      }
    };
    return object;
  }

  public formSecurityTableHeaderObject(
    stub: SecurityTableMetricStub
  ): SecurityTableHeaderDTO {
    const object: SecurityTableHeaderDTO = {
      data: {
        displayLabel: stub.label,
        attrName: stub.attrName,
        underlineAttrName: stub.underlineAttrName,
        readyStage: stub.readyStage,
        isPartOfMetricPack: stub.isPartOfMetricPack,
        metricPackDeltaScope: stub.metricPackDeltaScope || null,
        frontendMetric: !!stub.isFrontEndMetric
      },
      state: {
        isQuantVariant: !!stub.isForQuantComparer,
        isPureTextVariant: !!stub.pureText
      }
    };
    return object;
  }

  public formSecurityTableRowObject(
    securityDTO: SecurityDTO
  ): SecurityTableRowDTO {
    const object: SecurityTableRowDTO = {
      data: {
        security: securityDTO,
        cells: [],
        quotes: [],
        quoteHeaders: QuoteMetricList.map((eachQuoteMetricStub) => {
          const metricBlock: QuoteMetricBlock = {
            displayLabelList: eachQuoteMetricStub.labelList,
            isDoubleWidthColumn: eachQuoteMetricStub.isDoubleWidthColumn,
            isTripleWidthColumn: eachQuoteMetricStub.isTripleWidthColumn,
            sortable: !eachQuoteMetricStub.textOnly
          };
          return metricBlock;
        })
      },
      state: {
        expandViewSortByQuoteMetric: null,
        isExpanded: false
      }
    };
    return object;
  }

  public formSecurityTableCellObject(
    isStencil: boolean,
    textData: string,
    isQuantVariant: boolean,
    quantComparerDTO?: QuantComparerDTO
  ): SecurityTableCellDTO {
    const object: SecurityTableCellDTO = {
      data: {
        textData: !!isStencil ? 'PLACE' : textData,
        quantComparerDTO: quantComparerDTO
      },
      state: {
        isQuantVariant: isQuantVariant,
        quantComparerUnavail: false,
        isStencil: isStencil
      }
    }
    return object;
  }

  public formSecurityQuoteObject(
    isStencil: boolean,
    hasBid: boolean,
    hasAsk: boolean,
    bidBenchmark: string,
    askBenchmark: string
  ) : SecurityQuoteDTO {
    const object: SecurityQuoteDTO = {
      data: {
        broker: 'GS',
        time: '12:01 pm',
        dataSource: 'RUN',
        consolidatedBenchmark: hasBid ? bidBenchmark : askBenchmark,
        bid: {
          isAxe: false,
          size: '10MM',
          price: 105.483,
          yield: 4.16,
          tspread: 181.00,
          benchmark: bidBenchmark
        },
        ask: {
          isAxe: true,
          size: '5MM',
          price: 106.338,
          yield: 4.13,
          tspread: 176.00,
          benchmark: askBenchmark
        }
      },
      state: {
        isStencil: isStencil,
        hasBid: hasBid,
        hasAsk: hasAsk,
        diffBenchmark: bidBenchmark !== askBenchmark && hasBid && hasAsk
      }
    };
    return object;
  }

}