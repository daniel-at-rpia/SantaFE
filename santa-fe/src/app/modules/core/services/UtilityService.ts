  // dependencies
    import { Injectable } from '@angular/core';
    import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

    import * as _ from 'lodash';
    import * as moment from 'moment';
    import uuid from 'uuidv4';

    import {
      BESecurityDTO,
      BESecurityDeltaMetricDTO,
      BESecurityGroupDTO,
      BEStructuringOverrideBlock,
      BEStructuringBreakdownBlock
    } from 'BEModels/backend-models.interface';
    import * as DTOs from 'FEModels/frontend-models.interface';
    import {
      SecurityGroupMetricBlock,
      SecurityGroupMetricPackBlock,
      SecurityCostPortfolioBlock
    } from 'FEModels/frontend-blocks.interface';
    import { DefinitionConfiguratorEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      GroupMetricOptions
    } from 'Core/constants/marketConstants.constant';
    import {
      QUANT_COMPARER_PERCENTILE,
      SecurityMetricOptions,
      FrontendKayToBackendKeyDictionary,
      BackendKeyToDisplayLabelDictionary,
      TriCoreDriverConfig,
      DEFAULT_DRIVER_IDENTIFIER,
      AlertTypes,
      AlertSubTypes
    } from 'Core/constants/coreConstants.constant';
    import { CountdownPipe } from 'App/pipes/Countdown.pipe';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
  // dependencies

@Injectable()
export class UtilityService {
  // Any code about naming stuff goes into this service
  groupGroupMetricOptions = GroupMetricOptions;
  securityMetricOptions = SecurityMetricOptions;
  keyDictionary = FrontendKayToBackendKeyDictionary;
  labelDictionary = BackendKeyToDisplayLabelDictionary;
  triCoreDriverConfig = TriCoreDriverConfig;
  definitionMap = SecurityDefinitionMap;

  constructor(
    private countdownPipe: CountdownPipe,
    private domSanitizer: DomSanitizer
  ){}

  // shared
    public deepCopy(input): any {
      if (!!input) {
        return _.cloneDeep(input);
      } else {
        return null;
      }
    }

    public removePropertyFromObject(targetObject: any, targetProperty: string): any {
      if (!!targetObject && !!targetProperty) {
        return _.omit(targetObject, targetProperty);
      } else {
        return null;
      }
    }

    public round(input, precision = 0): any {
      return _.round(input, precision);
    }

    public generateUUID() {
      if (typeof uuid === 'undefined') {
        return 'n/a';
      } else {
        return uuid();
      }
    }

    public mapSeniorities(input): number {
      switch (input) {
        case "Secured":
          return 1;
        case "SECURED":
          return 1;
        case "1st Lien Secured":
          return 1;
        case "1st lien":
          return 1;
        case "2nd lien":
          return 1;
        case "2nd Lien Secured":
          return 1;
        case "3rd lien":
          return 1;
        case "Asset Backed":
          return 1;
        case "Sr Preferred":
          return 2;
        case "Sr Unsecured":
          return 2;
        case "Sr Non Preferred":
          return 2;
        case "Unsecured":
          return 2;
        case "SR":  // this is for CDS
          return 2;
        case "SLA":
          return 3;
        case "Sr Subordinated":
          return 4;
        case "Subordinated":
          return 4;
        case "SUB":  // this is for SUB
          return 4;
        case "Jr Subordinated":
          return 4;
        case "Subordinated Unsecured":
          return 4;
        case "Jr Subordinated Unsecured":
          return 4;
        case "Preferred":
          return 4;
        default:
          return 5;
      }
    }

    public convertSenioritiesToAcronyms(input): string {
      switch (input) {
        case "1st Lien Secured":
          return '1-LS';
        case "1st lien":
          return '1-L';
        case "2nd lien":
          return '2-L';
        case "2nd lien Secured":
          return '2-LS';
        case "Secured":
          return 'S';
        case "Asset Backed":
          return 'A-B';
        case "Sr Unsecured":
          return 'S-U';
        case "Sr Subordinated":
          return 'S-S';
        case "Subordinated":
          return 'So';
        case "Jr Subordinated":
          return 'J-So';
        case "Sr Preferred":
          return 'S-P';
        case "Preferred":
          return 'P';
        case "Sr Non Preferred":
          return 'S-NP';
        case "Unsecured":
          return 'U';
        default:
          return input;
      }
    }

    public mapRatings(input): number {
      switch (input) {
        case 'AAA':
          return 1;
        case 'AA':
          return 2;
        case 'A':
          return 3;
        case 'BBB':
          return 4;
        case 'BB':
          return 5;
        case 'B':
          return 6;
        case 'CCC':
          return 7;
        case 'CC':
          return 7;
        case 'C':
          return 7;
        case 'D':
          return 7;
        default:
          return 0;
      }
    }

    public isIG(input: string): boolean {
      if (input === 'AAA' || input === 'AA' || input === 'A' || input === 'BBB') {
        return true;
      } else {
        return false;
      }
    }

    public isCDS(
      isGroup: boolean,
      input: DTOs.SecurityGroupDTO | BESecurityGroupDTO | DTOs.SecurityDTO | BESecurityDTO
    ): boolean {
      if (!input) {
        return false;
      }
      if (isGroup) {
        if (input['data']) {
          const dtoInput = input as DTOs.SecurityGroupDTO;
          return dtoInput.data.name.indexOf('Cds') >= 0;
        } else {
          const rawDataInput = input as BESecurityGroupDTO;
          return rawDataInput.name.indexOf('Cds') >= 0;
        }
      } else {
        if (input['data']) {
          const dtoInput = input as DTOs.SecurityDTO;
          return dtoInput.data.name.indexOf('CDS') >= 0;
        } else {
          const rawDataInput = input as BESecurityDTO;
          return rawDataInput.name.indexOf('CDS') >= 0;
        }
      }
    }

