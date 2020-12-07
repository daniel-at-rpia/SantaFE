  // dependencies
    import { Injectable, ElementRef } from '@angular/core';
    import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
    import * as moment from 'moment';

    import * as BEModels from 'BEModels/backend-models.interface';
    import * as DTOs from 'FEModels/frontend-models.interface';
    import * as Blocks from 'FEModels/frontend-blocks.interface';
    import { StructureOverrideToBreakdownConversionReturnPack } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      SecurityDefinitionStub,
      SecurityDefinitionBundleStub,
      SecurityTableHeaderConfigStub,
      SecurityMetricOptionStub
    } from 'FEModels/frontend-stub-models.interface';
    import { UtilityService } from './UtilityService';
    import {
      SecurityGroupRatingColorScheme,
      SecurityGroupSeniorityColorScheme
    } from 'Core/constants/colorSchemes.constant';
    import {
      TriCoreDriverConfig,
      DEFAULT_DRIVER_IDENTIFIER,
      AlertTypes,
      AlertSubTypes,
      ALERT_STATUS_SORTINGVALUE_UNIT,
      TRACE_VOLUME_REPORTED_THRESHOLD,
      NavigationModule
    } from 'Core/constants/coreConstants.constant';
    import {
      SECURITY_TABLE_QUOTE_TYPE_RUN,
      SECURITY_TABLE_QUOTE_TYPE_AXE,
      AGGRID_ROW_HEIGHT,
      AGGRID_ROW_HEIGHT_SLIM,
      AGGRID_PINNED_FULL_WIDTH_ROW_KEYWORD,
      traceTradeNumericalFilterSymbols,
      TRACE_SCATTER_GRAPH_ID,
      TRACE_PIE_GRAPH_LEFT_ID,
      TRACE_PIE_GRAPH_RIGHT_ID
    } from 'Core/constants/securityTableConstants.constant';
    import {
      GroupMetricOptions
    } from 'Core/constants/marketConstants.constant';
    import {
      ConfiguratorDefinitionLayout,
      FilterOptionsPortfolioList,
      SecurityDefinitionMap,
      FilterOptionsCurrency,
      FilterOptionsRating,
      FilterOptionsTenor,
      BICsLevel1DefinitionList,
      FilterTraceTradesOptions,
      DEFINITION_LONG_THRESHOLD
    } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      QuoteHeaderConfigList,
      TraceTradeCounterParty,
      TradeSideValueEquivalent
    } from 'Core/constants/securityTableConstants.constant';
    import {
      AxeAlertScope,
      AxeAlertType
    } from 'Core/constants/tradeConstants.constant';
    import { PortfolioShortNames, PortfolioMetricValues, PortfolioView, PortfolioBreakdownGroupOptions } from 'Core/constants/structureConstants.constants';
  //

@Injectable()
export class DTOService {
  constructor(
    private utility: UtilityService
  ){}

  public formSecurityCardObject(
    securityIdFull: string,
    rawData: BEModels.BESecurityDTO,
    isStencil: boolean,
    isSlimVariant: boolean,
    currentSelectedMetric?: string
  ): DTOs.SecurityDTO {
    // !isStencil && console.log('rawData', rawData.name, rawData);
    const object:DTOs.SecurityDTO = {
      data: null,
      api: {
        onClickCard: null,
        onClickSendToGraph: null,
        onClickSendToAlertConfig: null,
        onClickSearch: null,
        onClickPin: null
      },
      state: {
        isSelected: false,
        isStencil: isStencil,
        isInteractionDisabled: false,
        isMultiLineVariant: false,
        isWidthFlexible: false,
        isAtListCeiling: false,
        isActionMenuPrimaryActionsDisabled: false,
        isActionMenuMinorActionsDisabled: false,
        isSlimVariant: isSlimVariant,
        configAlertState: false,
        isTradeAlertTableVariant: false
      }
    };
    try {
      object.data = {
        securityID: !isStencil ? rawData.securityIdentifier : null,
        globalIdentifier: !isStencil ? rawData.globalIdentifier : null,
        name: !isStencil ? rawData.name : 'PLACEHOLDER',
        ticker: !isStencil ? rawData.ticker : null,
        obligorName: !isStencil ? rawData.obligorName : null,
        isGovt: !isStencil ? rawData.isGovt : false,
        ratingLevel: !isStencil && rawData.metrics && rawData.metrics.Default ? this.utility.mapRatings(rawData.metrics.Default.ratingNoNotch) : 0,
        ratingValue: !isStencil && rawData.metrics && rawData.metrics.Default ? rawData.metrics.Default.ratingNoNotch : null,
        ratingBucket: !isStencil && rawData.metrics && rawData.metrics.Default ? rawData.metrics.Default.ratingBucket : null,
        seniorityLevel: !isStencil ? this.utility.mapSeniorities(rawData.genericSeniority) : 5,
        currency: !isStencil ? rawData.ccy : null,
        country: !isStencil ? rawData.country : null,
        sector: !isStencil ? rawData.sector : null,
        industry: !isStencil ? rawData.industry : null,
        subIndustry: !isStencil ? rawData.subIndustry : null,
        securityType: !isStencil ? rawData.securityType : null,
        seniority: null,
        genericSeniority: !isStencil ? rawData.genericSeniority : null,
        maturityType: !isStencil ? rawData.maturityType : null,
        primaryPmName: !isStencil && !!rawData.unitPosition ? rawData.unitPosition.primaryPmName : null,
        backupPmName: !isStencil && !!rawData.unitPosition ? rawData.unitPosition.backupPmName : null,
        researchName: !isStencil && !!rawData.unitPosition ? rawData.unitPosition.researchName : null,
        cs01LocalFirm: null,
        cs01LocalFirmInK: null,
        cs01LocalCurrent: null,
        cs01LocalCurrentInK: null,
        cs01CadFirm: null,
        cs01CadFirmInK: null,
        cs01CadCurrent: null,
        cs01CadCurrentInK: null,
        owner: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.owners && rawData.unitPosition.owners.length > 0 ? rawData.unitPosition.owners : [],
        mark: {
          combinedDefaultMark: null,
          combinedDefaultMarkRaw: null,
          mark: null,
          markRaw: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.value : null,
          markBackend: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.value : null,
          markDriver: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.driver : null,
          markChangedBy: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.user : null,
          markChangedTime: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.enteredTime : null,
          markDisBid: null,
          markDisBidRaw: null,
          markDisAsk: null,
          markDisAskRaw: null,
          markDisMid: null,
          markDisMidRaw: null,
          markDisLiquidation: null,
          markDisLiquidationRaw: null,
          markDisIndex: null,
          markDisIndexRaw: null,
          priceRaw: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.price : null,
          spreadRaw: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark ? rawData.unitPosition.mark.spread : null,
          price: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark && rawData.unitPosition.mark.price ? rawData.unitPosition.mark.price.toFixed(2) : null,
          spread: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.mark && rawData.unitPosition.mark.spread ? rawData.unitPosition.mark.spread.toFixed(0) : null,
        },
        portfolios: [],
        strategyFirm: '',
        strategyList: !isStencil && !!rawData.unitPosition && !!rawData.unitPosition.partitionOptionValues ? rawData.unitPosition.partitionOptionValues.StrategyName : [],
        position: {
          positionCurrent: 0,
          positionCurrentInMM: 'n/a',
          positionFirm: 0,
          positionFirmInMM: 'n/a',
          positionHF: 0,
          positionHFInMM: 'n/a',
          positionNLF: 0,
          positionNLFInMM: 'n/a',
          positionDOF: 0,
          positionDOFInMM: null,
          positionSOF: 0,
          positionSOFInMM: null,
          positionSTIP: 0,
          positionSTIPInMM: null,
          positionFIP: 0,
          positionFIPInMM: null,
          positionCIP: 0,
          positionCIPInMM: null,
          positionAGB: 0,
          positionAGBInMM: null,
          positionBBB: 0,
          positionBBBInMM: null
        },
        cost: {
          current: {
            fifo: {
              'Default Spread': null,
              'Price': null
            },
            weightedAvg: {
              'Default Spread': null,
              'Price': null
            }
          },
          firm: {
            fifo: {
              'Default Spread': null,
              'Price': null
            },
            weightedAvg: {
              'Default Spread': null,
              'Price': null
            }
          },
          DOF: null,
          SOF: null,
          STIP: null,
          FIP: null,
          CIP: null,
          AGB: null,
          BBB: null
        },
        metricPack: this.utility.packMetricData(rawData),
        bestQuote: {
          bid: null,
          displayBid: null,
          ask: null,
          displayAsk: null
        },
        hasIndex: false,
        hedgeFactor: !isStencil && !!rawData.unitPosition ? rawData.unitPosition.hedgeFactor : null,
        alert: {
          alertId: null,
          alertTime: null,
          alertTimeRaw: null,
          alertType: null,
          alertMessage: null,
          alertValue: null,
          alertTarget: null,
          alertSide: null,
          alertLevel: null,
          alertLevelRaw: null,
          alertQuantity: null,
          alertQuantityRaw: null,
          alertQuoteDealer: null,
          alertTradeTrader: null,
          alertStatus: null,
          shortcutConfig: {
            numericFilterDTO: this.formNumericFilterObject(),
            driver: null,
            side: [],
            isUrgent: false,
            sendEmail: false
          }
        },
        tradeHistory: [],
        traceTrades: [],
        bics: {
          code: !isStencil ? rawData.bicsCode : null,
          bicsLevel1: !isStencil ? rawData.bicsLevel1 : null,
          bicsLevel2: !isStencil ? rawData.bicsLevel2 : null,
          bicsLevel3: !isStencil ? rawData.bicsLevel3 : null,
          bicsLevel4: !isStencil ? rawData.bicsLevel4 : null
        },
        lastTrace: {
          lastTracePrice: null,
          lastTraceSpread: null,
          lastTraceVolumeReported: null,
          lastTraceVolumeEstimated: null
        }
      }
      if (!isStencil) {
        // only show mark if the current selected metric is the mark's driver, unless the selected metric is default
        if ((!!currentSelectedMetric && !!TriCoreDriverConfig[object.data.mark.markDriver] && object.data.mark.markDriver === currentSelectedMetric) || currentSelectedMetric === DEFAULT_DRIVER_IDENTIFIER){
          let targetDriver = object.data.mark.markDriver;
          if (currentSelectedMetric === DEFAULT_DRIVER_IDENTIFIER) {
            targetDriver = this.utility.findSecurityTargetDefaultTriCoreDriver(object);
          }
          object.data.mark.mark = this.utility.parseTriCoreDriverNumber(object.data.mark.markRaw, targetDriver, object, true) as string;
        } else {
          object.data.mark.mark = null;
          object.data.mark.markRaw = null;
        }
        if (object.data.seniorityLevel < 5 && object.data.seniorityLevel > 0 && rawData.paymentRank) {
          object.data.seniority = `${object.data.seniorityLevel} - ${rawData.paymentRank}`;
        }
        if (!!object.data.strategyList && object.data.strategyList.length > 0) {
          object.data.strategyList.forEach((eachStrategy: string, index) => {
            if (index === 0) {
              object.data.strategyFirm = eachStrategy;
            } else {
              object.data.strategyFirm = `${object.data.strategyFirm} & ${eachStrategy}`;
            }
          });
        }
        if (object.data.mark.markDriver === TriCoreDriverConfig.Spread.label || object.data.mark.markDriver === TriCoreDriverConfig.Price.label) {
          object.data.alert.shortcutConfig.driver = object.data.mark.markDriver;
        }
        object.data.hasIndex = rawData.ccy === 'CAD' ? !!rawData.metrics.FTSE : !!rawData.metrics.BB;
      }
    } catch (err) {
      console.warn('Data issue on security', object, err);
    }
    return object;
  }

