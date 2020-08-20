  // dependencies
    import { Injectable } from '@angular/core';
    import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
    import * as moment from 'moment';

    import * as BEModels from 'BEModels/backend-models.interface';
    import * as DTOs from 'FEModels/frontend-models.interface';
    import * as Blocks from 'FEModels/frontend-blocks.interface';
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
      ALERT_STATUS_SORTINGVALUE_UNIT
    } from 'Core/constants/coreConstants.constant';
    import {
      SECURITY_TABLE_QUOTE_TYPE_RUN,
      SECURITY_TABLE_QUOTE_TYPE_AXE,
      AGGRID_ROW_HEIGHT,
      AGGRID_ROW_HEIGHT_SLIM
    } from 'Core/constants/securityTableConstants.constant';
    import {
      GroupMetricOptions
    } from 'Core/constants/marketConstants.constant';
    import {
      ConfiguratorDefinitionLayout,
      FilterOptionsPortfolioList
    } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      QuoteHeaderConfigList
    } from 'Core/constants/securityTableConstants.constant';
    import {
      AxeAlertScope,
      AxeAlertType
    } from 'Core/constants/tradeConstants.constant';
    import { PortfolioShortNames } from 'Core/constants/structureConstants.constants';
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
        hasIndex: !isStencil && rawData.metrics ? !!rawData.metrics.Index : false,
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
        tradeHistory: []
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
      portfolioName: targetPortfolio.partitionOptionValue.PortfolioShortName,
      quantity: targetPortfolio.quantity,
      strategy: targetPortfolio.partitionOptionValue.StrategyName,
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
      shortcutConfig: dto.data.alert.shortcutConfig
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
        displayName: rawData.displayName,
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
        filterActive: false,
        isMiniPillVariant: false
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
    groupByDisabled: boolean,
    noMainCTA?: boolean
  ): DTOs.SecurityDefinitionConfiguratorDTO {
    const object: DTOs.SecurityDefinitionConfiguratorDTO = {
      data: {
        filterSearchInputValue: '',
        definitionList: ConfiguratorDefinitionLayout.map((eachBundle) => {
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
        showLongFilterOptions: false,
        isLoading: false,
        isLoadingLongOptionListFromServer: false,
        noMainCTA: !!noMainCTA
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

  public formQuantComparerObject(
    isStencil: boolean,
    quantMetricType: string,
    BEdto: BEModels.BEBestQuoteDTO,
    securityCard: DTOs.SecurityDTO,
    axeOnly: boolean
  ): DTOs.QuantComparerDTO {
    if (isStencil) {
      const stencilObject: DTOs.QuantComparerDTO = {
        data: {
          driverType: 'Spread',
          delta: 0,
          mid: 0,
          bid: {
            number: 33,
            displayNumber: '33',
            broker: 'GS',
            size: null
          },
          offer: {
            number: 33,
            displayNumber: '33',
            broker: 'JPM',
            size: null
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
          askIsStale: false
        }
      };
      return stencilObject;
    } else {
      const driverType = quantMetricType;
      const backendTargetQuoteAttr = TriCoreDriverConfig[driverType]['backendTargetQuoteAttr'];
      if (!!BEdto && !!BEdto[backendTargetQuoteAttr]) {
        const rawData = BEdto[backendTargetQuoteAttr];
        return this.populateQuantCompareObject(
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

  private populateQuantCompareObject(
    rawData: BEModels.BESingleBestQuoteDTO,
    driverType: string,
    securityCard: DTOs.SecurityDTO,
    axeOnly: boolean
  ): DTOs.QuantComparerDTO {
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
      const object: DTOs.QuantComparerDTO = {
        data: {
          driverType: driverType,
          delta: delta,
          mid: mid,
          bid: {
            number: !!bidNumber ? parseFloat(bidNumber) : null,
            displayNumber: bidNumber,  // not been used right now but could come in handy
            broker: bidDealer,
            size: bidSize
          },
          offer: {
            number: !!offerNumber ? parseFloat(offerNumber) : null,
            displayNumber: offerNumber,  // not been used right now but could come in handy
            broker: askDealer,
            size: offerSize
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
          askIsStale: askIsStale
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
        isQuantVariant: !!stub.content.isForQuantComparer,
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
        historicalTradeVisualizer: this.formHistoricalTradeObject(securityDTO)
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
    quantComparerDTO: DTOs.QuantComparerDTO,
    alertDTO: DTOs.AlertDTO
  ): DTOs.SecurityTableCellDTO {
    const object: DTOs.SecurityTableCellDTO = {
      data: {
        textData: !!isStencil ? 'PLACE' : textData,
        quantComparerDTO: quantComparerDTO,
        alertSideDTO: null,
        alertStatusDTO: null
      },
      state: {
        isQuantVariant: targetHeader.state.isQuantVariant,
        quantComparerUnavail: false,
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
          rawTime: ''
        },
        ask: {
          isAxe: false,
          size: '150',
          price: 100,
          yield: 5,
          tspread: 300,
          benchmark: bidBenchmark,
          time: '12:01',
          rawTime: ''
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
        isCDSVariant: false
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
        rawTime: rawData.bidTime.slice(0, 19)  // remove timezone
      };
      object.data.ask = {
        isAxe: rawData.quoteType === SECURITY_TABLE_QUOTE_TYPE_AXE,
        size: !!rawData.askQuantity ? this.utility.parsePositionToMM(rawData.askQuantity, false) : null,
        price: !!rawData.askPrice ? this.utility.parseTriCoreDriverNumber(rawData.askPrice, TriCoreDriverConfig.Price.label, targetSecurity, false) as number : null,
        yield: !!rawData.askYield ? this.utility.parseTriCoreDriverNumber(rawData.askYield, TriCoreDriverConfig.Yield.label, targetSecurity, false) as number : null,
        tspread: !!rawData.askSpread ? this.utility.parseTriCoreDriverNumber(rawData.askSpread, TriCoreDriverConfig.Spread.label, targetSecurity, false) as number : null,
        benchmark: askBenchmark,
        time: this.utility.isQuoteTimeValid(rawData.askTime) && hasAsk ? moment(rawData.askTime).format('HH:mm') : '',
        rawTime: rawData.askTime.slice(0, 19)  // remove timezone
      };
      this.utility.highlightSecurityQutoe(object, targetRow);
      object.state.isBidDownVoted = rawData.bidQuoteStatus < 0;
      object.state.isAskDownVoted = rawData.askQuoteStatus < 0;
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
        timeSeries: []
      },
      style: {
        leftGap: 10,
        leftEdge: 20,
        moveDistance: 40,
        rightEdge: 20,
        rightGap: 10,
        endPinLocation: 70
      },
      state: {
        isInversed: false,
        isInvalid: false,
        isPlaceholder: false,
        isStencil: !!isStencil,
        isColorCodeInversed: false
      }
    };
    if (!isStencil) {
      if (rawData != null) {
        object.data.start = rawData.startMetric != null ? this.utility.round(rawData.startMetric) : null;
        object.data.end = rawData.endMetric != null ? this.utility.round(rawData.endMetric) : null;
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
      } else {
        object.data.start = null;
        object.data.end = null;
        object.state.isInvalid = true;
      }
    }
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
        isMarketListTraded: false
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
        isExpired: false
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
    const momentTime = moment(rawData.timeStamp);
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
        isTrade: type === AlertTypes.tradeAlert
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

  public formStructureBreakdownObject(portfolioBreakdown: BEModels.BEStructuringBreakdownBlock ) {
    const object: DTOs.PortfolioBreakdownDTO = {
      data: {
        groupOption: portfolioBreakdown.groupOption,
        breakdown: portfolioBreakdown.breakdown,
        breakdownLevel2: null,
        breakdownLevel3: null
      },
      style: {
        icon: ''
      },
      state: {
        isEditing: false,
        isStencil: false
      }
    }
    return object;
  }

  public formStructureFundObject(rawConfig: BEModels.BEPortfolioStructuringBlock) {
    const object: DTOs.PortfolioStructureDTO = {
      data: {
        rpPortfolioDate: rawConfig.rpPortfolioDate,
        portfolioId: rawConfig.portfolioId,
        portfolioShortName: rawConfig.portfolioShortName,
        portfolioNav: rawConfig.portfolioNav,
        target: {
          portfolioTargetId: rawConfig.target.portfolioTargetId,
          date: rawConfig.target.date,
          portfolioId: rawConfig.target.portfolioId,
          target: {
            cs01: rawConfig.target.target.cs01,
            leverageValue: rawConfig.target.target.leverageValue
          }
        },
        currentTotals :{
          cs01: rawConfig.currentTotals.cs01,
          leverageValue: rawConfig.currentTotals.leverageValue
        },
        indexId: rawConfig.indexId,
        indexShortName: rawConfig.indexShortName,
        indexNav: rawConfig.indexNav,
        indexTotals: {
          cs01: rawConfig.indexTotals.cs01,
          leverageValue: rawConfig.indexTotals.leverageValue
        },
        children: [],
        overrides: rawConfig.overrides,
        cs01TotalsInK: {
          currentTotal: null,
          targetTotal: null
        }
      },
      api: {
        onSubmitMetricValues: null,
        convertToK: null
      },
      state: {
        isEditing: false,
        isStencil: false
      }
    }
    return object;
  }
}