    public isFloat(
      isGroup: boolean,
      input: DTOs.SecurityGroupDTO | BESecurityGroupDTO | DTOs.SecurityDTO | BESecurityDTO
    ): boolean {
      if (isGroup) {
        if (input['data']) {
          const dtoInput = input as DTOs.SecurityGroupDTO;
          return dtoInput.data.definitionConfig['CouponType'] && dtoInput.data.definitionConfig['CouponType'] === ['Float'];
        } else {
          const rawDataInput = input as BESecurityGroupDTO;
          return rawDataInput.groupIdentifier.groupOptionValues['CouponType'] && rawDataInput.groupIdentifier.groupOptionValues['CouponType'] === ['Float'];
        }
      } else {
        if (input['data']) {
          return false;  // TODO: haven't isFloat in FE yet
        } else {
          const rawDataInput = input as BESecurityDTO;
          return rawDataInput.metrics && rawDataInput.metrics.Default ? rawDataInput.metrics.Default.isFloat : false;
        }
      }
    }

    public mapRatingsReverse(input): string {
      switch (input) {
        case 1:
          return 'AAA';
        case 2:
          return 'AA';
        case 3:
          return 'A';
        case 4:
          return 'BBB';
        case 5:
          return 'BB';
        case 6:
          return 'B';
        case 7:
          return 'CCC';
        default:
          return 'na';
      }
    }

    public convertBEKey(backendKey: string): string {
      for (const eachKey in this.keyDictionary){
        if (this.keyDictionary[eachKey] === backendKey) {
          return eachKey;
        }
      }
      return null;
    }

    public convertFEKey(frontendKey: string): string {
      if (!!this.keyDictionary[frontendKey]) {
        return this.keyDictionary[frontendKey];
      } else {
        return 'n/a';
      }
    }

    public convertBEKeyToLabel(backendKey: string): string{
      if (!!this.labelDictionary[backendKey]) {
        return this.labelDictionary[backendKey];
      } else {
        return backendKey;
      }
    }

    public convertLabelToBEKey(label: string): string{
      for (const eachKey in this.labelDictionary){
        if (this.labelDictionary[eachKey] === label) {
          return eachKey;
        }
      }
      return null;
    }

    public convertBETenorToFE(backendTenor: string): string {
      switch (backendTenor) {
        case "3M":
          // code...
          return '0.25Y';
        case "6M":
          // code...
          return '0.5Y';
        case "9M":
          // code...
          return '0.75Y';
        default:
          return backendTenor;
      }
    }

    public packMetricData(rawData: BESecurityGroupDTO | BESecurityDTO): SecurityGroupMetricPackBlock {
      const object: SecurityGroupMetricPackBlock = {
        raw: {},
        delta: {
          Dod: {},
          Wow: {},
          Mom: {},
          Ytd: {},
          Yoy: {}
        }
      };
      if (!!rawData && !!rawData.deltaMetrics && !!rawData.metrics) {
        const isGroup = !!rawData['groupIdentifier'];
        const metricList = isGroup ? this.groupGroupMetricOptions : this.securityMetricOptions;
        metricList.forEach((eachMetric) => {
          let keyToRetrieveMetric = eachMetric.backendDtoAttrName;
          if (eachMetric.label === 'Default Spread') {
            keyToRetrieveMetric = 'spread';
            // this logic is disabled, since after BE cut off Citi, we no longer have those spread metrics
            // if (this.isCDS(isGroup, rawData)) {
            //   keyToRetrieveMetric = 'spread';
            //  } else if (this.isFloat(isGroup, rawData)) {
            //    keyToRetrieveMetric = 'zSpread';
            // } else {
            //   keyToRetrieveMetric = 'gSpread';
            // }
          };
          const rawValue = rawData.metrics && rawData.metrics['Index'] ? rawData.metrics['Index'][keyToRetrieveMetric] : null;
          if (rawValue === null || rawValue === undefined) {
            object.raw[eachMetric.label] = null;
          } else {
            object.raw[eachMetric.label] = rawValue;
          }
          eachMetric.deltaOptions.forEach((eachDeltaScope) => {
            const deltaSubPack = rawData.deltaMetrics[eachDeltaScope];
            const deltaValue = !!deltaSubPack ? deltaSubPack[keyToRetrieveMetric] : null;
            if (deltaValue === null || deltaValue === undefined) {
              object.delta[eachDeltaScope][eachMetric.label] = null;
            } else {
              object.delta[eachDeltaScope][eachMetric.label] = deltaValue;
            }
          })
        });
      }
      return object;
    }

    public extractSecurityId(input: string): string {
      if (!!input) {
        // const removeBackslash = input.replace("\\", '');
        // const startWithNumber = input.replace(`{"SecurityId":`, '');
        // return parseInt(startWithNumber);
        return input;
      } else {
        return null;
      }
    }

