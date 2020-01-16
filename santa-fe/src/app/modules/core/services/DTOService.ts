  // dependencies
    import { Injectable } from '@angular/core';
    import {
      BESecurityDTO,
      BESecurityGroupDTO,
      BEBestQuoteDTO,
      BEQuoteDTO,
      BEPortfolioDTO,
      BEHistoricalQuantBlock,
      BEHistoricalSummaryDTO
    } from 'BEModels/backend-models.interface';
    import * as DTOs from 'FEModels/frontend-models.interface';
    import * as Blocks from 'FEModels/frontend-blocks.interface';
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
      GroupMetricOptions
    } from 'Core/constants/marketConstants.constant';
    import {
      ConfiguratorDefinitionLayout
    } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      QuoteMetricList
    } from 'Core/constants/securityTableConstants.constant';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
  // 

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    securityIdFull: string,
    rawData: BESecurityDTO,
    isStencil: boolean
  ): DTOs.SecurityDTO {
    // !isStencil && console.log('rawData', rawData.name, rawData);
    const object:DTOs.SecurityDTO = {
      data: {
        securityID: !isStencil ? securityIdFull : null,
        name: !isStencil ? rawData.name : 'PLACEHOLDER',
        ratingLevel: !isStencil && rawData.metrics ? this.utility.mapRatings(rawData.metrics.ratingNoNotch) : 0,
        ratingValue: !isStencil && rawData.metrics ? rawData.metrics.ratingNoNotch : null,
        ratingBucket: !isStencil && rawData.metrics ? rawData.metrics.ratingBucket : null,
        seniorityLevel: !isStencil ? this.utility.mapSeniorities(rawData.seniority) : 5,
        currency: !isStencil ? rawData.ccy : null,
        country: !isStencil ? rawData.country : null,
        sector: !isStencil ? rawData.sector : null,
        couponType: !isStencil ? rawData.couponType : null,
        industry: !isStencil ? rawData.industry : null,
        securityType: !isStencil ? rawData.securityType : null,
        seniority: !isStencil ? rawData.seniority : null,
        maturityType: !isStencil ? rawData.maturityType : null,
        primaryPmName: null,
        backupPmName: null,
        researchName: null,
        cs01Local: null,
        owner: [],
        mark: {
          mark: null,
          markRaw: null,
          markBackend: null,
          markDriver: null,
          markChangedBy: null,
          markChangedTime: null,
          markDisBid: null,
          markDisBidRaw: null,
          markDisAsk: null,
          markDisAskRaw: null,
          markDisMid: null,
          markDisMidRaw: null,
          markDisLiquidation: null,
          markDisLiquidationRaw: null
        },
        portfolios: [],
        strategyFirm: '',
        strategyList: [],
        positionCurrent: 0,
        positionCurrentInMM: 'n/a',
        positionFirm: 0,
        positionFirmInMM: 'n/a',
        positionHF: 0,
        positionHFInMM: 'n/a',
        positionNLF: 0,
        positionNLFInMM: 'n/a',
        metricPack: this.utility.packMetricData(rawData),
        bestQuote: {
          bid: null,
          ask: null
        }
      },
      state: {
        isSelected: false,
        isStencil: isStencil,
        isTable: false,
        isMultiLineVariant: false
      }
    };
    return object;
  }

  public appendPortfolioInfoToSecurityDTO(
    dto: DTOs.SecurityDTO,
    targetPortfolio: BEPortfolioDTO,
    currentSelectedMetric: string,
  ) {
    dto.data.primaryPmName = targetPortfolio.primaryPmName;
    dto.data.backupPmName = targetPortfolio.backupPmName;
    dto.data.researchName = targetPortfolio.researchName;
    dto.data.mark.markRaw = targetPortfolio.mark.value;
    dto.data.mark.markBackend = targetPortfolio.mark.value;
    dto.data.mark.markDriver = targetPortfolio.mark.driver;
    dto.data.mark.markChangedBy = targetPortfolio.mark.user;
    dto.data.mark.markChangedTime = targetPortfolio.mark.enteredTime;
    dto.data.cs01Local = targetPortfolio.cs01Local;
    dto.data.owner = [];
    !!targetPortfolio.primaryPmName && dto.data.owner.push(targetPortfolio.primaryPmName);
    !!targetPortfolio.backupPmName && dto.data.owner.push(targetPortfolio.backupPmName);
    !!targetPortfolio.researchName && dto.data.owner.push(targetPortfolio.researchName);
    // only show mark if the current selected metric is the mark's driver, unless the selected metric is default
    if (!!TriCoreMetricConfig[targetPortfolio.mark.driver] && (targetPortfolio.mark.driver === currentSelectedMetric || currentSelectedMetric === 'Default')){
      const rounding = TriCoreMetricConfig[targetPortfolio.mark.driver].rounding;
      dto.data.mark.mark = this.utility.round(dto.data.mark.markRaw, rounding).toFixed(rounding);
    } else {
      dto.data.mark.mark = null;
      dto.data.mark.markRaw = null;
    }
    const newBlock: Blocks.SecurityPortfolioBlock = {
      portfolioName: targetPortfolio.portfolioShortName,
      quantity: targetPortfolio.quantity,
      marketValueCad: targetPortfolio.marketValueCad,
      strategy: targetPortfolio.strategyName
    };
    dto.data.portfolios.push(newBlock);
  }

  public appendPortfolioOverviewInfoForSecurityDTO(
    dto: DTOs.SecurityDTO
  ) {
    dto.data.portfolios.forEach((eachPortfolioBlock) => {
      dto.data.positionFirm = dto.data.positionFirm + eachPortfolioBlock.quantity;
      if (eachPortfolioBlock.portfolioName === 'DOF' || eachPortfolioBlock.portfolioName === 'SOF') {
        dto.data.positionHF = dto.data.positionHF + eachPortfolioBlock.quantity;
      } else if (eachPortfolioBlock.portfolioName === 'STIP' || eachPortfolioBlock.portfolioName === 'FIP' || eachPortfolioBlock.portfolioName === 'CIP') {
        dto.data.positionNLF = dto.data.positionNLF + eachPortfolioBlock.quantity;
      }
      if (eachPortfolioBlock.strategy.length > 0 && dto.data.strategyList.indexOf(eachPortfolioBlock.strategy) < 0) {
        dto.data.strategyList.push(eachPortfolioBlock.strategy);
        if (dto.data.strategyList.length === 1) {
          dto.data.strategyFirm = `${eachPortfolioBlock.strategy}`;
        } else {
          dto.data.strategyFirm = `${dto.data.strategyFirm} & ${eachPortfolioBlock.strategy}`;
          console.warn('detected security with multiple strategies: ', dto.data.name, ' has strategy = ', dto.data.strategyList);
        }
      }
    });
    dto.data.positionFirmInMM = this.utility.parsePositionToMM(dto.data.positionFirm, false);
    dto.data.positionHFInMM = this.utility.parsePositionToMM(dto.data.positionHF, false);
    dto.data.positionNLFInMM = this.utility.parsePositionToMM(dto.data.positionNLF, false);
  }

  public formSecurityGroupObject(
    rawData: BESecurityGroupDTO
  ): DTOs.SecurityGroupDTO {
    const object:DTOs.SecurityGroupDTO = {
      data: {
        name: !!rawData ?  rawData.name.replace(/\|/g, ' | ') : 'PLACEHOLDER',
        ratingLevel: !!rawData && rawData.metrics ? this.utility.mapRatings(rawData.metrics.ratingNoNotch) : 0,
        ratingValue: !!rawData && rawData.metrics ? rawData.metrics.ratingNoNotch : null,
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

  public generateSecurityDefinitionFilterOptionList(
    name,
    options
  ): Array<Blocks.SecurityDefinitionFilterBlock> {
    return options.map((eachOption) => {
      const normalizedOption = this.utility.normalizeDefinitionFilterOption(eachOption);
      const newFilterDTO: Blocks.SecurityDefinitionFilterBlock = {
        isSelected: false,
        isFilteredOut: false,
        displayLabel: eachOption,
        shortKey: normalizedOption,
        key: this.utility.formDefinitionFilterOptionKey(name, normalizedOption)
      }
      return newFilterDTO;
    })
  };

  public formSecurityDefinitionObject(
    rawData: SecurityDefinitionStub
  ): DTOs.SecurityDefinitionDTO {
    const object: DTOs.SecurityDefinitionDTO = {
      data: {
        name: rawData.displayName,
        key: rawData.key,
        urlForGetLongOptionListFromServer: rawData.urlForGetLongOptionListFromServer || null,
        filterOptionList: this.generateSecurityDefinitionFilterOptionList(rawData.key, rawData.optionList),
        securityDTOAttr: rawData.securityDTOAttr
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

  public formSecurityDefinitionBundleObject(
    stubData: SecurityDefinitionBundleStub
  ): DTOs.SecurityDefinitionBundleDTO {
    const object: DTOs.SecurityDefinitionBundleDTO = {
      data: {
        label: stubData.label,
        list: stubData.list.map((eachStubDefinition) => {
          return this.formSecurityDefinitionObject(eachStubDefinition);
        })
      },
      state: {

      }
    }
    return object;
  }

  public createSecurityDefinitionConfigurator(
    groupByDisabled: boolean
  ): DTOs.SecurityDefinitionConfiguratorDTO {
    const object: DTOs.SecurityDefinitionConfiguratorDTO = {
      data: {
        filterSearchInputValue: '',
        definitionList: ConfiguratorDefinitionLayout.map((eachBundle) => {
          return this.formSecurityDefinitionBundleObject(eachBundle);
        })
      },
      state: {
        groupByDisabled: !!groupByDisabled,
        canApplyFilter: false,
        showFiltersFromDefinition: null,
        showLongFilterOptions: false,
        isLoading: false,
        isLoadingLongOptionListFromServer: false
      }
    };
    return object;
  }

  public formAverageVisualizerObject(): DTOs.SecurityGroupAverageVisualizerDTO {
    const object: DTOs.SecurityGroupAverageVisualizerDTO = {
      data: {
        stats: [
          this.formSecurityGroupMetricObject(GroupMetricOptions[0].label, 'Dod'),
          this.formSecurityGroupMetricObject(GroupMetricOptions[0].label, 'Wow'),
          this.formSecurityGroupMetricObject(GroupMetricOptions[0].label, 'Mom')
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
  ): Blocks.SecurityGroupMetricBlock {
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
    definitionList: Array<DTOs.SecurityDefinitionDTO>,
    title: string,
    skipFirstForDefaultGroupBy: boolean,
    isMajor: boolean
  ): DTOs.SearchShortcutDTO {
    const object: DTOs.SearchShortcutDTO = {
      data: {
        displayTitle: title,
        configuration: definitionList,
        isMajorShortcut: !!isMajor
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
      if (skipFirstForDefaultGroupBy) {
        if (index !== 0 && index <= 5 ) {
          object.style.slotList[index-1] = eachDefinition;
        }
      } else {
        if (index <= 4 ) {
          object.style.slotList[index] = eachDefinition;
        }
      }
    });
    return object;
  }

  public formQuantComparerObject(
    isStencil: boolean,
    quantMetricType: string,
    BEdto: BEBestQuoteDTO,
    securityCard: DTOs.SecurityDTO
  ): DTOs.QuantComparerDTO {
    const metricType = !isStencil ? quantMetricType : 'Spread';
    const backendTargetQuoteAttr = TriCoreMetricConfig[metricType]['backendTargetQuoteAttr'];
    const rawData = !!BEdto && !!BEdto[backendTargetQuoteAttr] ? BEdto[backendTargetQuoteAttr] : {};
    const bidSize = !isStencil ? this.utility.round(rawData.bidQuantity/1000000, 1) : null;
    const offerSize = !isStencil ? this.utility.round(rawData.askQuantity/1000000, 1) : null;
    const tier2Shreshold = TriCoreMetricConfig[metricType]['tier2Threshold'];
    const inversed = this.utility.isCDS(false, securityCard) ? !TriCoreMetricConfig[metricType]['inversed'] : TriCoreMetricConfig[metricType]['inversed'];
    const hasBid = !isStencil ? (!!rawData.bidQuoteValue && !!rawData.bidDealer) : true;
    const hasOffer = !isStencil ? (!!rawData.askQuoteValue && !!rawData.askDealer) : true;
    const rounding = TriCoreMetricConfig[metricType]['rounding'];
    const bidNumber = !isStencil ? this.utility.round(rawData.bidQuoteValue, rounding).toFixed(rounding) : 33;
    const offerNumber = !isStencil ? this.utility.round(rawData.askQuoteValue, rounding).toFixed(rounding) : 33;
    const bidSkew =  !isStencil ? rawData.axeSkew * 100 : 50;
    let delta;
    let mid;
    if (hasBid && hasOffer && !isStencil) {
      delta = inversed ? offerNumber - bidNumber : bidNumber - offerNumber;
      delta = this.utility.round(delta, rounding);
      mid = (rawData.bidQuoteValue + rawData.askQuoteValue)/2;
      mid = this.utility.round(mid, rounding);
    } else if( hasBid && hasOffer == false) {
      delta = 0;
      mid = rawData.bidQuoteValue;
    } else if( hasOffer && hasBid == false) {
      delta = 0;
      mid = rawData.askQuoteValue;
    } else {
      delta = 0;
      mid = 0;
    }
    const object: DTOs.QuantComparerDTO = {
      data: {
        metricType: metricType,
        delta: delta,
        mid: mid,
        bid: {
          number: bidNumber,
          broker: !isStencil ? rawData.bidDealer : 'GS',
          size: bidSize
        },
        offer: {
          number: offerNumber,
          broker: !isStencil ? rawData.askDealer: 'JPM',
          size: offerSize
        }
      },
      style: {
        lineWidth: 80,
        bidLineHeight: 30,
        offerLineHeight: 30,
        axeSkew: !isStencil ? rawData.axeSkew * 100 : 50,
        totalSkew: !isStencil ? rawData.totalSkew * 100 : 50
      },
      state: {
        hasBid: hasBid,
        hasOffer: hasOffer,
        isStencil: isStencil,
        isCalculated: false,
        isCrossed: !isStencil && delta < 0,
        isCrossedTier2: delta <= -tier2Shreshold,
        axeSkewEnabled: false,
        totalSkewEnabled: false,
        noAxeSkew: !isStencil ? rawData.axeSkew === null : true,
        noTotalSkew: !isStencil ? rawData.totalSkew === null : true,
        longEdgeState: !isStencil ? bidNumber.toString().length > 4 || offerNumber.toString().length > 4 : false
      }
    };
    return object;
  }

  public formSecurityTableObject(
    isLiveVariant: boolean
  ): DTOs.SecurityTableDTO {
    const object: DTOs.SecurityTableDTO = {
      data: {
        headers: [],
        allHeaders: [],
        rows: [],
        agGridColumnDefs: [],
        agGridRowData: [],
        agGridFrameworkComponents: {},
        agGridAggregationMap: {}
      },
      state: {
        loadedContentStage: null,
        isAddingColumn: false,
        selectedHeader: null,
        sortedByHeader: null,
        isLiveVariant: isLiveVariant,
        isAgGridReady: false,
        isNativeEnabled: false
      },
      api: {
        gridApi: null,
        columnApi: null
      }
    };
    return object;
  }

  public formSecurityTableHeaderObject(
    stub: SecurityTableMetricStub
  ): DTOs.SecurityTableHeaderDTO {
    const object: DTOs.SecurityTableHeaderDTO = {
      data: {
        key: stub.key,
        displayLabel: stub.label,
        attrName: stub.attrName,
        underlineAttrName: stub.underlineAttrName,
        blockAttrName: stub.blockAttrName || null,
        readyStage: stub.readyStage,
        metricPackDeltaScope: stub.metricPackDeltaScope || null,
        frontendMetric: !!stub.isFrontEndMetric,
        isDataTypeText: !!stub.isDataTypeText,
        targetQuantLocationFromRow: !!stub.isForQuantComparer ? stub.targetQuantLocationFromRow : 'n/a'
      },
      state: {
        isQuantVariant: !!stub.isForQuantComparer,
        isPureTextVariant: !!stub.pureText,
        isAxeSkewEnabled: false,
        istotalSkewEnabled: false
      }
    };
    return object;
  }

  public formSecurityTableRowObject(
    securityDTO: DTOs.SecurityDTO
  ): DTOs.SecurityTableRowDTO {
    const object: DTOs.SecurityTableRowDTO = {
      data: {
        security: securityDTO,
        cells: [],
        quotes: [],
        quoteHeaders: QuoteMetricList.map((eachQuoteMetricStub) => {
          const metricBlock: Blocks.QuoteMetricBlock = {
            displayLabelList: eachQuoteMetricStub.labelList,
            isSizeTwo: eachQuoteMetricStub.size === 2,
            isSizeThree: eachQuoteMetricStub.size === 3,
            isSizeFour: eachQuoteMetricStub.size === 4,
            sortable: !eachQuoteMetricStub.textOnly
          };
          return metricBlock;
        }),
        bestQuotes: {
          bestPriceQuote: null,
          bestSpreadQuote: null,
          bestYieldQuote: null
        }
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
    quantComparerDTO?: DTOs.QuantComparerDTO
  ): DTOs.SecurityTableCellDTO {
    const object: DTOs.SecurityTableCellDTO = {
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
    rawData: BEQuoteDTO,
    bestBidNum: number,
    bestAskNum: number,
    filteredMetricType: string
  ): DTOs.SecurityQuoteDTO {
    const hasBid = !isStencil ? (!!rawData.isActive && !!rawData.bidVenue) : true;
    const hasAsk = !isStencil ? (!!rawData.isActive && !!rawData.askVenue) : true;
    const bidBenchmark = !isStencil ? rawData.benchmarkName : 'T 0.5 01/01/2020';
    const askBenchmark = !isStencil ? rawData.benchmarkName : 'T 0.5 01/01/2020';
    const dataSource = !isStencil ? (hasBid ? rawData.bidVenue : rawData.askVenue) : 'PLACEHOLDER';
    const consolidatedBenchmark = bidBenchmark === askBenchmark ? bidBenchmark : null;
    let convertedDate: Date = null;
    if (!isStencil) {
      // stopped converting since BE is in EST now
      // TODO: clean up code
      convertedDate = new Date(rawData.time);
      // convertedDate = new Date(Date.UTC(convertBuffer.getFullYear(), convertBuffer.getMonth(), convertBuffer.getDate(), convertBuffer.getHours(), convertBuffer.getMinutes(), convertBuffer.getSeconds()));
    }
    // const quoteDate: Date = !isStencil ? (hasBid ? new Date(rawData.bidTime) : new Date(rawData.askTime)) : null;
    const object: DTOs.SecurityQuoteDTO = {
      data: {
        broker: !isStencil ? rawData.dealer : 'RBC',
        time: !isStencil ? `${convertedDate.toTimeString().slice(0, 5)}` : '12:01 pm',
        unixTimestamp: !isStencil ? convertedDate.getTime() : 0,
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
        },
        currentMetric: filteredMetricType
      },
      state: {
        isStencil: isStencil,
        hasBid: hasBid,
        hasAsk: hasAsk,
        diffBenchmark: bidBenchmark !== askBenchmark && hasBid && hasAsk,
        isBestOffer: false,
        isBestBid: false,
        filteredByPrice:  filteredMetricType === TriCoreMetricConfig.Price.label,
        filteredBySpread:  filteredMetricType === TriCoreMetricConfig.Spread.label,
        filteredByYield: filteredMetricType === TriCoreMetricConfig.Yield.label
      }
    };
    if (!isStencil) {
      object.data.bid = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.bidQuantity ? this.utility.parsePositionToMM(rawData.bidQuantity, false) : null,
        price: !!rawData.bidPrice ? this.utility.round(rawData.bidPrice , TriCoreMetricConfig.Price.rounding) : null,
        yield: !!rawData.bidYield ? this.utility.round(rawData.bidYield, TriCoreMetricConfig.Yield.rounding) : null,
        tspread: !!rawData.bidSpread ? this.utility.round(rawData.bidSpread, TriCoreMetricConfig.Spread.rounding) : null,
        benchmark: bidBenchmark
      };
      object.data.ask = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.askQuantity ? this.utility.parsePositionToMM(rawData.askQuantity, false) : null,
        price: !!rawData.askPrice ? this.utility.round(rawData.askPrice , TriCoreMetricConfig.Price.rounding) : null,
        yield: !!rawData.askYield ? this.utility.round(rawData.askYield, TriCoreMetricConfig.Yield.rounding) : null,
        tspread: !!rawData.askSpread ? this.utility.round(rawData.askSpread, TriCoreMetricConfig.Spread.rounding) : null,
        benchmark: askBenchmark
      };

      object.state.isBestBid = object.data.bid.tspread == bestBidNum || object.data.bid.price == bestBidNum || object.data.bid.yield == bestBidNum;

      object.state.isBestOffer =object.data.ask.tspread == bestAskNum || object.data.ask.price == bestAskNum || object.data.ask.yield == bestAskNum;
      
    }
    return object;
  }

  public formObligorChartCategoryDTO(
    isStencil: boolean,
    name: string,
    colorScheme: string,
    obligorCategoryDataItemDTO: Blocks.ObligorCategoryDataItemBlock[],
    isHidden
    ): Blocks.ObligorChartCategoryBlock
  {
    if(isStencil)
    {
      let obligorChartCategoryDTOStencil: Blocks.ObligorChartCategoryBlock = {
        data: {
          name: null,
          color: null,
          obligorCategoryDataItemDTO: [],
        },
        state: {
          isHidden: true,
          isMarkHidden: false
        }
      }
      return obligorChartCategoryDTOStencil;
    }
    else{
      return null;
    }
  }

  public formObligorCategoryDataItemDTO(isStencil: boolean): Blocks.ObligorCategoryDataItemBlock
  {
    if(isStencil) {
      let obligorCategoryDataDTO: Blocks.ObligorCategoryDataItemBlock = {
        data: {
          name,
          securityID: null,
          mark: null,
          spreadMid: null, 
          yieldMid: null,
          workoutTerm: null,
          CurrentPosition: null,
          CS01Local: null
        },
        state: {}
      }
      return obligorCategoryDataDTO;
    }
    else {
      return null;
    }
  }

  public formMoveVisualizerObject(
    isStencil: boolean,
    rawData?: BEHistoricalQuantBlock
  ): DTOs.MoveVisualizerDTO {
    if (isStencil || !rawData) {
      const stencilObject: DTOs.MoveVisualizerDTO = {
        data: {
          start: 0,
          end: 123,
          min: 0,
          max: 0
        },
        style: {
          leftGap: 10,
          leftEdge: 10,
          moveDistance: 60,
          rightEdge: 10,
          rightGap: 10
        },
        state: {
          isInversed: false
        }
      };
      return stencilObject;
    } else {
      const object: DTOs.MoveVisualizerDTO = {
        data: {
          start: this.utility.round(rawData.startMetric),
          end: this.utility.round(rawData.endMetric),
          min: this.utility.round(rawData.minMetric),
          max: this.utility.round(rawData.maxMetric)
        },
        style: {
          leftGap: 10,
          leftEdge: 10,
          moveDistance: 60,
          rightEdge: 10,
          rightGap: 10
        },
        state: {
          isInversed: rawData.startMetric > rawData.endMetric
        }
      }
      return object;
    }
  }

  public formHistoricalSummaryObject(
    rawData: BEHistoricalSummaryDTO,
    isLevel: boolean
  ): DTOs.HistoricalSummaryDTO {
    const object: DTOs.HistoricalSummaryDTO = {
      data: {
        list: [],
        globalMin: null,
        globalMax: null,
        globalDistance: null,
        centerPoint: null,
        rulerValue: null
      },
      style: {
        rulerPosition: 0
      },
      state: {
        isStencil: false
      }
    };
    if (rawData.BaseSecurity) {
      const baseDTO = this.formMoveVisualizerObject(false, rawData.BaseSecurity.historicalLevel);
      object.data.list.push(baseDTO);
    }
    if (rawData.Group) {
      const groupDTO = this.formMoveVisualizerObject(false, rawData.Group.historicalLevel);
      object.data.list.push(groupDTO);
      object.data.centerPoint = (groupDTO.data.max + groupDTO.data.min)/2;
      object.data.globalDistance = (groupDTO.data.max - groupDTO.data.min) * 10;
    }
    if (rawData.Top) {
      for (const eachSecurityIdentifier in rawData.Top) {
        const eachDTO = isLevel ? this.formMoveVisualizerObject(false, rawData.Top[eachSecurityIdentifier].historicalLevel) : this.formMoveVisualizerObject(false, rawData.Top[eachSecurityIdentifier].historicalBasis);
        object.data.list.push(eachDTO);
      }
    }
    if (rawData.Bottom) {
      for (const eachSecurityIdentifier in rawData.Bottom) {
        const eachDTO = isLevel ? this.formMoveVisualizerObject(false, rawData.Bottom[eachSecurityIdentifier].historicalLevel) : this.formMoveVisualizerObject(false, rawData.Bottom[eachSecurityIdentifier].historicalBasis);
        object.data.list.push(eachDTO);
      }
    }
    return object;
  }
}