  public appendPortfolioInfoToSecurityDTO(
    dto: DTOs.SecurityDTO,
    targetPortfolio: BEModels.BEPortfolioDTO
  ) {
    const lastTrade = !!targetPortfolio.trades && targetPortfolio.trades.length > 0 ? targetPortfolio.trades[targetPortfolio.trades.length-1] : null;
    const newBlock: Blocks.SecurityPortfolioBlock = {
      portfolioName: targetPortfolio.partitionOptionValues.PortfolioShortName,
      quantity: targetPortfolio.quantity,
      strategy: targetPortfolio.partitionOptionValues.StrategyName,
      cs01Cad: targetPortfolio.cs01Cad,
      cs01Local: targetPortfolio.cs01Local,
      costFifoSpread: null,
      costFifoPrice: null,
      costWeightedAvgSpread: !!lastTrade ? lastTrade.wgtAvgSpread : null,
      costWeightedAvgPrice: !!lastTrade ? lastTrade.wgtAvgPrice : null
    };
    newBlock.costFifoSpread = this.utility.parseTriCoreDriverNumber(
      newBlock.costFifoSpread,
      TriCoreDriverConfig.Spread.label,
      dto,
      false
    ) as number;
    newBlock.costFifoPrice = this.utility.parseTriCoreDriverNumber(
      newBlock.costFifoPrice,
      TriCoreDriverConfig.Price.label,
      dto,
      false
    ) as number;
    newBlock.costWeightedAvgSpread = this.utility.parseTriCoreDriverNumber(
      newBlock.costWeightedAvgSpread,
      TriCoreDriverConfig.Spread.label,
      dto,
      false
    ) as number;
    newBlock.costWeightedAvgPrice = this.utility.parseTriCoreDriverNumber(
      newBlock.costWeightedAvgPrice,
      TriCoreDriverConfig.Price.label,
      dto,
      false
    ) as number;
    dto.data.portfolios.push(newBlock);
    const newCostPortfolioBlock: Blocks.SecurityCostPortfolioBlock = {
      fifo: {
        'Default Spread': newBlock.costFifoSpread,
        'Price': newBlock.costFifoPrice
      },
      weightedAvg: {
        'Default Spread': newBlock.costWeightedAvgSpread,
        'Price': newBlock.costWeightedAvgPrice
      }
    };
    dto.data.cost[newBlock.portfolioName] = newCostPortfolioBlock;
    targetPortfolio.trades.forEach((eachRawTrade) => {
      if (eachRawTrade.counterpartyName !== 'DUMMY CORPORATE ACTION') {
        // just a hacky filter to avoid a BE fix
        dto.data.tradeHistory.push(this.formTradeObject(eachRawTrade, dto));
      }
    });
  }

  public appendPortfolioOverviewInfoForSecurityDTO(
    dto: DTOs.SecurityDTO
  ) {
    const block = dto.data.position;
    dto.data.portfolios.forEach((eachPortfolioBlock) => {
      switch (eachPortfolioBlock.portfolioName) {
        case "DOF":
          block.positionDOF = block.positionDOF + eachPortfolioBlock.quantity;
          block.positionHF = block.positionHF + eachPortfolioBlock.quantity;
          break;
        case "SOF":
          block.positionSOF = block.positionSOF + eachPortfolioBlock.quantity;
          block.positionHF = block.positionHF + eachPortfolioBlock.quantity;
          break;
        case "STIP":
          block.positionSTIP = block.positionSTIP + eachPortfolioBlock.quantity;
          block.positionNLF = block.positionNLF + eachPortfolioBlock.quantity;
          break;
        case "FIP":
          block.positionFIP = block.positionFIP + eachPortfolioBlock.quantity;
          block.positionNLF = block.positionNLF + eachPortfolioBlock.quantity;
          break;
        case "CIP":
          block.positionCIP = block.positionCIP + eachPortfolioBlock.quantity;
          block.positionNLF = block.positionNLF + eachPortfolioBlock.quantity;
          break;
        case "AGB":
          block.positionAGB = block.positionAGB + eachPortfolioBlock.quantity;
          block.positionNLF = block.positionNLF + eachPortfolioBlock.quantity;
          break;
        case "BBB":
          block.positionBBB = block.positionBBB + eachPortfolioBlock.quantity;
          block.positionNLF = block.positionNLF + eachPortfolioBlock.quantity;
          break;
        default:
          // code...
          break;
      }
      block.positionFirm = block.positionFirm + eachPortfolioBlock.quantity;
      dto.data.cost.firm.fifo['Default Spread'] = dto.data.cost.firm.fifo['Default Spread'] + eachPortfolioBlock.costFifoSpread;
      dto.data.cost.firm.fifo.Price = dto.data.cost.firm.fifo.Price + eachPortfolioBlock.costFifoPrice;
      dto.data.cost.firm.weightedAvg['Default Spread'] = dto.data.cost.firm.weightedAvg['Default Spread'] + eachPortfolioBlock.costWeightedAvgSpread;
      dto.data.cost.firm.weightedAvg.Price = dto.data.cost.firm.weightedAvg.Price + eachPortfolioBlock.costWeightedAvgPrice;
      dto.data.cs01CadFirm = dto.data.cs01CadFirm + eachPortfolioBlock.cs01Cad;
      dto.data.cs01LocalFirm = dto.data.cs01LocalFirm + eachPortfolioBlock.cs01Local;
    });
    block.positionDOFInMM = this.utility.parsePositionToMM(block.positionDOF, false, true);
    block.positionSOFInMM = this.utility.parsePositionToMM(block.positionSOF, false, true);
    block.positionSTIPInMM = this.utility.parsePositionToMM(block.positionSTIP, false, true);
    block.positionFIPInMM = this.utility.parsePositionToMM(block.positionFIP, false, true);
    block.positionCIPInMM = this.utility.parsePositionToMM(block.positionCIP, false, true);
    block.positionAGBInMM = this.utility.parsePositionToMM(block.positionAGB, false, true);
    block.positionBBBInMM = this.utility.parsePositionToMM(block.positionBBB, false, true);
    block.positionFirmInMM = this.utility.parsePositionToMM(block.positionFirm, false, true);
    block.positionHFInMM = this.utility.parsePositionToMM(block.positionHF, false, true);
    block.positionNLFInMM = this.utility.parsePositionToMM(block.positionNLF, false, true);
    dto.data.cs01CadFirmInK = this.utility.parseNumberToThousands(dto.data.cs01CadFirm, false);
    dto.data.cs01LocalFirmInK = this.utility.parseNumberToThousands(dto.data.cs01LocalFirm, false);
  }

  public appendLastTraceInfoToSecurityDTO(dto: DTOs.SecurityDTO, rawData: BEModels.BEFullSecurityDTO) {
    dto.data.lastTrace.lastTracePrice = rawData.lastTracePrice;
    dto.data.lastTrace.lastTraceSpread = rawData.lastTraceSpread;
    dto.data.lastTrace.lastTraceVolumeEstimated = !!rawData.lastTraceVolumeEstimated ? this.utility.round(rawData.lastTraceVolumeEstimated /TRACE_VOLUME_REPORTED_THRESHOLD, 2) : null;
    dto.data.lastTrace.lastTraceVolumeReported = !!rawData.lastTraceVolumeReported ? this.utility.round(rawData.lastTraceVolumeReported /TRACE_VOLUME_REPORTED_THRESHOLD, 2).toFixed(2) : null;
  }

  public appendAlertInfoToSecurityDTO(
    dto: DTOs.SecurityDTO,
    targetAlert: DTOs.AlertDTO
  ) {
    dto.data.alert = {
      alertId: targetAlert.data.id,
      alertTime: targetAlert.data.time,
      alertTimeRaw: targetAlert.data.unixTimestamp,
      alertType: !!targetAlert.data.titlePin ? `${targetAlert.data.type} - ${targetAlert.data.titlePin}` : targetAlert.data.type,
      alertMessage: targetAlert.data.message,
      alertValue: targetAlert.data.titleBottom,
      alertTarget: targetAlert.data.titleTop,
      alertSide: null,
      alertLevel: this.utility.parseTriCoreDriverNumber(targetAlert.data.level, dto.data.mark.markDriver, dto, true) as string,
      alertQuantity: this.utility.parsePositionToMM(targetAlert.data.quantity, false, true),
      alertLevelRaw: targetAlert.data.level,
      alertQuantityRaw: targetAlert.data.quantity,
      alertQuoteDealer: targetAlert.data.dealer,
      alertTradeTrader: targetAlert.data.trader,
      alertStatus: targetAlert.data.status,
      shortcutConfig: dto.data.alert.shortcutConfig,
      alertTraceCounterParty: targetAlert.data.traceCounterParty,
      alertTraceVolumeEstimated: targetAlert.data.traceVolumeEstimated,
      alertTraceVolumeReported: targetAlert.data.traceVolumeReported,
      alertTracePrice: targetAlert.data.tracePrice,
      alertTraceSpread: targetAlert.data.traceSpread
    };
  }