    public findPercentile(list: Array<number>, percentile: number): number {
      const arrayLength = list.length;
      const copyList: Array<number> = this.deepCopy(list);
      copyList.sort((valueA, valueB) => {
        if (!!valueA && !valueB) {
          return -4;
        } else if (!valueA && !!valueB) {
          return 4;
        } else if (valueA < valueB) {
          return 1;
        } else if (valueA > valueB) {
          return -1;
        } else {
          return 0;
        }
      });
      const cutAmount = Math.floor(arrayLength / 100 * percentile);
      const startPoint = Math.floor((arrayLength - cutAmount)/2);
      const percentileList = copyList.splice(startPoint, Math.ceil(cutAmount/2));
      return percentileList[0];
    }

    public applyShortcutToConfigurator(
      targetShortcut: DTOs.SearchShortcutDTO,
      targetConfigurator: DTOs.SecurityDefinitionConfiguratorDTO
    ): DTOs.SecurityDefinitionConfiguratorDTO {
      const newConfig = this.deepCopy(targetConfigurator);
      const shortcutCopy = this.deepCopy(targetShortcut);
      shortcutCopy.data.configuration.forEach((eachShortcutDef) => {
        newConfig.data.definitionList.forEach((eachBundle) => {
          eachBundle.data.list.forEach((eachDefinition) => {
            if (eachDefinition.data.key === eachShortcutDef.data.key) {
              eachDefinition.data.filterOptionList = eachShortcutDef.data.filterOptionList;
              eachDefinition.state.groupByActive = eachShortcutDef.state.groupByActive;
              eachDefinition.state.filterActive = eachShortcutDef.state.filterActive;
            }
          });
        });
      });
      return newConfig;
    }

