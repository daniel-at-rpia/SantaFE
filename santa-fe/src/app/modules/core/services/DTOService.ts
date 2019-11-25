  // dependencies
    import { Injectable } from '@angular/core';
    import {
      BESecurityDTO,
      BESecurityGroupDTO,
      BEQuoteDTO
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
      TriCoreMetricConfig
    } from 'Core/constants/coreConstants.constant';
    import {
      SECURITY_TABLE_QUOTE_TYPE_RUN,
      SECURITY_TABLE_QUOTE_TYPE_AXE
    } from 'Core/constants/securityTableConstants.constant';
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
        currency: !isStencil ? rawData.ccy : null,
        sector: !isStencil ? rawData.sector : null,
        couponType: !isStencil ? rawData.couponType : null,
        industry: !isStencil ? rawData.industry : null,
        securityType: !isStencil ? rawData.securityType : null,
        seniority: !isStencil ? rawData.seniority : null,
        portfolios: [],
        position: 0,
        positionInMM: 'n/a',
        positionHF: 0,
        positionHFInMM: 'n/a',
        positionNLF: 0,
        positionNLFInMM: 'n/a',
        metricPack: this.utility.packMetricData(rawData)
      },
      state: {
        isSelected: false,
        isStencil: isStencil,
        isTable: false,
        isTableExpanded: false
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
    quantMetricType: string,
    bidNumber: number,
    bidSize: number,
    bidBroker: string,
    offerNumber: number,
    offerSize: number,
    offerBroker: string
  ): QuantComparerDTO {
    const metricType = !isStencil ? quantMetricType : 'TSpread';
    const tier2Shreshold = TriCoreMetricConfig[metricType]['tier2Threshold'];
    const inversed = TriCoreMetricConfig[metricType]['inversed'];
    const hasBid = !isStencil ? (!!bidNumber && !!bidBroker) : true;
    const hasOffer = !isStencil ? (!!offerNumber && !!offerBroker) : true;
    const rounding = TriCoreMetricConfig[metricType]['rounding'];
    bidNumber = this.utility.round(bidNumber, rounding).toFixed(rounding);
    offerNumber = this.utility.round(offerNumber, rounding).toFixed(rounding);
    let delta;
    if (hasBid && hasOffer) {
      delta = inversed ? offerNumber - bidNumber : bidNumber - offerNumber;
      delta = this.utility.round(delta, rounding);
    } else {
      delta = 0;
    }
    const object: QuantComparerDTO = {
      data: {
        metricType: metricType,
        delta: delta,
        bid: {
          number: !isStencil ? bidNumber : 33,
          broker: !isStencil ? bidBroker : 'GS',
          size: bidSize
        },
        offer: {
          number: !isStencil ? offerNumber : 33,
          broker: !isStencil ? offerBroker: 'JPM',
          size: offerSize
        }
      },
      style: {
        lineWidth: 80,
        bidLineHeight: 30,
        offerLineHeight: 30
      },
      state: {
        hasBid: hasBid,
        hasOffer: hasOffer,
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
        loadedContentStage: 0,
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
        frontendMetric: !!stub.isFrontEndMetric,
        inversedSortingForText: !!stub.inversedSortingForText
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
    rawData: BEQuoteDTO
  ) : SecurityQuoteDTO {
    const hasBid = !isStencil ? (!!rawData.bidIsActive && !!rawData.bidTime) : true;
    const hasAsk = !isStencil ? (!!rawData.askIsActive && !!rawData.askTime) : true;
    const bidBenchmark = !isStencil ? rawData.bidQualifier : 'T 0.5 01/01/2020';
    const askBenchmark = !isStencil ? rawData.askQualifier : 'T 0.5 01/01/2020';
    const dataSource = !isStencil ? (hasBid ? rawData.bidVenue : rawData.askVenue) : 'PLACEHOLDER';
    const consolidatedBenchmark = bidBenchmark === askBenchmark ? bidBenchmark : null;
    let convertedDate: Date = null;
    if (!isStencil) {
      const convertBuffer = hasBid ? new Date(rawData.bidTime) : new Date(rawData.askTime);
      const test = `${convertBuffer.getFullYear()} - ${convertBuffer.getMonth()} - ${convertBuffer.getDate()} - ${convertBuffer.getHours()} - ${convertBuffer.getMinutes()} - ${convertBuffer.getSeconds()}`;
      convertedDate = new Date(Date.UTC(convertBuffer.getFullYear(), convertBuffer.getMonth(), convertBuffer.getDate(), convertBuffer.getHours(), convertBuffer.getMinutes(), convertBuffer.getSeconds()));
    }
    // const quoteDate: Date = !isStencil ? (hasBid ? new Date(rawData.bidTime) : new Date(rawData.askTime)) : null;
    const object: SecurityQuoteDTO = {
      data: {
        broker: !isStencil ? rawData.dealer : 'RBC',
        time: !isStencil ? `${convertedDate.toTimeString().slice(0, 5)}` : '12:01 pm',
        dataSource: dataSource,
        consolidatedBenchmark: consolidatedBenchmark,
        bid: {
          isAxe: false,
          size: '150',
          price: 100,
          yield: 5,
          tspread: 300,
          benchmark: bidBenchmark
        },
        ask: {
          isAxe: false,
          size: '150',
          price: 100,
          yield: 5,
          tspread: 300,
          benchmark: bidBenchmark
        }
      },
      state: {
        isStencil: isStencil,
        hasBid: hasBid,
        hasAsk: hasAsk,
        diffBenchmark: bidBenchmark !== askBenchmark && hasBid && hasAsk
      }
    };
    if (!isStencil) {
      object.data.bid = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.bidQuantity ? this.utility.parsePositionToMM(rawData.bidQuantity, false) : null,
        price: !!rawData.bidPrice ? this.utility.round(rawData.bidPrice , TriCoreMetricConfig.Price.rounding) : null,
        yield: !!rawData.bidYield ? this.utility.round(rawData.bidYield, TriCoreMetricConfig.Yield.rounding) : null,
        tspread: !!rawData.bidTSpread ? this.utility.round(rawData.bidTSpread, TriCoreMetricConfig.TSpread.rounding) : null,
        benchmark: bidBenchmark
      };
      object.data.ask = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.askQuantity ? this.utility.parsePositionToMM(rawData.askQuantity, false) : null,
        price: !!rawData.askPrice ? this.utility.round(rawData.askPrice , TriCoreMetricConfig.Price.rounding) : null,
        yield: !!rawData.askYield ? this.utility.round(rawData.askYield, TriCoreMetricConfig.Yield.rounding) : null,
        tspread: !!rawData.askTSpread ? this.utility.round(rawData.askTSpread, TriCoreMetricConfig.TSpread.rounding) : null,
        benchmark: askBenchmark
      }
    }
    return object;
  }

}