  public formSecurityGroupObject(
    rawData: BEModels.BESecurityGroupDTO
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
    name: string,
    options: Array<string>,
    bicsLevel?: number
  ): Array<Blocks.SecurityDefinitionFilterBlock> {
    return options.map((eachOption) => {
      const normalizedOption = this.utility.normalizeDefinitionFilterOption(eachOption);
      const newFilterDTO: Blocks.SecurityDefinitionFilterBlock = {
        isSelected: false,
        isFilteredOut: false,
        displayLabel: !!bicsLevel ? `Lv.${bicsLevel} ${eachOption}` : eachOption,
        bicsLevel: bicsLevel || null,
        shortKey: normalizedOption,
        key: `${this.utility.formDefinitionFilterOptionKey(name, normalizedOption)}~${bicsLevel}`
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
        displayName: rawData.displayName,
        key: rawData.key,
        urlForGetLongOptionListFromServer: rawData.urlForGetLongOptionListFromServer || null,
        prinstineFilterOptionList: this.generateSecurityDefinitionFilterOptionList(rawData.key, rawData.optionList),
        filterOptionList: this.generateSecurityDefinitionFilterOptionList(rawData.key, rawData.optionList),
        securityDTOAttr: rawData.securityDTOAttr,
        securityDTOAttrBlock: rawData.securityDTOAttrBlock,
        highlightSelectedOptionList: []
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
        filterActive: false,
        isMiniPillVariant: false,
        isFilterLong: rawData.optionList.length > 5,
        currentFilterPathInConsolidatedBICS: []
      }
    }
    return object;
  }

  public loadSecurityDefinitionOptions(
    targetDefinition: DTOs.SecurityDefinitionDTO,
    optionList: Array<string>,
    bicsLevel?: number
  ): DTOs.SecurityDefinitionDTO {
    targetDefinition.data.prinstineFilterOptionList = this.generateSecurityDefinitionFilterOptionList(targetDefinition.data.key, optionList, bicsLevel);
    targetDefinition.data.filterOptionList = this.generateSecurityDefinitionFilterOptionList(targetDefinition.data.key, optionList, bicsLevel);
    targetDefinition.state.isFilterLong = optionList.length > DEFINITION_LONG_THRESHOLD;
    return targetDefinition;
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
    groupByDisabled: boolean,
    noMainCTA: boolean,
    securityAttrOnly: boolean,
    definitionLayoutMap: Array<SecurityDefinitionBundleStub> = ConfiguratorDefinitionLayout
  ): DTOs.SecurityDefinitionConfiguratorDTO {
    const object: DTOs.SecurityDefinitionConfiguratorDTO = {
      data: {
        filterSearchInputValue: '',
        definitionList: definitionLayoutMap.map((eachBundle) => {
          const newList = this.formSecurityDefinitionBundleObject(eachBundle);
          newList.data.list.forEach((eachDefinition) => {
            eachDefinition.state.isMiniPillVariant = true;
          });
          return newList;
        })
      },
      state: {
        groupByDisabled: !!groupByDisabled,
        canApplyFilter: false,
        showFiltersFromDefinition: null,
        isLoading: false,
        noMainCTA: !!noMainCTA,
        securityAttrOnly: securityAttrOnly
      }
    };
    return object;
  }

  public loadBICSOptionsIntoConfigurator(
    configuratorDTO: DTOs.SecurityDefinitionConfiguratorDTO,
    sortedLevel1List: Array<string>,
    sortedLevel2List: Array<string>,
    sortedLevel3List: Array<string>,
    sortedLevel4List: Array<string>
  ) {
    configuratorDTO.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        if (eachDefinition.data.key === SecurityDefinitionMap.BICS_CONSOLIDATED.key) {
          this.loadSecurityDefinitionOptions(eachDefinition, sortedLevel1List, 1);
        }
        if (eachDefinition.data.key === SecurityDefinitionMap.BICS_LEVEL_1.key) {
          this.loadSecurityDefinitionOptions(eachDefinition, sortedLevel1List);
        } else if (eachDefinition.data.key === SecurityDefinitionMap.BICS_LEVEL_2.key) {
          this.loadSecurityDefinitionOptions(eachDefinition, sortedLevel2List);
        } else if (eachDefinition.data.key === SecurityDefinitionMap.BICS_LEVEL_3.key) {
          this.loadSecurityDefinitionOptions(eachDefinition, sortedLevel3List);
        } else if (eachDefinition.data.key === SecurityDefinitionMap.BICS_LEVEL_4.key) {
          this.loadSecurityDefinitionOptions(eachDefinition, sortedLevel4List);
        }
      });
    });
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
    isMajor: boolean,
    isHero: boolean
  ): DTOs.SearchShortcutDTO {
    const object: DTOs.SearchShortcutDTO = {
      data: {
        displayTitle: title,
        configuration: definitionList
      },
      style: {
        slotList: [null, null, null, null, null]
      },
      state: {
        isSelected: false,
        isUserInputBlocked: false,
        isMajorShortcut: !!isMajor,
        isHeroShortcut: !!isHero
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

  public formBestQuoteComparerObject(
    isStencil: boolean,
    quantMetricType: string,
    BEdto: BEModels.BEBestQuoteDTO,
    securityCard: DTOs.SecurityDTO,
    axeOnly: boolean
  ): DTOs.BestQuoteComparerDTO {
    if (isStencil) {
      const stencilObject: DTOs.BestQuoteComparerDTO = {
        data: {
          driverType: 'Spread',
          delta: 0,
          mid: 0,
          bid: {
            number: 33,
            displayNumber: '33',
            broker: 'GS',
            size: null,
            isExecutable: false
          },
          offer: {
            number: 33,
            displayNumber: '33',
            broker: 'JPM',
            size: null,
            isExecutable: false
          }
        },
        style: {
          lineWidth: 80,
          bidLineHeight: 30,
          offerLineHeight: 30,
          axeSkew: 50,
          totalSkew: 50
        },
        state: {
          hasBid: true,
          hasOffer: true,
          isStencil: isStencil,
          isCalculated: false,
          isCrossed: false,
          isCrossedTier2: false,
          axeSkewEnabled: false,
          totalSkewEnabled: false,
          noAxeSkew: true,
          noTotalSkew: true,
          longEdgeState: false,
          bidIsStale: false,
          askIsStale: false,
          hasExecutableQuote: false
        }
      };
      return stencilObject;
    } else {
      const driverType = quantMetricType;
      const backendTargetQuoteAttr = TriCoreDriverConfig[driverType]['backendTargetQuoteAttr'];
      if (!!BEdto && !!BEdto[backendTargetQuoteAttr]) {
        const rawData = BEdto[backendTargetQuoteAttr];
        return this.populateBestQuoteComparerObject(
          rawData,
          driverType,
          securityCard,
          axeOnly
        );
      } else {
        return null;
      }
    }
  }

  private populateBestQuoteComparerObject(
    rawData: BEModels.BESingleBestQuoteDTO,
    driverType: string,
    securityCard: DTOs.SecurityDTO,
    axeOnly: boolean
  ): DTOs.BestQuoteComparerDTO {
    const bidQuantity = axeOnly ? rawData.totalActiveAxeBidQuantity : rawData.totalActiveBidQuantity;
    const askQuantity = axeOnly ? rawData.totalActiveAxeAskQuantity : rawData.totalActiveAskQuantity;
    const bidValue = axeOnly ? rawData.bidAxeQuoteValue : rawData.bidQuoteValue;
    const askValue = axeOnly ? rawData.askAxeQuoteValue : rawData.askQuoteValue;
    const bidDealer = axeOnly ? rawData.bidAxeDealer : rawData.bidDealer;
    const askDealer = axeOnly ? rawData.askAxeDealer : rawData.askDealer;
    const bidIsStale = axeOnly ? rawData.bidAxeIsOld : rawData.bidIsOld;
    const askIsStale = axeOnly ? rawData.askAxeIsOld : rawData.askIsOld;

    const bidSize = bidQuantity != null ? this.utility.round(bidQuantity/1000000, 1) : 0;
    const offerSize = askQuantity != null ? this.utility.round(askQuantity/1000000, 1) : 0;
    const tier2Shreshold = TriCoreDriverConfig[driverType]['tier2Threshold'];
    const inversed = this.utility.isCDS(false, securityCard) ? !TriCoreDriverConfig[driverType]['inversed'] : TriCoreDriverConfig[driverType]['inversed'];
    const hasBid = !!bidValue && !!bidDealer;
    const hasOffer = !!askValue && !!askDealer;
    const rounding = TriCoreDriverConfig[driverType]['rounding'];
    const bidNumber = this.utility.parseTriCoreDriverNumber(bidValue, driverType, securityCard, true) as string;
    const offerNumber = this.utility.parseTriCoreDriverNumber(askValue, driverType, securityCard, true) as string;
    const bidSkew = rawData.axeSkew * 100;
    if (bidNumber === 'NaN' || offerNumber === 'NaN') {
      console.warn('Caught BE data issue while creating best quote component, ', securityCard, rawData, bidNumber, offerNumber);
      return null;
    } else {
      let delta;
      let mid;
      if (hasBid && hasOffer) {
        delta = inversed ? parseFloat(offerNumber) - parseFloat(bidNumber) : parseFloat(bidNumber) - parseFloat(offerNumber);
        delta = this.utility.round(delta, rounding);
        mid = (bidValue + askValue)/2;
        mid = this.utility.round(mid, rounding);
      } else if( hasBid && hasOffer == false) {
        delta = 0;
        mid = bidValue;
      } else if( hasOffer && hasBid == false) {
        delta = 0;
        mid = askValue;
      } else {
        delta = 0;
        mid = 0;
      }
      const object: DTOs.BestQuoteComparerDTO = {
        data: {
          driverType: driverType,
          delta: delta,
          mid: mid,
          bid: {
            number: !!bidNumber ? parseFloat(bidNumber) : null,
            displayNumber: bidNumber,  // not been used right now but could come in handy
            broker: bidDealer,
            size: bidSize,
            isExecutable: rawData.bestBidQuoteCondition === 'A'
          },
          offer: {
            number: !!offerNumber ? parseFloat(offerNumber) : null,
            displayNumber: offerNumber,  // not been used right now but could come in handy
            broker: askDealer,
            size: offerSize,
            isExecutable: rawData.bestAskQuoteCondition === 'A'
          }
        },
        style: {
          lineWidth: 80,
          bidLineHeight: 30,
          offerLineHeight: 30,
          axeSkew: rawData.axeSkew * 100,
          totalSkew: rawData.totalSkew * 100
        },
        state: {
          hasBid: hasBid,
          hasOffer: hasOffer,
          isStencil: false,
          isCalculated: false,
          isCrossed: delta < 0,
          isCrossedTier2: delta <= -tier2Shreshold,
          axeSkewEnabled: false,
          totalSkewEnabled: false,
          noAxeSkew: rawData.axeSkew === null,
          noTotalSkew: rawData.totalSkew === null,
          longEdgeState: (bidNumber && parseFloat(bidNumber).toString().length > 4) || (offerNumber && parseFloat(offerNumber).toString().length > 4),
          bidIsStale: bidIsStale,
          askIsStale: askIsStale,
          hasExecutableQuote: rawData.bestAskQuoteCondition === 'A' || rawData.bestBidQuoteCondition === 'A'
        }
      };
      return object;
    }
  }

  public formSecurityTableObject(
    isLiveVariant: boolean,
    isGroupEnabled: boolean
  ): DTOs.SecurityTableDTO {
    const object: DTOs.SecurityTableDTO = {
      data: {
        headers: [],
        allHeaders: [],
        rows: [],
        agGridColumnDefs: [],
        agGridRowData: [],
        agGridFrameworkComponents: {},
        agGridAggregationMap: {},
        agGridPinnedTopRowData: []
      },
      state: {
        loadedContentStage: null,
        isAddingColumn: false,
        selectedHeader: null,
        sortedByHeader: null,
        isLiveVariant: isLiveVariant,
        isAgGridReady: false,
        isNativeEnabled: false,
        selectedSecurityCard: null,
        isActivated: false,
        isGroupEnabled: isGroupEnabled
      },
      api: {
        gridApi: null,
        columnApi: null
      }
    };
    return object;
  }

  public formSecurityTableHeaderObject(
    stub: SecurityTableHeaderConfigStub,
    useSpecificsFrom: string,
    activePortfolios: Array<string>
  ): DTOs.SecurityTableHeaderDTO {
    const object: DTOs.SecurityTableHeaderDTO = {
      data: {
        key: stub.key,
        displayLabel: stub.content.label,
        attrName: stub.content.attrName,
        underlineAttrName: stub.content.underlineAttrName,
        blockAttrName: stub.content.blockAttrName || null,
        isAttrChangable: !!stub.content.isAttrChangable,
        readyStage: stub.content.readyStage,
        metricPackDeltaScope: stub.content.metricPackDeltaScope || null,
        frontendMetric: !!stub.content.isFrontEndMetric,
        isDataTypeText: !!stub.content.isDataTypeText,
        isDriverDependent: !!stub.content.isDriverDependent,
        groupBelongs: stub.content.groupBelongs,
        pinned: (useSpecificsFrom && stub.content.tableSpecifics[useSpecificsFrom]) ? !!stub.content.tableSpecifics[useSpecificsFrom].pinned : !!stub.content.tableSpecifics.default.pinned,
        groupShow: (useSpecificsFrom && stub.content.tableSpecifics[useSpecificsFrom]) ? !!stub.content.tableSpecifics[useSpecificsFrom].groupShow : !!stub.content.tableSpecifics.default.groupShow,
        activePortfolios: activePortfolios || []
      },
      state: {
        isBestQuoteVariant: !!stub.content.isForBestQuoteComparer,
        isSecurityCardVariant: !!stub.content.isForSecurityCard,
        isCustomComponent: !!stub.content.isCustomComponent,
        isAxeSkewEnabled: false,
        istotalSkewEnabled: false,
        isNarrowColumnVariant: !!stub.content.isColumnWidthNarrow
      }
    };
    return object;
  }

  public formSecurityTableRowObject(
    securityDTO: DTOs.SecurityDTO,
    alert: DTOs.AlertDTO,
    isSlimRowHeight: boolean,
    id?: string
  ): DTOs.SecurityTableRowDTO {
    const object: DTOs.SecurityTableRowDTO = {
      data: {
        rowId: !!id ? id : this.utility.generateUUID(),
        security: securityDTO,
        cells: [],
        quotes: {
          primaryPresentQuotes: [],
          primaryQuotes: [],
          primarySecurityName: '',
          secondaryPresentQuotes: [],
          secondaryQuotes: [],
          secondarySecurityName: ''
        },
        quoteHeaders: QuoteHeaderConfigList.map((eachQuoteMetricStub) => {
          const metricBlock: Blocks.QuoteMetricBlock = {
            displayLabelList: eachQuoteMetricStub.labelList,
            isSizeTwo: eachQuoteMetricStub.size === 2,
            isSizeThree: eachQuoteMetricStub.size === 3,
            isSizeFour: eachQuoteMetricStub.size === 4,
            sortable: !eachQuoteMetricStub.textOnly,
            isNonCDS: !!eachQuoteMetricStub.isNonCDS
          };
          return metricBlock;
        }),
        bestQuotes: {
          combined: {
            bestPriceQuote: null,
            bestSpreadQuote: null,
            bestYieldQuote: null
          },
          axe: {
            bestSpreadQuote: null,
            bestPriceQuote: null,
            bestYieldQuote: null
          }
        },
        alert: alert,
        historicalTradeVisualizer: this.formHistoricalTradeObject(securityDTO),
        traceTradeVisualizer: null
      },
      style: {
        rowHeight: !!isSlimRowHeight ? AGGRID_ROW_HEIGHT_SLIM : AGGRID_ROW_HEIGHT
      },
      state: {
        expandViewSortByQuoteMetric: null,
        isExpanded: false,
        presentingAllQuotes: false,
        isCDSVariant: this.utility.isCDS(false, securityDTO),
        isCDSOffTheRun: false,
        viewHistoryState: false,
        viewTraceState: false,
        quotesLoaded: false,
        isAgGridFullSizeVariant: false
      }
    };
    return object;
  }

  public formSecurityTableCellObject(
    isStencil: boolean,
    textData: string,
    targetHeader: DTOs.SecurityTableHeaderDTO,
    bestQuoteComparerDTO: DTOs.BestQuoteComparerDTO,
    alertDTO: DTOs.AlertDTO
  ): DTOs.SecurityTableCellDTO {
    const object: DTOs.SecurityTableCellDTO = {
      data: {
        textData: !!isStencil ? 'PLACE' : textData,
        bestQuoteComparerDTO: bestQuoteComparerDTO,
        alertSideDTO: null,
        alertStatusDTO: null
      },
      state: {
        isBestQuoteVariant: targetHeader.state.isBestQuoteVariant,
        bestQuoteComparerUnavail: false,
        isStencil: isStencil
      }
    };
    if (alertDTO) {
      if (targetHeader.data.key === 'alertSide') {
        // TODO: instead of hand-curate it, use a function
        object.data.alertSideDTO = {
          data: {
            side: 'None'
          },
          state: {
            isStencil: false,
            askSided: false,
            bidSided: false
          }
        };
        if (alertDTO.state.isMarketListVariant) {
          if (alertDTO.data.subType === AlertSubTypes.ask) {
            object.data.alertSideDTO.data.side = 'BWIC';
            object.data.alertSideDTO.state.askSided = true;
          } else if (alertDTO.data.subType === AlertSubTypes.bid) {
            object.data.alertSideDTO.data.side = 'OWIC';
            object.data.alertSideDTO.state.bidSided = true;
          }
        } else if (alertDTO.data.subType === AlertSubTypes.bid) {
          object.data.alertSideDTO.data.side = 'Bid';
          object.data.alertSideDTO.state.bidSided = true;
        } else if (alertDTO.data.subType === AlertSubTypes.ask) {
          object.data.alertSideDTO.data.side = 'Ask';
          object.data.alertSideDTO.state.askSided = true;
        } else if (alertDTO.data.subType === AlertSubTypes.sell) {
          object.data.alertSideDTO.data.side = 'Sell';
          object.data.alertSideDTO.state.askSided = true;
        } else if (alertDTO.data.subType === AlertSubTypes.buy) {
          object.data.alertSideDTO.data.side = 'Buy';
          object.data.alertSideDTO.state.bidSided = true;
        }
      }
      if (targetHeader.data.key === 'alertStatus') {
        object.data.alertStatusDTO = this.formSecurityTableAlertStatusCellObject(alertDTO);
      }
    }
    return object;
  }

  public formSecurityQuoteObject(
    isStencil: boolean,
    rawData: BEModels.BEQuoteDTO,
    targetSecurity: DTOs.SecurityDTO,
    targetRow: DTOs.SecurityTableRowDTO
  ): DTOs.SecurityQuoteDTO {
    const hasBid = !isStencil ? (!!rawData.bidVenues && rawData.bidVenues.length > 0) : true;
    const hasAsk = !isStencil ? (!!rawData.askVenues && rawData.askVenues.length > 0) : true;
    const bidBenchmark = !isStencil ? rawData.benchmarkName : 'T 0.5 01/01/2020';
    const askBenchmark = !isStencil ? rawData.benchmarkName : 'T 0.5 01/01/2020';
    let dataSource = 'PLACEHOLDER';
    const dataSources = [];
    if (!isStencil) {
      rawData.bidVenues.forEach((eachSource) => {
        !dataSources.includes(eachSource) && dataSources.push(eachSource);
      });
      rawData.askVenues.forEach((eachSource) => {
        !dataSources.includes(eachSource) && dataSources.push(eachSource);
      });
      if (dataSources.length > 0) {
        dataSource = dataSources.length > 1 ? 'MULT' : dataSources[0];
      } else {
        dataSource = 'n/a';
      }
    }
    const consolidatedBenchmark = bidBenchmark === askBenchmark ? bidBenchmark : null;
    let convertedDate: moment.Moment = !isStencil ? moment(rawData.time) : null;
    const object: DTOs.SecurityQuoteDTO = {
      data: {
        uuid: this.utility.generateUUID(),
        broker: !isStencil ? rawData.dealer : 'RBC',
        time: !isStencil ? convertedDate.format('HH:mm') : '12:01',
        unixTimestamp: !isStencil ? convertedDate.unix() : 0,
        dataSource: dataSource,
        consolidatedBenchmark: consolidatedBenchmark,
        bid: {
          isAxe: false,
          size: '150',
          price: 100,
          yield: 5,
          tspread: 300,
          benchmark: bidBenchmark,
          time: '12:01',
          rawTime: '',
          isExecutable: false
        },
        ask: {
          isAxe: false,
          size: '150',
          price: 100,
          yield: 5,
          tspread: 300,
          benchmark: bidBenchmark,
          time: '12:01',
          rawTime: '',
          isExecutable: false
        },
        currentMetric: null
      },
      state: {
        isStencil: isStencil,
        hasBid: hasBid,
        hasAsk: hasAsk,
        diffBenchmark: bidBenchmark !== askBenchmark && hasBid && hasAsk,
        isBestOffer: false,
        isBestBid: false,
        isBestAxeOffer: false,
        isBestAxeBid: false,
        filteredByPrice: false,
        filteredBySpread: false,
        filteredByYield: false,
        menuActiveSide: null,
        menuActiveDriver: null,
        isBidDownVoted: false,
        isAskDownVoted: false,
        isCDSVariant: false,
        isQuoteExecutable: false
      }
    };
    if (!isStencil) {
      object.data.bid = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.bidQuantity ? this.utility.parsePositionToMM(rawData.bidQuantity, false) : null,
        price: !!rawData.bidPrice ? this.utility.parseTriCoreDriverNumber(rawData.bidPrice, TriCoreDriverConfig.Price.label, targetSecurity, false) as number : null,
        yield: !!rawData.bidYield ? this.utility.parseTriCoreDriverNumber(rawData.bidYield, TriCoreDriverConfig.Yield.label, targetSecurity, false) as number : null,
        tspread: !!rawData.bidSpread ? this.utility.parseTriCoreDriverNumber(rawData.bidSpread, TriCoreDriverConfig.Spread.label, targetSecurity, false) as number : null,
        benchmark: bidBenchmark,
        time: this.utility.isQuoteTimeValid(rawData.bidTime) && hasBid ? moment(rawData.bidTime).format('HH:mm') : '',
        rawTime: rawData.bidTime.slice(0, 19),  // remove timezone,
        isExecutable: rawData.bidQuoteCondition === 'A'
      };
      object.data.ask = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.askQuantity ? this.utility.parsePositionToMM(rawData.askQuantity, false) : null,
        price: !!rawData.askPrice ? this.utility.parseTriCoreDriverNumber(rawData.askPrice, TriCoreDriverConfig.Price.label, targetSecurity, false) as number : null,
        yield: !!rawData.askYield ? this.utility.parseTriCoreDriverNumber(rawData.askYield, TriCoreDriverConfig.Yield.label, targetSecurity, false) as number : null,
        tspread: !!rawData.askSpread ? this.utility.parseTriCoreDriverNumber(rawData.askSpread, TriCoreDriverConfig.Spread.label, targetSecurity, false) as number : null,
        benchmark: askBenchmark,
        time: this.utility.isQuoteTimeValid(rawData.askTime) && hasAsk ? moment(rawData.askTime).format('HH:mm') : '',
        rawTime: rawData.askTime.slice(0, 19),  // remove timezone
        isExecutable: rawData.askQuoteCondition === 'A'
      };
      this.utility.highlightSecurityQutoe(object, targetRow);
      object.state.isBidDownVoted = rawData.bidQuoteStatus < 0;
      object.state.isAskDownVoted = rawData.askQuoteStatus < 0;
      object.state.isQuoteExecutable = object.data.ask.isExecutable || object.data.bid.isExecutable;
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

  public formMoveVisualizerObject(
    isStencil: boolean,
    rawData: BEModels.BEHistoricalQuantBlock,
    colorCodeInversed: boolean,
    identifier?: string
  ): DTOs.MoveVisualizerDTO {
    const object: DTOs.MoveVisualizerDTO = {
      data: {
        identifier: '',
        start: 0,
        end: 123,
        min: 0,
        max: 0,
        isBasis: false,
        timeSeries: [],
        endPinText: '123'
      },
      style: {
        leftGap: 10,
        leftEdge: 20,
        moveDistance: 40,
        rightEdge: 20,
        rightGap: 10,
        endPinLocation: 70,
        backgroundColor: '#ffffff'
      },
      state: {
        isInversed: false,
        isInvalid: false,
        isPlaceholder: false,
        isStencil: !!isStencil,
        isColorCodeInversed: false,
        structuringBreakdownVariant: false,
        structuringBreakdownExceededState: false
      }
    };
    if (!isStencil) {
      if (rawData != null) {
        object.data.start = rawData.startMetric != null ? this.utility.round(rawData.startMetric) : null;
        object.data.end = rawData.endMetric != null ? this.utility.round(rawData.endMetric) : null;
        object.data.endPinText = `${object.data.end}`;
        object.data.min = rawData.minMetric != null ? this.utility.round(rawData.minMetric) : null;
        object.data.max = rawData.maxMetric != null ? this.utility.round(rawData.maxMetric) : null;
        object.state.isInversed = rawData.startMetric > rawData.endMetric;
        object.state.isInvalid = !rawData.isValid;
        object.data.isBasis = !!rawData.isBasisRange;
        for (const dateStamp in rawData.timeSeries) {
          object.data.timeSeries.push({
            date: dateStamp,
            value: rawData.timeSeries[dateStamp]
          });
        }
        if (!!identifier) {
          object.data.identifier = identifier;
        }
        object.state.isColorCodeInversed = !!colorCodeInversed;
        // temporary guard, only meant for Dec.4th demo, TODO: remove after the demo
          if (object.data.start < object.data.min) {
            object.data.min = object.data.start;
          }
          if (object.data.start > object.data.max) {
            object.data.max = object.data.start;
          }
          if (object.data.end < object.data.min) {
            object.data.min = object.data.end;
          }
          if (object.data.end > object.data.max) {
            object.data.max = object.data.end;
          }
        // guard end
      } else {
        object.data.start = null;
        object.data.end = null;
        object.data.endPinText = '';
        object.state.isInvalid = true;
      }
    }
    return object;
  }

  public formMoveVisualizerObjectForStructuring(
    rawData: BEModels.BEStructuringBreakdownSingleEntry,
    max: number,
    min: number,
    isStencil: boolean,
    groupOption: string,
    isOverride: boolean,
    diveInLevel: number
  ): DTOs.MoveVisualizerDTO {
    const parsedMin = min < 0 ? 0 : min;
    const parsedCurrentLevel = rawData.currentLevel < 0 ? 0 : rawData.currentLevel;
    const totalDistance = max - parsedMin;
    let moveDistance, leftEdge, rightEdge, endPinLocation;
    if (!!rawData && !isStencil) {
      leftEdge = 0
      if (totalDistance === 0) {
        moveDistance = 0;
        rightEdge = 0;
        endPinLocation = 0;
      } else if (rawData.targetLevel !== null && rawData.targetLevel >= 0) {
        // if target is set
        if (rawData.targetLevel > parsedCurrentLevel) {
          moveDistance = this.utility.round(parsedCurrentLevel / totalDistance * 100, 2);
          rightEdge = this.utility.round((rawData.targetLevel - parsedCurrentLevel) / totalDistance * 100, 2);
          endPinLocation = moveDistance;
        } else {
          moveDistance = this.utility.round(rawData.targetLevel / totalDistance * 100, 2);
          rightEdge = this.utility.round((parsedCurrentLevel - rawData.targetLevel) / totalDistance * 100);
          endPinLocation = moveDistance + rightEdge;
        }
      } else if (rawData.targetLevel !== null && rawData.targetLevel < 0) {
        moveDistance = 0;
        rightEdge = this.utility.round(parsedCurrentLevel / totalDistance * 100);
        endPinLocation = moveDistance + rightEdge;
      } else {
        // is target is not set
        moveDistance = this.utility.round(parsedCurrentLevel / totalDistance * 100, 2);
        rightEdge = 0;
        endPinLocation = moveDistance;
      }
    }
    const object: DTOs.MoveVisualizerDTO = {
      data: {
        identifier: '',
        start: 0,
        end: !isStencil ? rawData.currentLevel : 999,
        min: 0,
        max: 0,
        isBasis: false,
        timeSeries: [],
        endPinText: '',
        diveInLevel: diveInLevel
      },
      style: {
        leftGap: 0,
        leftEdge: !isStencil ? leftEdge : 0,
        moveDistance: !isStencil ? moveDistance : 40,
        rightEdge: !isStencil ? rightEdge : 30,
        rightGap: 0,
        endPinLocation: !isStencil ? endPinLocation : 40,
        backgroundColor: isOverride ? '#ffffff' : '#eeeeee'
      },
      state: {
        isInversed: false,
        isInvalid: false,
        isPlaceholder: false,
        isStencil: true,
        isColorCodeInversed: false,
        structuringBreakdownVariant: true,
        structuringBreakdownExceededState: rawData.targetLevel !== null && rawData.currentLevel > rawData.targetLevel
      }
    };
    return object;
  }

  public formHistoricalSummaryObject(
    isStencil: boolean,
    rawData: BEModels.BEHistoricalSummaryDTO,
    isLevel: boolean,
    isColorCodeInversed: boolean
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
        isStencil: !!isStencil
      }
    };
    if (!isStencil && !!rawData) {
      if (!!rawData.BaseSecurity) {
        const baseDTO = this.formMoveVisualizerObject(false, rawData.BaseSecurity.historicalLevel, isColorCodeInversed, rawData.BaseSecurity.security.name);
        baseDTO.state.isPlaceholder = !isLevel;
        object.data.list.push(baseDTO);
      }
      if (!!rawData.Group) {
        const name = rawData.Group.group ? rawData.Group.group.name : 'n/a';
        const groupDTO = isLevel ? this.formMoveVisualizerObject(false, rawData.Group.historicalLevel, isColorCodeInversed, name) : this.formMoveVisualizerObject(false, rawData.Group.historicalBasis, isColorCodeInversed);
        object.data.list.push(groupDTO);
        object.data.centerPoint = (groupDTO.data.max + groupDTO.data.min)/2;
        object.data.globalDistance = (groupDTO.data.max - groupDTO.data.min) * 10;
      }
      if (!!rawData.Top) {
        rawData.Top.forEach((eachQuantBlock) => {
          const eachDTO = isLevel ? this.formMoveVisualizerObject(false, eachQuantBlock.historicalLevel, isColorCodeInversed, eachQuantBlock.security.name) : this.formMoveVisualizerObject(false, eachQuantBlock.historicalBasis, isColorCodeInversed, eachQuantBlock.security.name);
          object.data.list.push(eachDTO);
        })
      }
      if (!!rawData.Bottom) {
        rawData.Bottom.forEach((eachQuantBlock) => {
          const eachDTO = isLevel ? this.formMoveVisualizerObject(false, eachQuantBlock.historicalLevel, isColorCodeInversed, eachQuantBlock.security.name) : this.formMoveVisualizerObject(false, eachQuantBlock.historicalBasis, isColorCodeInversed, eachQuantBlock.security.name);
          object.data.list.push(eachDTO);
        })
      }
    }
    return object;
  }

  public formSystemAlertObject(
    titleTop: string,
    titleBottom: string,
    message: string,
    targetSecurity: DTOs.SecurityDTO
  ): DTOs.AlertDTO {
    const momentTime = moment();
    const validUntilMoment = moment().add(10, 's');
    const object: DTOs.AlertDTO = {
      data: {
        id: this.utility.generateUUID(),
        type: AlertTypes.system,
        subType: AlertSubTypes.default,
        security: null,
        titleTop: titleTop,
        titleBottom: titleBottom,
        message: message,
        paragraphMessage: this.utility.parsePureTextToParagraph(message),
        time: momentTime.format(`HH:mm`),
        titlePin: null,
        validUntilTime: validUntilMoment.format(),
        validUntilMoment: validUntilMoment,
        unixTimestamp: momentTime.unix(),
        level: null,
        quantity: null,
        isUrgent: true,
        trader: null,
        dealer: null,
        status: null,
        isMarketListTraded: false,
        traceCounterParty: null,
        traceSide: null,
        traceVolumeEstimated: null,
        traceVolumeReported: null,
        tracePrice: null,
        traceSpread: null
      },
      api: {
        onMouseEnterAlert: null,
        onMouseLeaveAlert: null
      },
      state: {
        isCancelled: false,
        isNew: true,
        isSlidedOut: false,
        isRead: false,
        isCountdownFinished: true,
        willBeRemoved: false,
        hasSecurity: false,
        hasTitlePin: false,
        isMarketListVariant: false,
        isExpired: false,
        isError: false
      }
    }
    if (targetSecurity) {
      object.data.security = this.utility.deepCopy(targetSecurity);
      object.data.security.state.isInteractionDisabled = true;
      object.data.security.state.isMultiLineVariant = true;
      object.data.security.state.isWidthFlexible = true;
      object.state.hasSecurity = true;
    }
    return object;
  }

  public formAlertObjectFromRawData(
    rawData: BEModels.BEAlertDTO
  ): DTOs.AlertDTO {
    const parsedTitleList = rawData.keyWord.split('|');
    const momentTime = !!rawData.trade ? moment(rawData.trade.eventTime): moment(rawData.timeStamp);
    const object: DTOs.AlertDTO = {
      data: {
        id: rawData.alertId,
        type: this.utility.mapAlertType(rawData.type),
        subType: this.utility.mapAlertSubType(rawData.subType),
        security: null,
        titleTop: parsedTitleList[0] || '',
        titleBottom: parsedTitleList[1] || '',
        message: rawData.message,
        paragraphMessage: this.utility.parsePureTextToParagraph(rawData.message),
        time: momentTime.format(`HH:mm`),
        titlePin: null,
        validUntilTime: null,
        validUntilMoment: null,
        unixTimestamp: momentTime.unix(),
        level: null,
        quantity: null,
        isUrgent: rawData.isUrgent,
        trader: null,
        dealer: null,
        status: null,
        isMarketListTraded: false
      },
      api: {
        onMouseEnterAlert: null,
        onMouseLeaveAlert: null
      },
      state: {
        isCancelled: !!rawData.isCancelled,
        isNew: true,
        isSlidedOut: false,
        isRead: !rawData.isActive,
        isCountdownFinished: true,
        willBeRemoved: false,
        hasSecurity: false,
        hasTitlePin: !!rawData.isMarketListAlert || !!rawData.marketListAlert,  // TODO: remove first part as soon as BE is promoted
        isMarketListVariant: !!rawData.isMarketListAlert || !!rawData.marketListAlert,  // TODO: remove first part as soon as BE is promoted
        isExpired: false
      }
    }
    this.appendAlertDetailInfo(object, rawData);
    this.appendAlertStatus(object);
    return object;
  }

  private appendAlertDetailInfo(
    alertDTO: DTOs.AlertDTO,
    rawData: BEModels.BEAlertDTO
  ) {
    if (!!rawData.security) {
      alertDTO.data.security = this.formSecurityCardObject(
        rawData.security.securityIdentifier || null,
        rawData.security,
        false,
        false
      );
      alertDTO.data.security.state.isInteractionDisabled = true;
      alertDTO.data.security.state.isMultiLineVariant = true;
      alertDTO.data.security.state.isWidthFlexible = true;
      alertDTO.state.hasSecurity = true;
      const targetDriver = alertDTO.data.security.data.mark.markDriver;
      if (!!rawData.quote && !!alertDTO.data.security) {
        alertDTO.data.dealer = rawData.quote.dealer;
        switch (targetDriver) {
          case TriCoreDriverConfig.Spread.label:
            alertDTO.data.level = rawData.quote.spread;
            break;
          case TriCoreDriverConfig.Price.label:
            alertDTO.data.level = rawData.quote.price;
            break;
          case TriCoreDriverConfig.Yield.label:
            alertDTO.data.level = rawData.quote.yield;
            break;
          default:
            break;
        }
        alertDTO.data.quantity = rawData.quote.quantity;
      }
      if (!!rawData.trades && rawData.type === AlertTypes.tradeAlert) {
        let quantity = 0;
        rawData.trades.forEach((eachRawTrade) => {
          quantity = quantity + eachRawTrade.quantity;
        })
        alertDTO.data.quantity = quantity;
        if (rawData.trades.length > 0) {
          const lastTrade = rawData.trades[rawData.trades.length-1];
          alertDTO.data.trader = lastTrade.trader;
          alertDTO.data.dealer = lastTrade.counterpartyName;
          switch (targetDriver) {
            case TriCoreDriverConfig.Spread.label:
              alertDTO.data.level = lastTrade.spread;
              break;
            case TriCoreDriverConfig.Price.label:
              alertDTO.data.level = lastTrade.price;
              break;
            case TriCoreDriverConfig.Yield.label:
              alertDTO.data.level = null;
              break;
            default:
              break;
          }
        }
      }
      if (!!rawData.trade && rawData.type === AlertTypes.traceAlert) {
        const { counterParty, volumeEstimated, volumeReported, price, spread } = rawData.trade;
        alertDTO.data.traceCounterParty = counterParty;
        alertDTO.data.traceVolumeEstimated = volumeEstimated;
        alertDTO.data.traceVolumeReported = volumeReported;
        alertDTO.data.tracePrice = price;
        alertDTO.data.traceSpread = spread;
      }
    }
    if (alertDTO.state.isMarketListVariant) {
      const quoteBlock = rawData.quote as BEModels.BEAlertMarketListQuoteBlock;
      if (!!quoteBlock) {
        if (quoteBlock.isTraded || alertDTO.state.isCancelled) {
          const momentTime = moment(quoteBlock.eventTime);
          alertDTO.data.time = momentTime.format(`HH:mm`);
          alertDTO.data.unixTimestamp = momentTime.unix();
        }
        alertDTO.data.validUntilTime = quoteBlock.validUntilTime;
        alertDTO.data.validUntilMoment = 
            quoteBlock.isTraded || alertDTO.state.isCancelled
              ? moment(quoteBlock.lastModifiedTime)
              : moment(quoteBlock.validUntilTime);
      }
      alertDTO.data.isMarketListTraded = quoteBlock.isTraded;
      alertDTO.data.titlePin =
        !!rawData.marketListAlert
          ? rawData.marketListAlert.subType
          : quoteBlock
            ? quoteBlock.marketListType
            : null;
    }
  }

  public appendAlertStatus(alertDTO: DTOs.AlertDTO) {
    if (alertDTO.state.isMarketListVariant) {
      if (moment().diff(alertDTO.data.validUntilMoment) > 0) {
        alertDTO.state.isExpired = true;
      }
      if (alertDTO.state.isCancelled && alertDTO.data.isMarketListTraded) {
        alertDTO.data.status = `Traded at ${alertDTO.data.validUntilMoment.format('HH:mm:ss')}`;
      } else if (alertDTO.state.isCancelled) {
        alertDTO.data.status = `Cancelled at ${alertDTO.data.validUntilMoment.format('HH:mm:ss')}`;
      } else if (alertDTO.state.isExpired) {
        alertDTO.data.status = `Expired at ${alertDTO.data.validUntilMoment.format('HH:mm:ss')}`;
      } else {
        alertDTO.data.status = `Valid For ${this.utility.parseCountdown(alertDTO.data.validUntilMoment)}`
      }
    } else {
      alertDTO.data.status = alertDTO.state.isCancelled ? 'Cancelled' : 'Active';
    }
  }

  public formAlertCountSummaryObject(
    type: AlertTypes,
    count: number
  ): DTOs.AlertCountSummaryDTO {
    const object: DTOs.AlertCountSummaryDTO = {
      data: {
        count: count,
        alertType: type
      },
      state: {
        isAxe: type === AlertTypes.axeAlert,
        isMark: type === AlertTypes.markAlert,
        isTrade: type === AlertTypes.tradeAlert,
        isTrace: type === AlertTypes.traceAlert
      }
    }
    return object;
  }

  public formTradeObject(
    rawData: BEModels.BETradeBlock,
    targetSecurity: DTOs.SecurityDTO
  ): DTOs.TradeDTO {
    const object: DTOs.TradeDTO = {
      data: {
        tradeId: rawData.tradeId,
        trader: rawData.trader,
        counterPartyName: rawData.counterpartyName,
        quantity: this.utility.parseNumberToCommas(rawData.quantity),
        rawQuantity: rawData.quantity,
        postTradeSumQuantity: this.utility.parseNumberToCommas(rawData.quantityAfterTrade),
        tradeDateTime: moment(rawData.tradeDateTime).unix(),
        tradeDateTimeParsed: moment(rawData.tradeDateTime).format(`YY MMM DD - HH:mm`),
        price: this.utility.parseTriCoreDriverNumber(rawData.price, TriCoreDriverConfig.Price.label, targetSecurity, true) as string,
        spread: this.utility.parseTriCoreDriverNumber(rawData.spread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string,
        wgtAvgPrice: this.utility.parseTriCoreDriverNumber(rawData.wgtAvgPrice, TriCoreDriverConfig.Price.label, targetSecurity, true) as string,
        wgtAvgSpread: this.utility.parseTriCoreDriverNumber(rawData.wgtAvgSpread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string,
        vestedPortfolio: rawData.partitionOptionValue.PortfolioShortName,
        vestedStrategy: rawData.partitionOptionValue.StrategyName
      },
      state: {
        isCancelled: rawData.isCancelled
      }
    }
    return object;
  }

  public formHistoricalTradeObject(targetSecurity: DTOs.SecurityDTO): DTOs.HistoricalTradeVisualizerDTO {
    const object: DTOs.HistoricalTradeVisualizerDTO = {
      data: {
        prinstineTradeList: targetSecurity.data.tradeHistory || [],
        displayTradeList: [],
        positionList: targetSecurity.data.portfolios,
        timeSeriesId: `${targetSecurity.data.securityID}-tradeTimeSeries`,
        positionPieId: `${targetSecurity.data.securityID}-position`,
        volumeLeftPieId: `${targetSecurity.data.securityID}-volumeLeft`,
        volumeRightPieId: `${targetSecurity.data.securityID}-volumeRight`
      },
      state: {
        disabledPortfolio: this.utility.deepCopy(FilterOptionsPortfolioList),
        selectedPortfolio: [],
        graphReceived: false,
        showAllTradeHistory: false
      },
      graph: {
        timeSeries: null,
        positionPie: null,
        volumeLeftPie: null,
        volumeRightPie: null
      }
    };
    if (object.data.prinstineTradeList.length > 0) {
      object.data.prinstineTradeList.sort((tradeA, tradeB) => {
        if (tradeA.data.tradeDateTime > tradeB.data.tradeDateTime) {
          return -1
        } else if (tradeA.data.tradeDateTime < tradeB.data.tradeDateTime) {
          return 1;
        } else {
          return 0;
        }
      });
      object.data.prinstineTradeList.forEach((eachTrade) => {
        if (!!eachTrade.data.vestedPortfolio) {
          const indexInDisabledList = object.state.disabledPortfolio.indexOf(eachTrade.data.vestedPortfolio);
          if (indexInDisabledList >= 0) {
            object.state.disabledPortfolio.splice(indexInDisabledList, 1);
          }
        }
      });
      object.state.selectedPortfolio = FilterOptionsPortfolioList.filter((eachPortfolio) => {
        return !object.state.disabledPortfolio.includes(eachPortfolio);
      });
      object.data.displayTradeList = object.data.prinstineTradeList.filter((eachTrade) => {
        return object.state.selectedPortfolio.includes(eachTrade.data.vestedPortfolio);
      });
    }
    return object;
  }

  public formSecurityTableAlertStatusCellObject(alertDTO: DTOs.AlertDTO): DTOs.SantaTableAlertStatusCellDTO {
    // the order on sorting value is:
    // 1. highlighted ones goes to the top, the will have sorting value = 2099's unix * 2 - unixTimestamp of validUntilTime (this ensures the highlighted ones goes to the top, and have the soon-to-be-expired ones sorted to the top among themselves)
    // 2. active normal alerts, they will have sorting value = unixTimestamp of alert time
    // 3. traded marketlists, they will have sorting value = unix timeStamp of alert time - units
    // 4. cancelled marketlists, they will have sorting value = -unixTimestamp of alert time - 2 units
    // 5. expired marketlists, they will have sorting value = unixTimestamp of alert time - 3 units
    // 6. cancelled normal alerts, they will have sorting value = 0
    const object: DTOs.SantaTableAlertStatusCellDTO = {
      data: {
        statusText: alertDTO.data.status,
        sortingValue: alertDTO.data.unixTimestamp,
        countdownPercent: 0
      },
      state: {
        grayedOutState: alertDTO.state.isCancelled || alertDTO.state.isExpired,
        highlightedState: alertDTO.state.isMarketListVariant && !alertDTO.state.isCancelled && !alertDTO.state.isExpired && !alertDTO.data.isMarketListTraded
      }
    };
    if (alertDTO.state.isMarketListVariant) {
      if (alertDTO.data.isMarketListTraded) {
        object.data.sortingValue = alertDTO.data.validUntilMoment.unix() - ALERT_STATUS_SORTINGVALUE_UNIT;
      } else if (alertDTO.state.isCancelled) {
        object.data.sortingValue = alertDTO.data.validUntilMoment.unix() - 2 * ALERT_STATUS_SORTINGVALUE_UNIT;
      } else if (alertDTO.state.isExpired) {
        object.data.sortingValue = alertDTO.data.validUntilMoment.unix() - 3 * ALERT_STATUS_SORTINGVALUE_UNIT;
      }
    } else if (alertDTO.state.isCancelled) {
      object.data.sortingValue = object.data.sortingValue - 10 * ALERT_STATUS_SORTINGVALUE_UNIT;
    }
    if (object.state.highlightedState) {
      object.data.sortingValue = 4070908800*2 - alertDTO.data.validUntilMoment.unix();
      const countdownInMinutes = Math.abs(moment().diff(alertDTO.data.validUntilMoment, 'minutes'));
      if (countdownInMinutes >= 60) {
        object.data.countdownPercent = 100;
      } else {
        object.data.countdownPercent = this.utility.round(countdownInMinutes*100/60);
      }
    }
    return object;
  }

  public formNumericFilterObject(): DTOs.NumericFilterDTO {
    const object: DTOs.NumericFilterDTO = {
      data: {
        minNumber: null,
        maxNumber: null
      },
      api: {
        params: null,
        valueGetter: null,
        floatingParams: null
      },
      state: {
        isFilled: false
      }
    };
    return object;
  }

  public formWatchListObject(copy: DTOs.SecurityDTO) {
    const object: DTOs.TradeAlertConfigurationAxeGroupBlockDTO = {
      data: {
        card: copy,
        groupId: null,
        scopes: copy.data.alert.shortcutConfig.side.length > 0 ? copy.data.alert.shortcutConfig.side.map((eachSide) => {return eachSide as AxeAlertScope}) : [AxeAlertScope.ask, AxeAlertScope.bid],
        axeAlertTypes: [AxeAlertType.normal, AxeAlertType.marketList],
        targetDriver: copy.data.alert.shortcutConfig.driver || null,
        targetRange: copy.data.alert.shortcutConfig.numericFilterDTO,
        sendEmail: !!copy.data.alert.shortcutConfig.sendEmail
      },
      state: {
        isDeleted: false,
        isDisabled: false,
        isUrgent: !!copy.data.alert.shortcutConfig.isUrgent,
        isRangeActive: false
      }
    }
    return object;
  }

  public formNewAlertWatchlistEntryObject(
    rawGroupConfig: BEModels.BEAlertConfigurationDTO,
    targetScope: AxeAlertScope,
    watchType: AxeAlertType,
    populateDriversFn,
    populateRangeNumbersFn,
    checkFilled,
    checkRangeActive,
    dtoNumericFilterObjectFn = this.formNumericFilterObject) {
    const object: DTOs.TradeAlertConfigurationAxeGroupBlockDTO = {
      data: {
        card: null,
        groupId: rawGroupConfig.alertConfigID,
        scopes: targetScope === AxeAlertScope.both || targetScope === AxeAlertScope.liquidation ? [AxeAlertScope.ask, AxeAlertScope.bid] : [targetScope],  // from now on we will remove "liquidation" as a side option, just to be backward-compatible, in code we treat liquidation the same as "both"
        axeAlertTypes: watchType === AxeAlertType.both ? [AxeAlertType.normal, AxeAlertType.marketList] : [watchType],
        targetDriver: populateDriversFn(rawGroupConfig),
        targetRange: populateRangeNumbersFn(rawGroupConfig, dtoNumericFilterObjectFn),
        sendEmail: !!rawGroupConfig.sendEmail,
        securityIdentifier: rawGroupConfig.groupFilters.SecurityIdentifier[0]
      },
      state: {
        isDeleted: false,
        isDisabled: !rawGroupConfig.isEnabled,
        isUrgent: rawGroupConfig.isUrgent,
        isRangeActive: false
      }
    }
    checkFilled(object);
    checkRangeActive(object);
    return object;
  }

  public formTargetBarObject(targetMetric: PortfolioMetricValues, currentValue: number, targetValue: number, isStencil: boolean, activeMetricValue: PortfolioMetricValues) {
    const object: DTOs.TargetBarDTO = {
      data: {
        targetMetric,
        currentValue,
        targetValue,
        displayedCurrentValue: '',
        displayedTargetValue: '',
        currentPercentage: '',
        exceededPercentage: '',
        displayedResults: ''
      },
      state: {
        isInactiveMetric: false,
        isStencil: !!isStencil,
        isEmpty: false,
        isDataUnavailable: false
      }
    }

    function getDisplayedValues(targetBar: DTOs.TargetBarDTO) {
      const currentAbsValue = Math.abs(targetBar.data.currentValue);
      const targetAbsValue = Math.abs(targetBar.data.targetValue);
      if (targetBar.data.targetValue < 0 && targetBar.data.currentValue > 0) {
        if (targetBar.data.currentValue >= targetAbsValue) {
          targetBar.data.exceededPercentage = '100%';
        } else {
          const exceedAmount = targetBar.data.currentValue / targetAbsValue;
          targetBar.data.exceededPercentage = `${exceedAmount * 100}%`;
          targetBar.data.currentPercentage = '100%';
        }
      } else if (targetBar.data.targetValue > 0 && targetBar.data.currentValue < 0) {
        targetBar.data.exceededPercentage = '0';
        targetBar.data.currentPercentage = '0';
      } else if (targetBar.data.currentValue < 0 && targetBar.data.targetValue < 0) {
        if (targetBar.data.currentValue < targetBar.data.targetValue) {
          const difference = 1 - ((currentAbsValue - targetAbsValue) / targetAbsValue);
          targetBar.data.currentPercentage = `${difference * 100}%`;
          targetBar.data.exceededPercentage = '0';
        } else {
          targetBar.data.exceededPercentage = targetAbsValue / currentAbsValue >= 2 ? '100%' : `${((targetAbsValue - currentAbsValue) / targetAbsValue) * 100}%`;
          targetBar.data.currentPercentage = '100%';
        }
      } else if (currentAbsValue === targetAbsValue) {
        targetBar.data.currentPercentage = '100%';
        targetBar.data.exceededPercentage = '0';
      } else if (targetBar.data.currentValue > targetBar.data.targetValue) {
        targetBar.data.currentPercentage = '100%';
        targetBar.data.exceededPercentage = targetBar.data.currentValue / targetBar.data.targetValue >= 2 ? '100%' : `${((currentAbsValue - targetAbsValue) / targetBar.data.targetValue) * 100}%`
      } else {
        const difference = targetBar.data.currentValue / targetBar.data.targetValue;
        targetBar.data.currentPercentage = `${difference * 100}%`;
        targetBar.data.exceededPercentage = '0';
      }
    }

    function getDisplayedResults(valueA: string, valueB: string) {
      return `${valueA}/${valueB}`;
    }
    
    const convertValuesForDisplay =  (targetBar: DTOs.TargetBarDTO) => {
     if (targetBar.data.targetMetric === PortfolioMetricValues.cs01) {
        targetBar.data.displayedCurrentValue = this.utility.parseNumberToThousands(targetBar.data.currentValue, true, 0);
        targetBar.data.displayedTargetValue = this.utility.parseNumberToThousands(targetBar.data.targetValue,true, 0);
        targetBar.data.displayedResults = getDisplayedResults(targetBar.data.displayedCurrentValue, targetBar.data.displayedTargetValue);
      } else {
        targetBar.data.displayedCurrentValue = this.utility.round(targetBar.data.currentValue,2);
        targetBar.data.displayedTargetValue = this.utility.round(targetBar.data.targetValue,2);
        targetBar.data.displayedResults = getDisplayedResults(targetBar.data.displayedCurrentValue, targetBar.data.displayedTargetValue);
      }
    }
    convertValuesForDisplay(object);
    getDisplayedValues(object);
    if (!targetValue) {
      object.state.isEmpty = true;
      object.data.displayedResults = `${object.data.displayedCurrentValue} / -`;
    }
    object.state.isInactiveMetric = object.data.targetMetric === PortfolioMetricValues.creditDuration ? activeMetricValue === PortfolioMetricValues.creditLeverage : object.data.targetMetric !== activeMetricValue;
    return object;
  }

  public formStructureFundObject(
    rawData: BEModels.BEPortfolioStructuringDTO,
    isStencil: boolean,
    selectedMetricValue: PortfolioMetricValues = PortfolioMetricValues.cs01
  ): DTOs.PortfolioStructureDTO {
    const object: DTOs.PortfolioStructureDTO = {
      data: null,
      api: {
        onSubmitMetricValues: null
      },
      state: {
        isEditAvailable: false,
        isStencil: !!isStencil,
        isNumeric: true,
        isDataUnavailable: false,
        isEditingFund: false,
        hasErrors: {
          updatedCreditLeverage: false,
          updatedCreditDuration: false,
          errorMessage: ''
        },
        modifiedFundTargets: {
          creditLeverage: rawData.target.target.CreditLeverage || 0,
          creditDuration: rawData.target.target.CreditDuration || 0
        },
        autoScalingAvailable: !isStencil 
          ? !!rawData.target.target.CreditLeverage || !!rawData.target.target.CreditDuration
          : false,
        autoScalingActive: true
      }
    };
    try {
      object.data = {
        date: rawData.date,
        portfolioId: rawData.portfolioId,
        portfolioShortName: rawData.portfolioShortName,
        portfolioNav: rawData.portfolioNav,
        target: {
          portfolioTargetId: rawData.target.portfolioTargetId,
          date: rawData.target.date,
          portfolioId: rawData.target.portfolioId,
          target: {
            cs01: !isStencil ? rawData.target.target.Cs01 : 0,
            creditLeverage: !isStencil ? rawData.target.target.CreditLeverage : 0,
            creditDuration: !isStencil ? rawData.target.target.CreditDuration : 0
          }
        },
        currentTotals :{
          cs01: !isStencil ? rawData.currentTotals.Cs01 : 0,
          creditLeverage: !isStencil ? rawData.currentTotals.CreditLeverage : 0,
          creditDuration: !isStencil ? rawData.currentTotals.CreditDuration : 0
        },
        indexId: rawData.indexId,
        indexShortName: rawData.indexShortName,
        indexNav: rawData.indexNav,
        indexTotals: {
          cs01: !isStencil ? rawData.indexTotals.Cs01 : 0,
          creditLeverage: !isStencil ? rawData.indexTotals.CreditLeverage : 0,
          creditDuration: !isStencil ? rawData.indexTotals.CreditDuration: 0
        },
        children: [],
        cs01TargetBar: null,
        creditLeverageTargetBar: null,
        creditDurationTargetBar: null,
        originalBEData: rawData
      };
      object.data.cs01TargetBar = this.formTargetBarObject(PortfolioMetricValues.cs01, object.data.currentTotals.cs01, object.data.target.target.cs01, object.state.isStencil, selectedMetricValue);
      object.data.creditLeverageTargetBar = this.formTargetBarObject(PortfolioMetricValues.creditLeverage, object.data.currentTotals.creditLeverage, object.data.target.target.creditLeverage, object.state.isStencil, selectedMetricValue);
      object.data.creditDurationTargetBar = this.formTargetBarObject(PortfolioMetricValues.creditDuration, object.data.currentTotals.creditDuration, object.data.target.target.creditDuration, object.state.isStencil, selectedMetricValue);
      if (!!object.data.creditDurationTargetBar) {
        const parsedCs01CurrentTotal = !!rawData.currentTotals.Cs01 ? this.utility.parseNumberToThousands(rawData.currentTotals.Cs01, true, 0) : '-';
        const parsedCs01TargetTotal = !!rawData.target.target.Cs01 ? this.utility.parseNumberToThousands(rawData.target.target.Cs01, true, 0) : '-';
        object.data.creditDurationTargetBar.data.additionalMetricTargetData = {
          metric: PortfolioMetricValues.cs01,
          current: parsedCs01CurrentTotal,
          target: parsedCs01TargetTotal
        }
      }
      this.processBreakdownDataForStructureFund(
        object,
        rawData,
        isStencil,
        selectedMetricValue
      );
      !isStencil && this.processOverrideDataForStructureFund(
        object,
        rawData,
        selectedMetricValue
      )
    } catch (err) {
      console.warn('Data issue on fund', object, err);
    }
    return object;
  }

  public formPortfolioBreakdown(
    isStencil: boolean,
    rawData: BEModels.BEStructuringBreakdownBlock,
    definitionList: Array<string>,
    isDisplayCs01: boolean,
    isOverride = false
  ): DTOs.PortfolioBreakdownDTO {
    const isBicsBreakdown = rawData.groupOption.indexOf('BicsLevel') > -1;
    const object: DTOs.PortfolioBreakdownDTO = {
      data: {
        title: '',
        definition: null,
        displayCategoryList: [],
        ratingHoverText: !isStencil ? 'n/a' : '33%',
        rawCs01CategoryList: [],
        rawLeverageCategoryList: [],
        backendGroupOptionIdentifier: !isStencil ? rawData.groupOption : null,
        popover: null,
        portfolioId: rawData.portfolioId,
        selectedCategory: '',
        diveInLevel: 0,
        indexName: ''
      },
      style: {
        ratingFillWidth: null
      },
      state: {
        isEditable: false,
        isStencil: true,
        isDisplayingCs01: !!isDisplayCs01,
        isTargetAlignmentRatingAvail: !!isStencil,
        isPreviewVariant: false,
        isBICs: !!isBicsBreakdown,
        isOverrideVariant: false,
        isEditingViewAvail: false,
        isDisplaySubLevels: false
      }
    };
    const [findCs01Min, findCs01Max, findLeverageMin, findLeverageMax] = this.utility.getCompareValuesForStructuringVisualizer(rawData);
    if (rawData.groupOption === 'Tenor') {
      // Tenor does not need to be sorted alphabetically
    } else {
      definitionList.sort();
    }
    definitionList.forEach((eachCategoryText) => {
      let bucket: Blocks.StructureBucketDataBlock = {};
      let customLevel: number;
      let isCustomLevelAvailable: string;
      if (!!rawData.breakdown[eachCategoryText]) {
        isCustomLevelAvailable = Object.keys(rawData.breakdown[eachCategoryText]).find(key => key === 'customLevel');
        customLevel = !!isCustomLevelAvailable ? (rawData.breakdown[eachCategoryText] as BEModels.BECustomMetricBreakdowns).customLevel : null;
      }
      if (!!isOverride) {
        bucket = this.utility.populateBEBucketObjectFromRowIdentifier(
          this.utility.formBEBucketObjectFromBucketIdentifier(rawData.groupOption),
          eachCategoryText
        )
      } else if (!!isCustomLevelAvailable) {
        const formattedBEKey = `BicsLevel${(rawData.breakdown[eachCategoryText] as BEModels.BECustomMetricBreakdowns).customLevel}`;
        bucket[formattedBEKey] = [eachCategoryText];
      } else {
        bucket[rawData.groupOption] = [eachCategoryText];
      }
      const parsedBEView = !!rawData.breakdown[eachCategoryText]  && !!rawData.breakdown[eachCategoryText].view ? rawData.breakdown[eachCategoryText].view.toLowerCase() : null;
      const view = PortfolioView[parsedBEView];
      const eachCs01CategoryBlock = rawData.breakdown[eachCategoryText] 
        ? this.formPortfolioBreakdownCategoryBlock(
          findCs01Min,
          findCs01Max,
          isStencil,
          eachCategoryText,
          rawData.breakdown[eachCategoryText].metricBreakdowns.Cs01,
          true,
          rawData.portfolioId,
          rawData.groupOption,
          isOverride,
          object.data.diveInLevel,
          view,
          bucket,
          customLevel
        )
        : null;
      !!eachCs01CategoryBlock && object.data.rawCs01CategoryList.push(eachCs01CategoryBlock);
      const eachLeverageCategoryBlock = rawData.breakdown[eachCategoryText] 
        ? this.formPortfolioBreakdownCategoryBlock(
          findLeverageMin,
          findLeverageMax,
          isStencil,
          eachCategoryText,
          rawData.breakdown[eachCategoryText].metricBreakdowns.CreditLeverage,
          false,
          rawData.portfolioId,
          rawData.groupOption,
          isOverride,
          object.data.diveInLevel,
          view,
          bucket,
          customLevel
        )
        : null;
      !!eachLeverageCategoryBlock && object.data.rawLeverageCategoryList.push(eachLeverageCategoryBlock);
    });
    return object;
  }

  public formPortfolioOverrideBreakdown(
    rawData: BEModels.BEStructuringBreakdownBlock,
    isDisplayCs01: boolean
  ): DTOs.PortfolioBreakdownDTO {
    const definitionList = [];
    for (let eachCategory in rawData.breakdown) {
      definitionList.push(eachCategory);
    }
    const newBreakdown = this.formPortfolioBreakdown(false, rawData, definitionList, isDisplayCs01, true);
    newBreakdown.state.isOverrideVariant = true;
    newBreakdown.data.definition = this.formSecurityDefinitionObject(SecurityDefinitionMap.OVERRIDE);
    newBreakdown.data.title = newBreakdown.data.backendGroupOptionIdentifier;
    newBreakdown.data.title = newBreakdown.data.title.replace('BICS Lv.4', 'BICS Override');
    return newBreakdown;
  }

  public formPortfolioBreakdownCategoryBlock(
    minValue: number,
    maxValue: number,
    isStencil: boolean,
    categoryName: string,
    rawCategoryData: BEModels.BEStructuringBreakdownSingleEntry,
    isCs01: boolean,
    portfolioID: number,
    groupOption: string,
    isOverride: boolean,
    diveInLevel: number,
    view: PortfolioView,
    bucket: Blocks.StructureBucketDataBlock,
    customLevel: number = null,
  ): DTOs.StructurePortfolioBreakdownRowDTO {
    if (!!rawCategoryData) {
      const parsedRawData = this.utility.deepCopy(rawCategoryData);
      const rawCurrentLevel = parsedRawData.currentLevel;
      const rawCurrentPct = parsedRawData.currentPct;
      const rawTargetLevel = parsedRawData.targetLevel;
      const rawTargetPct = parsedRawData.targetPct;
      if (!!isCs01) {
        parsedRawData.currentLevel = rawCurrentLevel >= 1000 ? this.utility.round(parsedRawData.currentLevel/1000, 0) : 0;
      } else {
        parsedRawData.currentLevel = this.utility.round(parsedRawData.currentLevel, 2);
      }
      if (parsedRawData.targetLevel != null) {
        if (!!isCs01) {
          parsedRawData.targetLevel = parsedRawData.targetLevel >= 1000 ? this.utility.round(parsedRawData.targetLevel/1000, 0) : 0;
        } else {
          parsedRawData.targetLevel = this.utility.round(parsedRawData.targetLevel, 2);
        }
      }
      if (parsedRawData.targetPct != null) {
        parsedRawData.targetPct = this.utility.round(parsedRawData.targetPct*100, 1);
      }
      if (parsedRawData.currentPct != null) {
        parsedRawData.currentPct = this.utility.round(parsedRawData.currentPct*100, 1);
      }
      if (parsedRawData.indexPct != null) {
        parsedRawData.indexPct = this.utility.round(parsedRawData.indexPct*100, 1);
      }
      maxValue = !!isCs01 ? maxValue/1000 : maxValue;
      minValue = !!isCs01 ? minValue/1000 : minValue;
      const eachMoveVisualizer = this.formMoveVisualizerObjectForStructuring(
        parsedRawData,
        maxValue,
        minValue,
        !!isStencil,
        groupOption,
        isOverride,
        diveInLevel
      );
      eachMoveVisualizer.data.endPinText = !!isCs01 ? `${eachMoveVisualizer.data.end}k` : `${eachMoveVisualizer.data.end}`;
      const diffToTarget = !!isCs01 ? Math.round(parsedRawData.targetLevel - parsedRawData.currentLevel) : this.utility.round(parsedRawData.targetLevel - parsedRawData.currentLevel, 2);

      const isBicsBreakdown = groupOption.indexOf('BicsLevel') > -1;
      // If the row is within the regular BICS breakdown, then reformat the category and display category as the identifier 'BICsSubLevel.' was only used in a custom BICS BE breakdown to prevent overwriting values where categories in different levels had the same name
      // The reformatting ensures the popover works
      const eachCategoryBlock: Blocks.PortfolioBreakdownCategoryBlock = {
        category: categoryName.includes('BICsSubLevel.') ? categoryName.split('BICsSubLevel.')[0].trim() : categoryName,
        displayCategory: categoryName.includes('BICsSubLevel.') ? categoryName.split('BICsSubLevel.')[0].trim() : categoryName,
        targetLevel: parsedRawData.targetLevel,
        targetPct: parsedRawData.targetPct,
        diffToTarget: parsedRawData.targetLevel != null ? diffToTarget : 0,
        diffToTargetDisplay: '-',
        currentLevel: parsedRawData.currentLevel,
        currentPct: parsedRawData.currentPct,
        currentPctDisplay: parsedRawData.currentPct != null ? `${parsedRawData.currentPct}%` : '-',
        indexPct: parsedRawData.indexPct,
        indexPctDisplay: parsedRawData.indexPct != null ? `${parsedRawData.indexPct}%` : '-',
        moveVisualizer: eachMoveVisualizer,
        bicsLevel: !!customLevel ? customLevel : null,
        children: null,
        portfolioID: portfolioID,
        diveInLevel: diveInLevel,
        raw: {
          currentLevel: rawCurrentLevel,
          currentPct: rawCurrentPct,
          targetLevel: rawTargetLevel,
          targetPct: rawTargetPct
        },
        view: view,
        bucket: bucket,
        parentRow: null,
        displayedSubLevelRows: []
      };
      if (eachCategoryBlock.diffToTarget < 0) {
        eachCategoryBlock.diffToTargetDisplay = !!isCs01 ? `${eachCategoryBlock.diffToTarget}k` : `${eachCategoryBlock.diffToTarget}`;
      }
      if (eachCategoryBlock.diffToTarget > 0) {
        eachCategoryBlock.diffToTargetDisplay = !!isCs01 ? `+${eachCategoryBlock.diffToTarget}k` : `+${eachCategoryBlock.diffToTarget}`;
      }
      const eachCategoryBlockDTO = this.formStructureBreakdownRowObject(eachCategoryBlock,isBicsBreakdown);
      return eachCategoryBlockDTO;
    } else {
      return null;
    }
  }

  public formSantaModal(
    elementRef: ElementRef
  ): DTOs.SantaModalDTO{
    const object: DTOs.SantaModalDTO = {
      data: {
        id: null,
        modalElement: elementRef.nativeElement,
        title: 'Edit'
      },
      state: {
        isPresenting: false
      },
      api: {
        openModal: null,
        closeModal: null,
        saveModal: null
      }
    };
    return object;
  }

  public formStructurePopoverObject(categoryRow: DTOs.StructurePortfolioBreakdownRowDTO, isDisplayCs01: boolean): DTOs.StructurePopoverDTO {
    const object = {
      data: {
        mainRow: categoryRow
      },
      state: {
        isActive: false,
        isDisplayCs01: isDisplayCs01
      }
    }
    return object;
  }

  public formStructureBreakdownRowObject(categoryRow: Blocks.PortfolioBreakdownCategoryBlock, isDiveIn: boolean): DTOs.StructurePortfolioBreakdownRowDTO {
    const object = {
      data: categoryRow,
      style: {
        branchHeight: '0',
        top: '0'
      },
      state: {
        isSelected: false,
        isBtnDiveIn: isDiveIn,
        isStencil: true,
        isWithinPopover: false,
        isVisibleSubLevel: false,
        isShowingSubLevels: false,
        isEditingView: false,
        isEditingViewAvail: false,
        isDoveIn: false
      }
    }
    return object;
  }

  public formTraceTradeBlockObject(rawData: BEModels.BETraceTradesBlock, targetSecurity: DTOs.SecurityDTO) {
    const counterParty = !!rawData.counterParty ? rawData.counterParty === TraceTradeCounterParty.ClientAffiliate ? TraceTradeCounterParty.ClientAffiliate : TraceTradeCounterParty[rawData.counterParty] : null;
    const object: Blocks.TraceTradeBlock = {
      traceTradeId: rawData.traceTradeID,
      tradeTime: rawData.eventTime,
      displayTradeTime: moment(rawData.eventTime).format(`MMM DD - HH:mm`),
      reportingTime: rawData.publishingTime,
      displayReportingTime: moment(rawData.publishingTime).format(`MMM DD - HH:mm`),
      counterParty: counterParty,
      side: TradeSideValueEquivalent[rawData.side],
      volumeEstimated: rawData.volumeEstimated,
      volumeReported: rawData.volumeReported,
      displayVolumeEstimated: !!rawData.volumeEstimated ? this.utility.parseNumberToCommas(rawData.volumeEstimated) : null,
      displayVolumeReported: null,
      price: this.utility.parseTriCoreDriverNumber(rawData.price, TriCoreDriverConfig.Price.label, targetSecurity, true) as string,
      yield: this.utility.parseTriCoreDriverNumber(rawData.yield, TriCoreDriverConfig.Yield.label, targetSecurity, false) as number,
      spread: this.utility.parseTriCoreDriverNumber(rawData.spread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string,
      oasSpread: this.utility.parseTriCoreDriverNumber(rawData.oasSpread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string,
      gSpread: this.utility.parseTriCoreDriverNumber(rawData.gSpread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string,
      iSpread: this.utility.parseTriCoreDriverNumber(rawData.iSpread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string,
      parSpread: this.utility.parseTriCoreDriverNumber(rawData.parSpread, TriCoreDriverConfig.Spread.label, targetSecurity, true) as string
    }
    //Set specific display value for volume reported based on the availability of volume estimated
    if (!!object.volumeReported) {
      if (!!object.volumeEstimated) {
        object.displayVolumeReported = this.utility.formatTraceReportedValues(object.volumeReported);
      } else {
        object.displayVolumeReported = this.utility.parseNumberToCommas(rawData.volumeReported);
      }
    } else {
      object.displayVolumeReported = null;
    }
    return object;
  }

  public formTraceTradesVisualizerDTO(targetRow: DTOs.SecurityTableRowDTO, isPinnedFullWidth: boolean = false, previousAvailableFiltersList: Array<string>): DTOs.TraceTradesVisualizerDTO {
    const object: DTOs.TraceTradesVisualizerDTO = {
      data: {
        pristineRowList: [],
        displayList: [],
        scatterGraphId: !isPinnedFullWidth ? `${targetRow.data.rowId}-${TRACE_SCATTER_GRAPH_ID}` : `${targetRow.data.rowId}-${AGGRID_PINNED_FULL_WIDTH_ROW_KEYWORD}-${TRACE_SCATTER_GRAPH_ID}`,
        pieGraphLeftId: !isPinnedFullWidth ? `${targetRow.data.rowId}-${TRACE_PIE_GRAPH_LEFT_ID}` : `${targetRow.data.rowId}-${AGGRID_PINNED_FULL_WIDTH_ROW_KEYWORD}-${TRACE_PIE_GRAPH_LEFT_ID}`,
        pieGraphRightId: !isPinnedFullWidth ? `${targetRow.data.rowId}-${TRACE_PIE_GRAPH_RIGHT_ID}` : `${targetRow.data.rowId}-${AGGRID_PINNED_FULL_WIDTH_ROW_KEYWORD}-${TRACE_PIE_GRAPH_RIGHT_ID}`,
        filterList: FilterTraceTradesOptions,
        availableFiltersList: []
      },
      state: {
        isDisplayAllTraceTrades: false,
        graphReceived: false,
        selectedFiltersList: [],
        showGraphs: false,
        isShowingDailyTradesOnly: false
      },
      graph: {
        scatterGraph: null,
        pieGraphLeft: null,
        pieGraphRight: null
      }
    }

    if (targetRow.data.security.data.traceTrades.length > 0) {
      targetRow.data.security.data.traceTrades.sort((tradeA, tradeB) => {
        if (tradeA.tradeTime > tradeB.tradeTime) {
          return -1
        } else if (tradeB.tradeTime > tradeA.tradeTime) {
          return 1;
        } else {
          return 0;
        }
      })
      object.data.pristineRowList = targetRow.data.security.data.traceTrades;
      object.data.displayList = this.utility.getDailyTraceTrades(targetRow.data.security.data.traceTrades);
      // checks if only daily trades are available
      const currentDate = moment();
      const formattedCurrentDate = currentDate.format('YYYY-MM-DD');
      const checkForDailyTrade = (trade: Blocks.TraceTradeBlock) => moment(trade.tradeTime).format('YYYY-MM-DD') === formattedCurrentDate;
      const isDailyTradesOnly = targetRow.data.security.data.traceTrades.every(checkForDailyTrade);
      if (!!isDailyTradesOnly) {
        object.state.isShowingDailyTradesOnly = true;
      }
    }
    const numericFilter = traceTradeNumericalFilterSymbols.greaterThan;
    object.data.filterList.forEach(option => {
      const isNumericOption = option.includes(numericFilter);
      if (previousAvailableFiltersList.indexOf(option) > -1 ) {
        object.data.availableFiltersList.push(option)
      } else if (!!isNumericOption) {
        const parsedAmount: number = this.utility.getTraceNumericFilterAmount(numericFilter, option);
        const isTradeAvailable = this.utility.getTraceTradesListBasedOnAmount(object.data.displayList, parsedAmount);
        isTradeAvailable.length > 0 && object.data.
        availableFiltersList.push(option);
      } else {
        const isCounterPartyAvailable = object.data.displayList.find(trade => trade.counterParty === option);
        !!isCounterPartyAvailable && object.data.availableFiltersList.push(option);
      }
    })
    return object;
  }

  public formCustomRawBreakdownData(rawData: BEModels.BEPortfolioStructuringDTO, targetBreakdown: BEModels.BEStructuringBreakdownBlock, identifiers: string[]): [BEModels.BEStructuringBreakdownBlock, string[]] {
    const customBreakdown: BEModels.BEStructuringBreakdownBlock = this.utility.deepCopy(targetBreakdown);
    for (let category in customBreakdown.breakdown) {
      if (!!customBreakdown.breakdown[category]) {
        (customBreakdown.breakdown[category] as BEModels.BECustomMetricBreakdowns).customLevel = 1;
      }
    }
    const selectedBreakdowns: Array<BEModels.BEStructuringBreakdownBlock> = identifiers.map(identifier => rawData.breakdowns[identifier]);
    selectedBreakdowns.forEach((selectedBreakdown, i) => {
      for (let category in selectedBreakdown.breakdown) {
        if (!!selectedBreakdown.breakdown[category]) {
          if (selectedBreakdown.breakdown[category].metricBreakdowns.Cs01.targetLevel >= 1000 || !!selectedBreakdown.breakdown[category].metricBreakdowns.CreditLeverage.targetLevel) {
            // check if its the same name as another category to avoid overwriting those values
            const categoryNameExists = Object.keys(customBreakdown.breakdown).find(key => key === category);
            // Adding 2 because of how the index starts at 0 and we want it to increment by 1
            const level = i + 2;
            if (!!categoryNameExists) {
              const customCategory = `${category} BICsSubLevel.${level}`
              customBreakdown.breakdown[customCategory] = selectedBreakdown.breakdown[category];
              (customBreakdown.breakdown[customCategory] as BEModels.BECustomMetricBreakdowns).customLevel = level;
            } else {
              customBreakdown.breakdown[category] = selectedBreakdown.breakdown[category];
              (customBreakdown.breakdown[category] as BEModels.BECustomMetricBreakdowns).customLevel = level;
            }
          }
        }
      }
    });
    const customDefinitionList: Array<string>= [];
    for (let category in customBreakdown.breakdown) {
      if (!!customBreakdown.breakdown[category]) {
        customDefinitionList.push(category)
      }
    }
    return [customBreakdown, customDefinitionList];
  }

  private processBreakdownDataForStructureFund(
    object: DTOs.PortfolioStructureDTO,
    rawData: BEModels.BEPortfolioStructuringDTO,
    isStencil: boolean,
    selectedMetricValue: PortfolioMetricValues
  ){
    const isDisplayCs01 = selectedMetricValue === PortfolioMetricValues.cs01;
    const currencyBreakdown = this.formPortfolioBreakdown(isStencil, rawData.breakdowns.Ccy, FilterOptionsCurrency, isDisplayCs01);
    currencyBreakdown.data.definition = this.formSecurityDefinitionObject(SecurityDefinitionMap.CURRENCY);
    currencyBreakdown.data.title = currencyBreakdown.data.definition.data.displayName;
    currencyBreakdown.data.indexName = rawData.indexShortName;
    object.data.children.push(currencyBreakdown);
    currencyBreakdown.state.isDisplayingCs01 = selectedMetricValue === PortfolioMetricValues.cs01;
    const tenorBreakdown = this.formPortfolioBreakdown(isStencil, rawData.breakdowns.Tenor, FilterOptionsTenor, isDisplayCs01);
    tenorBreakdown.data.definition = this.formSecurityDefinitionObject(SecurityDefinitionMap.TENOR);
    tenorBreakdown.data.title = tenorBreakdown.data.definition.data.displayName;
    tenorBreakdown.data.indexName = rawData.indexShortName;
    object.data.children.push(tenorBreakdown);
    tenorBreakdown.state.isDisplayingCs01 = selectedMetricValue === PortfolioMetricValues.cs01;
    const ratingBreakdown = this.formPortfolioBreakdown(isStencil, rawData.breakdowns.RatingNoNotch, FilterOptionsRating, isDisplayCs01);
    ratingBreakdown.data.definition = this.formSecurityDefinitionObject(SecurityDefinitionMap.RATING);
    ratingBreakdown.data.title = ratingBreakdown.data.definition.data.displayName;
    ratingBreakdown.data.indexName = rawData.indexShortName;
    object.data.children.push(ratingBreakdown);
    ratingBreakdown.state.isDisplayingCs01 = selectedMetricValue === PortfolioMetricValues.cs01;
  }

  private processOverrideDataForStructureFund(
    object: DTOs.PortfolioStructureDTO,
    rawData: BEModels.BEPortfolioStructuringDTO,
    selectedMetricValue: PortfolioMetricValues
  ){
    if(rawData.overrides) {
      const returnPack: StructureOverrideToBreakdownConversionReturnPack = this.utility.convertRawOverrideToRawBreakdown(rawData.overrides);
      const overrideList: Array<BEModels.BEStructuringBreakdownBlock> = returnPack.list;
      overrideList.sort((overrideA, overrideB) =>{
        if (overrideA.groupOption > overrideB.groupOption) {
          return -1;
        } else if (overrideB.groupOption > overrideA.groupOption) {
          return 1;
        } else {
          return 0;
        }
      });
      overrideList.forEach((eachRawBreakdown) => {
        const isDisplayCs01 = selectedMetricValue === PortfolioMetricValues.cs01;
        const newBreakdown = this.formPortfolioOverrideBreakdown(eachRawBreakdown, isDisplayCs01);
        newBreakdown.data.indexName = rawData.indexShortName;
        this.utility.updateDisplayLabelForOverrideConvertedBreakdown(
          returnPack.displayLabelMap[newBreakdown.data.backendGroupOptionIdentifier],
          newBreakdown
        );
        this.utility.sortOverrideRows(newBreakdown);
        object.data.children.unshift(newBreakdown);
      });
    }
  }

  public formGlobalWorkflow(
    targetModule: NavigationModule,
    isRedirect: boolean
  ): DTOs.GlobalWorkflowStateDTO {
    const object: DTOs.GlobalWorkflowStateDTO = {
      data: {
        uuid: this.utility.generateUUID(),
        module: targetModule,
        title: `Generic step in ${targetModule}`
      },
      state: {
        triggersRedirect: !!isRedirect
      }
    };
    return object;
  }
}