    public packDefinitionConfiguratorEmitterParams(
      configuratorData: DTOs.SecurityDefinitionConfiguratorDTO
    ): DefinitionConfiguratorEmitterParams {
      const params: DefinitionConfiguratorEmitterParams = {
        filterList: []
      };
      configuratorData.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list.forEach((eachDefinition) => {
          const activeFilters = eachDefinition.data.filterOptionList.filter((eachOption) => {
            return eachOption.isSelected;
          });
          activeFilters.length > 0 && params.filterList.push({
            key: eachDefinition.data.key,
            targetAttribute: eachDefinition.data.securityDTOAttr,
            filterBy: activeFilters.map((eachFilter) => {
              return eachFilter.displayLabel;
            })
          });
        });
      });
      return params;
    }

    public findDefinitionKeyFromSecurityDTOAttr(attr: string): string {
      let targetKey = null;
      for (let eachKey in this.definitionMap) {
        if (!!this.definitionMap[eachKey] && this.definitionMap[eachKey].securityDTOAttr === attr) {
          targetKey = eachKey;
        }
      }
      return targetKey;
    }

    public skewedNumber(input: number): number {
      return input * input;
    }

    public caseInsensitiveKeywordMatch(targetText: string, keyword: string): boolean {
      if (targetText === null) {
        return false;
      } else if ((!!targetText || targetText === '') && !!keyword && keyword.length >= 2) {
        const targetTextUpperCase = targetText.toUpperCase();
        const keywordUpperCase = keyword.toUpperCase();
        return targetTextUpperCase.indexOf(keywordUpperCase) >= 0;
      } else {
        return true;
      }
    }

    public parseTriCoreDriverNumber(
      targetNumber,
      targetDriver: string,
      targetSecurity: DTOs.SecurityDTO,
      isToFixed: boolean
    ): number|string {
      if (targetNumber != null && !!targetDriver) {
        if (targetDriver === 'YieldWorst') {
          targetDriver = TriCoreDriverConfig.Yield.label;
        } else if (targetDriver === TriCoreDriverConfig.Spread.driverLabel) {
          targetDriver = TriCoreDriverConfig.Spread.label;
        }
        const rounding = TriCoreDriverConfig[targetDriver] ? TriCoreDriverConfig[targetDriver].rounding : 0;
        if (isToFixed) {
          if (targetSecurity.data.isGovt && targetDriver === TriCoreDriverConfig.Spread.label) {
            return this.round(targetNumber, rounding + 1).toFixed(rounding + 1);
          } else {
            return this.round(targetNumber, rounding).toFixed(rounding);
          }
        } else {
          if (targetSecurity.data.isGovt && targetDriver === TriCoreDriverConfig.Spread.label) {
            return this.round(targetNumber, rounding + 1);
          } else {
            return this.round(targetNumber, rounding);
          }
        }
      } else {
        return null;
      }
    }

    public mapAlertType(targetType: string): AlertTypes {
      switch (targetType) {
        case AlertTypes.axeAlert:
          return AlertTypes.axeAlert;
        case AlertTypes.markAlert:
          return AlertTypes.markAlert;
        case AlertTypes.tradeAlert:
          return AlertTypes.tradeAlert;
        default:
          return AlertTypes.system;
      }
    }

    public mapAlertSubType(targetType: string): AlertSubTypes {
      switch (targetType) {
        case AlertSubTypes.ask:
          return AlertSubTypes.ask;
        case AlertSubTypes.bid:
          return AlertSubTypes.bid;
        case AlertSubTypes.both:
          return AlertSubTypes.default;  // both is not a valid type in FE
        case AlertSubTypes.liquidation:
          return AlertSubTypes.default;  // liquidation is not a valid type in FE
        case AlertSubTypes.quantityChange:
          return AlertSubTypes.quantityChange;
        case AlertSubTypes.ratingChange:
          return AlertSubTypes.ratingChange;
        case AlertSubTypes.buy:
          return AlertSubTypes.buy;
        case AlertSubTypes.sell:
          return AlertSubTypes.sell;
        default:
          return AlertSubTypes.default;
      }
    }

    public parseCountdown(value: moment.Moment) {
      return this.countdownPipe.transform(value);
    }

    public parseNumberToCommas(value: number): string {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  // shared end

  // market specific
    public normalizeDefinitionFilterOption(rawString): string {
      return rawString;//.replace(' ', '');
    }

    public formDefinitionFilterOptionKey(name, normalizedOption): string {
      return `${name}/${normalizedOption}`;
    }

    public retrieveGroupMetricValue(metricDTO: SecurityGroupMetricBlock, groupDTO: DTOs.SecurityGroupDTO): number {
      if (!!groupDTO && !!metricDTO) {
        const driverLabel = metricDTO.label;
        let value, deltaSubPack;
        if (!!metricDTO.deltaScope) {
          deltaSubPack = groupDTO.data.metricPack.delta[metricDTO.deltaScope];
          value = !!deltaSubPack ? deltaSubPack[driverLabel] : null;
          value = Math.round(value*10)/10;
        } else {
          value = groupDTO.data.metricPack.raw[driverLabel];
          value = Math.round(value);
        }
        return value;
      }
      return null;
    }

    public retrievePrimaryMetricValue(rawData: BESecurityGroupDTO): string {
      let value = `n/a`;
      if (!!rawData) {
        // disable the automatic differentiation betwen IG & HY
        // const rating = rawData.metrics[this.keyDictionary.RATING];
        // if (this.isIG(rating)) {
        const spread = rawData.metrics ? rawData.metrics[this.keyDictionary.SPREAD] : null;
        value = `${Math.round(spread)}`;
        // } else {
        //   const price = rawData.metrics[this.keyDictionary.PRICE];
        //   const yieldVal = rawData.metrics[this.keyDictionary.YIELD];
        //   value = `${Math.round(price*100)/100} / ${Math.round(yieldVal*100)/100}`;
        // }
      }
      return value;
    }

    public retrieveRawSupportingDataForLeftPie(rawData: BESecurityGroupDTO): object {
      // if (!!rawData && !!rawData.descriptiveMetrics) {
      //   const object = rawData.descriptiveMetrics[this.keyDictionary.RATING];
      //   if (!!object) {
      //     return object;
      //   } else {
      //     return {};
      //   }
      // } else {
        return {}
      // }
    }

    public retrieveRawSupportingDataForRightPie(rawData: BESecurityGroupDTO): object {
      // if (!!rawData && !!rawData.descriptiveMetrics) {
      //   const object = rawData.descriptiveMetrics[this.keyDictionary.SENIORITY];
      //   if (!!object) {
      //     return object;
      //   } else {
      //     return {};
      //   }
      // } else {
        return {}
      // }
    }

    public retrieveValueForGroupPieChartFromSupportingData(supportingDataChunk): number {
      //if (!!supportingDataChunk && !!supportingDataChunk["propertyToNumSecurities"]) {
        //const count = supportingDataChunk["propertyToNumSecurities"]["WorkoutTerm"];
      if (!!supportingDataChunk) {
        const weight = supportingDataChunk[this.keyDictionary.SIZE];
        const value = Math.round(weight/1000000);
        if (!!value) {
          return value;
        } else {
          return 0
        }
      } else {
        return 0;
      }
    }

    public flattenDefinitionList(configurator: DTOs.SecurityDefinitionConfiguratorDTO): Array<DTOs.SecurityDefinitionDTO> {
      const flattenDefinitionList = [];
      configurator.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list.forEach((eachDefinition) => {
          flattenDefinitionList.push(eachDefinition);
        });
      });
      return flattenDefinitionList;
    }
  // market specific end

  // trade specific

    public parsePositionToMM(position: number, hasUnitSuffix: boolean, enableNull?: boolean): string {
      const value = this.round(position/1000000, 2).toFixed(2);
      if (!!enableNull && position == 0) {
        return null;
      } else {
        return !!hasUnitSuffix ? `${value}MM` : `${value}`;
      }
    }

    public parseNumberToThousands(number: number, hasUnitSuffix: boolean, decimal: number = 1): string {
      const value = this.round(number/1000, decimal).toFixed(decimal);
      if (value === 0) {
        return null;
      } else {
        return !!hasUnitSuffix ? `${value}K` : `${value}`;
      }
    }

    // TODO: move this into a SecurityTableHelper service
    public populateSecurityTableCellFromSecurityCard(
      targetHeader: DTOs.SecurityTableHeaderDTO,
      targetRow: DTOs.SecurityTableRowDTO,
      newCellDTO: DTOs.SecurityTableCellDTO,
      triCoreMetric: string
    ): DTOs.SecurityTableCellDTO {
      if (targetHeader.state.isBestQuoteVariant) {
        let targetDriver = triCoreMetric;
        if (triCoreMetric === DEFAULT_DRIVER_IDENTIFIER) {
          targetDriver = this.findSecurityTargetDefaultTriCoreDriver(targetRow.data.security);
        }
        if (!!targetDriver) {
          const targetQuantLocationFromRow = TriCoreDriverConfig[targetDriver].backendTargetQuoteAttr;
          newCellDTO.data.bestQuoteComparerDTO = targetRow.data.bestQuotes[targetHeader.data.blockAttrName][targetQuantLocationFromRow];
        } else {
          newCellDTO.data.bestQuoteComparerDTO = null;
        }
        if (targetHeader.data.key === 'bestQuote') {
          this.populateMarkDataInSecurityCardWithBestQuoteData(
            targetRow.data.security,
            newCellDTO,
            targetDriver
          );
        }
        return newCellDTO;
      } else {
        let value;
        value = this.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, targetRow.data.security, false);
        newCellDTO.data.textData = value;
        return newCellDTO;
      }
    }

    private populateMarkDataInSecurityCardWithBestQuoteData(
      targetSecurity: DTOs.SecurityDTO,
      newCellDTO: DTOs.SecurityTableCellDTO,
      targetDriver: string
    ) {
      // only show mark if the current selected metric is the mark's driver, unless the selected metric is default
      if ( targetSecurity.data.mark.markDriver === targetDriver ) {
        targetSecurity.data.mark.markRaw = targetSecurity.data.mark.markBackend;
        const validMetricFromDriver = this.findSecurityTargetDefaultTriCoreDriver(targetSecurity);
        const number = this.parseTriCoreDriverNumber(targetSecurity.data.mark.markRaw, validMetricFromDriver, targetSecurity, true) as string;
        targetSecurity.data.mark.mark = targetSecurity.data.mark.markRaw > 0 ? number : null;
      } else {
        targetSecurity.data.mark.markRaw = null;
        targetSecurity.data.mark.mark = null;
      }
      this.calculateMarkDiscrepancies(
        targetSecurity,
        newCellDTO.data.bestQuoteComparerDTO,
        targetDriver
      );
      if (!!newCellDTO.data.bestQuoteComparerDTO) {
        if (newCellDTO.data.bestQuoteComparerDTO.state.hasBid) {
          targetSecurity.data.bestQuote.bid = newCellDTO.data.bestQuoteComparerDTO.data.bid.number;
          targetSecurity.data.bestQuote.displayBid = newCellDTO.data.bestQuoteComparerDTO.data.bid.displayNumber;
        } else {
          targetSecurity.data.bestQuote.bid = null;
          targetSecurity.data.bestQuote.displayBid = null;
        }
        if (newCellDTO.data.bestQuoteComparerDTO.state.hasOffer) {
          targetSecurity.data.bestQuote.ask = newCellDTO.data.bestQuoteComparerDTO.data.offer.number;
          targetSecurity.data.bestQuote.displayAsk = newCellDTO.data.bestQuoteComparerDTO.data.offer.displayNumber;
        } else {
          targetSecurity.data.bestQuote.ask = null;
          targetSecurity.data.bestQuote.displayAsk = null;
        }
      }
    }

    // TODO: move this into a SecurityTableHelper service
    public retrieveAttrFromSecurityBasedOnTableHeader(
      targetHeader: DTOs.SecurityTableHeaderDTO,
      securityCard: DTOs.SecurityDTO,
      isRetrievingUnderlineValue: boolean
    ): any {
      if (!!targetHeader && !!securityCard) {
        if (!!targetHeader.data.blockAttrName) {
          if (targetHeader.data.blockAttrName === 'metricPack') {
            return this.retrieveSecurityMetricFromMetricPack(securityCard, targetHeader);
          } else if (targetHeader.data.blockAttrName === 'cost') {
            return this.retrieveSecurityMetricFromCostPack(securityCard, targetHeader);
          } else {
            return isRetrievingUnderlineValue ? securityCard.data[targetHeader.data.blockAttrName][targetHeader.data.underlineAttrName] : securityCard.data[targetHeader.data.blockAttrName][targetHeader.data.attrName];
          }
        } else {
          return isRetrievingUnderlineValue ? securityCard.data[targetHeader.data.underlineAttrName] : securityCard.data[targetHeader.data.attrName];
        }
      } else {
        return null;
      }
    }

    // TODO: move this into a SecurityTableHelper service
    private retrieveSecurityMetricFromMetricPack(dto: DTOs.SecurityDTO, header: DTOs.SecurityTableHeaderDTO): number {
      if (!!dto && !!header) {
        if (header.data.key === 'indexMark') {
          if (!dto.data.hasIndex) {
            return null;
          }
        }
        let attrName = header.data.attrName;
        let underlineAttrName = header.data.underlineAttrName;
        if ( header.data.isDriverDependent && header.data.isAttrChangable && attrName === DEFAULT_DRIVER_IDENTIFIER ) {
          // when the metric is set to default, the actual metric to be used for each row depends on the driver of the mark of that particular row
          const targetDriver = this.findSecurityTargetDefaultTriCoreDriver(dto);
          attrName = TriCoreDriverConfig[targetDriver].driverLabel;
          underlineAttrName = TriCoreDriverConfig[targetDriver].driverLabel;
        }
        const driverLabel = attrName;
        let value, deltaSubPack;
        if (!!header.data.metricPackDeltaScope) {
          deltaSubPack = dto.data.metricPack.delta[header.data.metricPackDeltaScope];
          value = !!deltaSubPack ? deltaSubPack[driverLabel] : null;
        } else {
          value = dto.data.metricPack.raw[driverLabel];
        }
        if (header.data.isDriverDependent && header.data.isAttrChangable) {
          value = this.parseTriCoreDriverNumber(value, attrName, dto, false);
        }
        return value;
      } else {
        return null;
      }
    }

    // TODO: move this into a SecurityTableHelper service
    private retrieveSecurityMetricFromCostPack(
      dto: DTOs.SecurityDTO,
      header: DTOs.SecurityTableHeaderDTO
    ): number {
      if (!!dto && !!header) {
        let targetBlock = null;
        if (header.data.key === 'costCurrentFifo' || header.data.key === 'costCurrentWeightedAvg') {
          // TODO: at the moment this variable is really just "filtered portfolios", so a value of empty string means include every portfolio, this will be changed once we start support entire security universe
          if (header.data.activePortfolios.length > 0) {
            targetBlock = dto.data.cost.current;
            header.data.activePortfolios.forEach((eachPortfolio) => {
              const portfolioExist = dto.data.portfolios.find((eachPortfolioBlock) => {
                return eachPortfolioBlock.portfolioName === eachPortfolio;
              });
              if (!!portfolioExist) {
                dto.data.cost.current.fifo['Default Spread'] = dto.data.cost.current.fifo['Default Spread'] + portfolioExist.costFifoSpread;
                dto.data.cost.current.fifo.Price = dto.data.cost.current.fifo.Price + portfolioExist.costFifoPrice;
                dto.data.cost.current.weightedAvg['Default Spread'] = dto.data.cost.current.weightedAvg['Default Spread'] + portfolioExist.costFifoSpread;
                dto.data.cost.current.weightedAvg.Price = dto.data.cost.current.weightedAvg.Price + portfolioExist.costFifoPrice;
              }
            });
          } else {
            targetBlock = dto.data.cost.firm;
          }
        } else {
          targetBlock = this.determineCostPortfolioForRetrieveSecurityMetricFromCostPack(dto, header);
        }
        if (!!targetBlock) {
          const isFifo = header.data.key.indexOf('Fifo') >= 0;
          const targetInnerBlock = isFifo ? targetBlock.fifo : targetBlock.weightedAvg;
          const targetAttr = 
            header.data.underlineAttrName !== DEFAULT_DRIVER_IDENTIFIER 
              ? header.data.underlineAttrName 
              : dto.data.mark.markDriver === this.triCoreDriverConfig.Price.label
                ? this.triCoreDriverConfig.Price.driverLabel 
                : this.triCoreDriverConfig.Spread.driverLabel;
          if (targetInnerBlock[targetAttr] !== undefined) {
            return targetInnerBlock[targetAttr];
          } else {
            // yield is totally fine, means the user is switched to yield driver
            if (targetAttr !== this.triCoreDriverConfig.Yield.driverLabel) {
              console.warn('at retrieve security metric from cost pack, target block does not have targetAttr', dto, targetBlock, targetAttr);
            }
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    private determineCostPortfolioForRetrieveSecurityMetricFromCostPack(
      dto: DTOs.SecurityDTO,
      header: DTOs.SecurityTableHeaderDTO
    ): SecurityCostPortfolioBlock {
      if (header.data.key.indexOf('DOF') >= 0) {
        return dto.data.cost.DOF;
      } else if (header.data.key.indexOf('SOF') >= 0) {
        return dto.data.cost.SOF;
      } else if (header.data.key.indexOf('STIP') >= 0) {
        return dto.data.cost.STIP;
      } else if (header.data.key.indexOf('FIP') >= 0) {
        return dto.data.cost.FIP;
      } else if (header.data.key.indexOf('CIP') >= 0) {
        return dto.data.cost.CIP;
      } else if (header.data.key.indexOf('AGB') >= 0) {
        return dto.data.cost.AGB;
      } else if (header.data.key.indexOf('BBB') >= 0) {
        return dto.data.cost.BBB;
      } else {
        console.warn('At determine cost portfolio, looking for a portfolio that does not exist', header.data.key);
        return null;
      }
    }

    // TODO: move this into a SecurityTableHelper service
    public calculateMarkDiscrepancies(
      targetSecurity: DTOs.SecurityDTO,
      targetQuant: DTOs.BestQuoteComparerDTO,
      activeDriver: string
    ) {
      const markBlock = targetSecurity.data.mark;
      if (targetSecurity.data.mark.markRaw) {
        if (!!targetQuant) {
          const targetDriver = targetSecurity.data.mark.markDriver;
          if (targetQuant.state.hasBid) {
            markBlock.markDisBidRaw = markBlock.markRaw - targetQuant.data.bid.number;
            if (this.isCDS(false, targetSecurity)) {
              markBlock.markDisBidRaw = -markBlock.markDisBidRaw;
            }
            if (targetDriver === this.triCoreDriverConfig.Price.driverLabel) {
              markBlock.markDisBidRaw = -markBlock.markDisBidRaw;
            }
            markBlock.markDisBid = this.parseTriCoreDriverNumber(markBlock.markDisBidRaw, targetDriver, targetSecurity, true) as string;
            if ((!this.isCDS(false, targetSecurity) && targetSecurity.data.position.positionFirm > 0) || (this.isCDS(false, targetSecurity) && targetSecurity.data.position.positionFirm < 0)) {
              markBlock.markDisLiquidationRaw = markBlock.markDisBidRaw;
              markBlock.markDisLiquidation = markBlock.markDisBid;
            }
          }
          if (targetQuant.state.hasOffer) {
            markBlock.markDisAskRaw = targetQuant.data.offer.number - markBlock.markRaw;
            if (this.isCDS(false, targetSecurity)) {
              markBlock.markDisAskRaw = -markBlock.markDisAskRaw;
            }
            if (targetDriver === this.triCoreDriverConfig.Price.driverLabel) {
              markBlock.markDisAskRaw = -markBlock.markDisAskRaw;
            }
            markBlock.markDisAsk = this.parseTriCoreDriverNumber(markBlock.markDisAskRaw, targetDriver, targetSecurity, true) as string;
            if ((!this.isCDS(false, targetSecurity) && targetSecurity.data.position.positionFirm < 0) || (this.isCDS(false, targetSecurity) && targetSecurity.data.position.positionFirm > 0)) {
              markBlock.markDisLiquidationRaw = markBlock.markDisAskRaw;
              markBlock.markDisLiquidation = markBlock.markDisAsk;
            }
          }
          if (targetQuant.state.hasBid && targetQuant.state.hasOffer) {
            markBlock.markDisMidRaw = !this.isCDS(false, targetSecurity) ? markBlock.markRaw - targetQuant.data.mid : -(markBlock.markRaw - targetQuant.data.mid);
            markBlock.markDisMid = this.parseTriCoreDriverNumber(markBlock.markDisMidRaw, targetDriver, targetSecurity, true) as string;
          }
        }
        if (targetSecurity.data.hasIndex) {
          const driverLabel = TriCoreDriverConfig[activeDriver].driverLabel;
          markBlock.markDisIndexRaw = markBlock.markRaw - targetSecurity.data.metricPack.raw[driverLabel];
          markBlock.markDisIndex = this.parseTriCoreDriverNumber(markBlock.markDisIndexRaw, driverLabel, targetSecurity, true) as string;
        }
      } else {
        markBlock.markDisBid = null;
        markBlock.markDisBidRaw = null;
        markBlock.markDisMid = null;
        markBlock.markDisMidRaw = null;
        markBlock.markDisAsk = null;
        markBlock.markDisAskRaw = null;
        markBlock.markDisLiquidation = null;
        markBlock.markDisLiquidationRaw = null;
        markBlock.markDisIndex = null;
        markBlock.markDisIndexRaw = null;
      }
    }

    public findSecurityTargetDefaultTriCoreDriver(targetSecurity: DTOs.SecurityDTO): string {
      const BEDriver = targetSecurity.data.mark.markDriver;
      switch (BEDriver) {
        case null:
          return 'Spread';
        default:
          return BEDriver;
      }
    }

    public isQuoteTimeValid(timeString: string): boolean {
      if (!!timeString) {
        const newDate = new Date(timeString);
        if (newDate.getSeconds() === 0 && newDate.getMinutes() === 0 && newDate.getHours() === 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }

    public findObligorCouponType(obligorCurveName: string): string {
      if (!!obligorCurveName) {
        const copy: Array<string> = obligorCurveName.split("|");
        if (copy.length >= 3) {
          return copy[2];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    public highlightSecurityQutoe(
      targetQuote: DTOs.SecurityQuoteDTO,
      targetRow: DTOs.SecurityTableRowDTO
    ) {
      const bestQuoteCell = targetRow.data.cells.find((eachCell) => {
        return eachCell.state.isBestQuoteVariant && !eachCell.state.bestQuoteComparerUnavail
      });
      if (bestQuoteCell && bestQuoteCell.data.bestQuoteComparerDTO) {
        const {axe, combined} = targetRow.data.bestQuotes;
        const filteredMetricType = bestQuoteCell.data.bestQuoteComparerDTO.data.driverType;
        const bestAxeBidNum = this.triCoreDriverConfig[filteredMetricType] ? axe[this.triCoreDriverConfig[filteredMetricType].backendTargetQuoteAttr].data.bid.number : null;
        const bestAxeAskNum = this.triCoreDriverConfig[filteredMetricType] ? axe[this.triCoreDriverConfig[filteredMetricType].backendTargetQuoteAttr].data.offer.number : null;
        const bestBidNum = this.triCoreDriverConfig[filteredMetricType] ? combined[this.triCoreDriverConfig[filteredMetricType].backendTargetQuoteAttr].data.bid.number : null;
        const bestAskNum = this.triCoreDriverConfig[filteredMetricType] ? combined[this.triCoreDriverConfig[filteredMetricType].backendTargetQuoteAttr].data.offer.number : null;
        targetQuote.data.currentMetric = filteredMetricType;
        targetQuote.state.filteredByPrice = filteredMetricType === this.triCoreDriverConfig.Price.label;
        targetQuote.state.filteredBySpread = filteredMetricType === TriCoreDriverConfig.Spread.label;
        targetQuote.state.filteredByYield = filteredMetricType === TriCoreDriverConfig.Yield.label;
        targetQuote.state.isBestBid = targetQuote.data.bid.tspread == bestBidNum || targetQuote.data.bid.price == bestBidNum || targetQuote.data.bid.yield == bestBidNum;
        targetQuote.state.isBestOffer = targetQuote.data.ask.tspread == bestAskNum || targetQuote.data.ask.price == bestAskNum || targetQuote.data.ask.yield == bestAskNum;
        if (targetQuote.state.hasBid && targetQuote.data.bid.isAxe) {
          targetQuote.state.isBestAxeBid = bestAxeBidNum && (targetQuote.data.bid.tspread == bestAxeBidNum || targetQuote.data.bid.price == bestAxeBidNum || targetQuote.data.bid.yield == bestAxeBidNum);
        }
        if (targetQuote.state.hasAsk && targetQuote.data.ask.isAxe) {
          targetQuote.state.isBestAxeOffer = bestAxeAskNum && (targetQuote.data.ask.tspread == bestAxeAskNum || targetQuote.data.ask.price == bestAxeAskNum || targetQuote.data.ask.yield == bestAxeAskNum);
        }
      }
    }

    public calculateBestQuoteComparerWidthAndHeightPerSet(list: Array<DTOs.BestQuoteComparerDTO>) {
      const deltaList = [];
      const sizeList = [];
      list.forEach((eachComparer) => {
        if (!!eachComparer && eachComparer.state.hasBid && eachComparer.state.hasOffer) {
          deltaList.push(Math.abs(eachComparer.data.delta));
          sizeList.push(eachComparer.data.bid.size, eachComparer.data.offer.size);
        }
      });
      const maxDelta = this.findPercentile(deltaList, QUANT_COMPARER_PERCENTILE);
      // const maxSize = this.utilityService.findPercentile(sizeList, QUANT_COMPARER_PERCENTILE);
      const maxSize = 50;

      list.forEach((eachComparer) => {
        if (eachComparer.state.hasBid && eachComparer.state.hasOffer) {
          eachComparer.style.lineWidth = this.calculateSingleBestQuoteComparerWidth(eachComparer.data.delta, maxDelta);
        } else {
          eachComparer.style.lineWidth = 15;
        }
        eachComparer.style.bidLineHeight = Math.round(eachComparer.data.bid.size / maxSize * 100);
        eachComparer.style.offerLineHeight = Math.round(eachComparer.data.offer.size / maxSize * 100);
        eachComparer.state.isCalculated = true;
      });
    }

    public parsePureTextToParagraph(rawText: string): SafeHtml {
      // example: '[DM] bought {6MM} in [CIP], {2MM} in [BBB]';
      let parsedString = rawText.replace(/\[/g, '<code>');
      parsedString = parsedString.replace(/\]/g, '</code>');
      parsedString = parsedString.replace(/\{/g, '<kbd>');
      parsedString = parsedString.replace(/\}/g, '</kbd>');
      return this.domSanitizer.bypassSecurityTrustHtml(parsedString);
    } 

    private calculateSingleBestQuoteComparerWidth(delta: number, maxAbsDelta: number): number {
      if (delta < 0) {
        return 100;
      } else {
        const result = 100 - Math.round(delta / maxAbsDelta * 100);
        return result;
      }
    }
  // trade specific end

  // structuring specific
    public formBucketIdentifierForOverride(rawData: BEStructuringOverrideBlock): string {
      const list = [];
      for (let eachIdentifier in rawData.bucket) {
        list.push(eachIdentifier);
      }
      list.sort((identifierA, identifierB) => {
        if (identifierA > identifierB) {
          return 1;
        } else if (identifierB < identifierA) {
          return -1;
        } else {
          return 0;
        }
      });
      let identifier = '';
      list.forEach((eachIdentifier) => {
        const parsedIdentifier = this.convertBEKeyToLabel(eachIdentifier);
        identifier = identifier === '' ? `${parsedIdentifier}` : `${identifier} - ${parsedIdentifier}`;
      });
      return identifier;
    }

    public formBEBucketObjectFromBucketIdentifier(identifier: string): {[property: string]: Array<string>} {
      const result = {};
      if (!!identifier) {
        const array = identifier.split(' - ');
        array.forEach((eachLabel) => {
          const eachKey = this.convertLabelToBEKey(eachLabel);
          if (eachKey) {
            result[eachKey] = [];
          };
        });
        return result;
      } else {
        return result;
      }
    }

    public formCategoryKeyForOverride(rawData: BEStructuringOverrideBlock): string {
      const list = [];
      for (let eachIdentifier in rawData.bucket) {
        list.push(eachIdentifier);
      }
      list.sort((identifierA, identifierB) => {
        if (identifierA > identifierB) {
          return 1;
        } else if (identifierB < identifierA) {
          return -1;
        } else {
          return 0;
        }
      });
      let categoryKey = '';
      list.forEach((eachIdentifier) => {
        categoryKey = categoryKey === '' ? `${rawData.bucket[eachIdentifier]}` : `${categoryKey} - ${rawData.bucket[eachIdentifier]}`;
      });
      return categoryKey;
    }

    public populateBEBucketObjectFromRowTitle(
      bucket: {[property: string]: Array<string>},
      rowTitle: string
    ): {[property: string]: Array<string>} {
      if (!!rowTitle) {
        const array = rowTitle.split(' - ');
        let index = 0;
        for (let eachBucketItem in bucket) {
          if (array[index].includes(',')) {
            const values = array[index].split(',');
            values.forEach(value => {
              bucket[eachBucketItem].push(value);
            })
          } else {
            bucket[eachBucketItem].push(array[index]);
          }
          index++;
        }
      }
      return bucket;
    }

    public convertRawOverrideToRawBreakdown(
      overrideRawDataList: Array<BEStructuringOverrideBlock>
    ): Array<BEStructuringBreakdownBlock> {
      const breakdownList: Array<BEStructuringBreakdownBlock> = [];
      overrideRawDataList.forEach((eachRawOverride) => {
        eachRawOverride
        const overrideBucketIdentifier = this.formBucketIdentifierForOverride(eachRawOverride);
        const matchExistBreakdown = breakdownList.find((eachBEDTO) => {
          return eachBEDTO.groupOption === overrideBucketIdentifier;
        });
        if (!!matchExistBreakdown) {
          const categoryKey = this.formCategoryKeyForOverride(eachRawOverride);
          matchExistBreakdown.breakdown[categoryKey] = eachRawOverride.breakdown;
        } else {
          const newConvertedBreakdown: BEStructuringBreakdownBlock = {
            date: eachRawOverride.date,
            groupOption: overrideBucketIdentifier,
            indexId: eachRawOverride.indexId,
            portfolioId: eachRawOverride.portfolioId,
            breakdown: {}
          };
          const categoryKey = this.formCategoryKeyForOverride(eachRawOverride);
          newConvertedBreakdown.breakdown[categoryKey] = eachRawOverride.breakdown;
          breakdownList.push(newConvertedBreakdown);
        }
      });
      return breakdownList;
    }

  // structuring specific end
}
