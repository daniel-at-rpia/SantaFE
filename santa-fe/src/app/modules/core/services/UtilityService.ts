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
      BEStructuringBreakdownBlock,
      BEStructuringOverrideBaseBlock
    } from 'BEModels/backend-models.interface';
    import { DTOs, Blocks, AdhocPacks, Stubs } from '../models/frontend';
    import * as globalConstants from 'Core/constants';
    import { CountdownPipe } from 'App/pipes/Countdown.pipe';
    import { BICSDictionaryLookupService } from '../services/BICSDictionaryLookupService';
    import { NavigationEnd } from '@angular/router';
  // dependencies

@Injectable()
export class UtilityService {
  // Any code about naming stuff goes into this service
  groupGroupMetricOptions = globalConstants.market.GroupMetricOptions;
  securityMetricOptions = globalConstants.core.SecurityMetricOptions;
  keyDictionary = globalConstants.core.FrontendKeyToBackendKeyDictionary;
  labelDictionary = globalConstants.core.BackendKeyToDisplayLabelDictionary;
  triCoreDriverConfig = globalConstants.core.TriCoreDriverConfig;
  definitionMap = globalConstants.definition.SecurityDefinitionMap;

  constructor(
    private countdownPipe: CountdownPipe,
    private domSanitizer: DomSanitizer,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ){}

  // shared
    public deepCopy(input): any {
      if (!!input) {
        return _.cloneDeep(input);
      } else {
        return null;
      }
    }

    public isObjectEmpty(object: object): boolean {
      return _.isEmpty(object);
    }

    public deepObjectMerge(objectA: object, objectB: object): object {
      if (!!objectA && !!objectB) {
        return _.merge(objectA, objectB);
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
        console.warn('failed to find key for', frontendKey);
        return globalConstants.core.KEY_CONVERSION_FAILURE_FLAG;
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

    public packMetricData(rawData: BESecurityGroupDTO | BESecurityDTO): Blocks.SecurityGroupMetricPackBlock {
      const object = {
        raw: {
          index: {}
        },
        delta: {
          Dod: {
            index: {}
          },
          Wow: {
            index: {}
          },
          Mom: {
            index: {}
          },
          Ytd: {
            index: {}
          },
          TMinusTwo: {
            index: {}
          }
        }
      };
      if (!!rawData && !!rawData.deltaMetrics && !!rawData.metrics) {
        const isGroup = !!rawData['groupIdentifier'];
        const metricList = isGroup ? this.groupGroupMetricOptions : this.securityMetricOptions;
        metricList.forEach((eachMetric) => {
          let keyToRetrieveMetric = eachMetric.backendDtoAttrName;
          if (eachMetric.label === 'Default Spread') {
            keyToRetrieveMetric = 'spread';
          };
          const metricBlock = rawData.metrics['Default'];
          const indexMetricBlock = rawData.ccy === 'CAD' ? rawData.metrics['FTSE'] : rawData.metrics['BB'];
          let rawValue = !!metricBlock ? metricBlock[keyToRetrieveMetric] : null;
          let rawIndexValue = !!indexMetricBlock ? indexMetricBlock[keyToRetrieveMetric] : null;
          if (rawValue === null || rawValue === undefined) {
            object.raw[eachMetric.backendDtoAttrName] = null;
          } else {
            object.raw[eachMetric.backendDtoAttrName] = rawValue;
          }
          if (rawIndexValue === null || rawIndexValue === undefined) {
            object.raw.index[eachMetric.backendDtoAttrName] = null;
          } else {
            object.raw.index[eachMetric.backendDtoAttrName] = rawIndexValue;
          }
          eachMetric.deltaOptions.forEach((eachDeltaScope) => {
            const deltaSubPack = rawData.deltaMetrics[eachDeltaScope];
            const deltaValue = !!deltaSubPack ? deltaSubPack[keyToRetrieveMetric] : null;
            if (deltaValue === null || deltaValue === undefined) {
              object.delta[eachDeltaScope][eachMetric.backendDtoAttrName] = null;
            } else {
              object.delta[eachDeltaScope][eachMetric.backendDtoAttrName] = deltaValue;
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

    public applyWatchlistToConfigurator(
      targetShortcut: DTOs.WatchlistDTO,
      targetConfigurator: DTOs.SecurityDefinitionConfiguratorDTO
    ): DTOs.SecurityDefinitionConfiguratorDTO {
      const newConfig: DTOs.SecurityDefinitionConfiguratorDTO = this.deepCopy(targetConfigurator);
      const watchlistCopy: DTOs.WatchlistDTO = this.deepCopy(targetShortcut);
      // currently the configurator does not support multiple groups of filters chained together, we will change that when we need to utilize this feature
      const primaryFilterGroup = watchlistCopy.data.searchFilters[0];
      primaryFilterGroup.forEach((eachWatchlistDef) => {
        newConfig.data.definitionList.forEach((eachBundle) => {
          eachBundle.data.list.forEach((eachDefinition) => {
            if (eachDefinition.data.key === eachWatchlistDef.data.key) {
              if (eachWatchlistDef.data.displayOptionList.length === 0) {
                // sometimes the display options are loaded async in API, in those cases the watchlist which were generated at app load won't have the display options populated, but they will still have selected options explicitly defined
                eachDefinition.data.highlightSelectedOptionList = eachWatchlistDef.data.highlightSelectedOptionList;
                // Definition from the configurator may have display option populated if users unselect a preset, which populates the display option from the pristine option list
                if (eachDefinition.data.displayOptionList.length > 0) {
                  eachDefinition.data.highlightSelectedOptionList.forEach(highlightOption => {
                    const existingDisplayOption = eachDefinition.data.displayOptionList.find((displayOption) => displayOption.shortKey === highlightOption.shortKey);
                    if (!!existingDisplayOption) {
                      const index = eachDefinition.data.displayOptionList.findIndex(displayOption => displayOption.shortKey === highlightOption.shortKey);
                      if (index >= 0) {
                        eachDefinition.data.displayOptionList[index] = highlightOption;
                      }
                    }
                  })
                }
              } else {
                eachDefinition.data.displayOptionList = eachWatchlistDef.data.displayOptionList;
                eachDefinition.data.highlightSelectedOptionList = eachDefinition.data.displayOptionList.filter((eachFilter) => {
                  return !!eachFilter.isSelected;
                });
              }
              eachDefinition.state.groupByActive = eachWatchlistDef.state.groupByActive;
              eachDefinition.state.filterActive = eachWatchlistDef.state.filterActive;
            }
          });
        });
      });
      return newConfig;
    }

    public packDefinitionConfiguratorEmitterParams(
      configuratorData: DTOs.SecurityDefinitionConfiguratorDTO
    ): AdhocPacks.DefinitionConfiguratorEmitterParams {
      const params: AdhocPacks.DefinitionConfiguratorEmitterParams = {
        filterList: []
      };
      configuratorData.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list.forEach((eachDefinition) => {
          const activeFilters = eachDefinition.data.highlightSelectedOptionList;
          activeFilters.length > 0 && params.filterList.push({
            key: eachDefinition.data.key,
            targetAttribute: eachDefinition.data.securityDTOAttr,
            targetAttributeBlock: eachDefinition.data.securityDTOAttrBlock,
            filterBy: activeFilters.map((eachFilter) => {
              return eachFilter.displayLabel;
            }),
            filterByBlocks: this.deepCopy(activeFilters)
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
          targetDriver = globalConstants.core.TriCoreDriverConfig.Yield.label;
        } else if (targetDriver === globalConstants.core.TriCoreDriverConfig.Spread.driverLabel) {
          targetDriver = globalConstants.core.TriCoreDriverConfig.Spread.label;
        }
        const rounding = globalConstants.core.TriCoreDriverConfig[targetDriver] ? globalConstants.core.TriCoreDriverConfig[targetDriver].rounding : 0;
        if (isToFixed) {
          if (targetSecurity.data.isGovt && targetDriver === globalConstants.core.TriCoreDriverConfig.Spread.label) {
            return this.round(targetNumber, rounding + 1).toFixed(rounding + 1);
          } else {
            return this.round(targetNumber, rounding).toFixed(rounding);
          }
        } else {
          if (targetSecurity.data.isGovt && targetDriver === globalConstants.core.TriCoreDriverConfig.Spread.label) {
            return this.round(targetNumber, rounding + 1);
          } else {
            return this.round(targetNumber, rounding);
          }
        }
      } else {
        return null;
      }
    }

    public mapAlertType(targetType: string): globalConstants.core.AlertTypes {
      switch (targetType) {
        case globalConstants.core.AlertTypes.axeAlert:
          return globalConstants.core.AlertTypes.axeAlert;
        case globalConstants.core.AlertTypes.markAlert:
          return globalConstants.core.AlertTypes.markAlert;
        case globalConstants.core.AlertTypes.tradeAlert:
          return globalConstants.core.AlertTypes.tradeAlert;
        case globalConstants.core.AlertTypes.traceAlert:
          return globalConstants.core.AlertTypes.traceAlert;
        default:
          return globalConstants.core.AlertTypes.system;
      }
    }

    public mapAlertSubType(targetType: string): globalConstants.core.AlertSubTypes {
      switch (targetType) {
        case globalConstants.core.AlertSubTypes.ask:
          return globalConstants.core.AlertSubTypes.ask;
        case globalConstants.core.AlertSubTypes.bid:
          return globalConstants.core.AlertSubTypes.bid;
        case globalConstants.core.AlertSubTypes.both:
          return globalConstants.core.AlertSubTypes.default;  // both is not a valid type in FE
        case globalConstants.core.AlertSubTypes.liquidation:
          return globalConstants.core.AlertSubTypes.default;  // liquidation is not a valid type in FE
        case globalConstants.core.AlertSubTypes.quantityChange:
          return globalConstants.core.AlertSubTypes.quantityChange;
        case globalConstants.core.AlertSubTypes.ratingChange:
          return globalConstants.core.AlertSubTypes.ratingChange;
        case globalConstants.core.AlertSubTypes.buy:
          return globalConstants.core.AlertSubTypes.buy;
        case globalConstants.core.AlertSubTypes.sell:
          return globalConstants.core.AlertSubTypes.sell;
        case globalConstants.core.AlertSubTypes.mid:
          return globalConstants.core.AlertSubTypes.mid
        default:
          return globalConstants.core.AlertSubTypes.default;
      }
    }

    public parseCountdown(value: moment.Moment) {
      return this.countdownPipe.transform(value);
    }

    public parseNumberToCommas(value: number): string {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public determineNumericalTenor(rawSecurity: BESecurityDTO): number {
      // return in years
      if (!!rawSecurity) {
        if (this.isCDS(false, rawSecurity)) {
          const tenor = !!rawSecurity.metrics && !!rawSecurity.metrics.Default ? rawSecurity.metrics.Default.workoutTerm : null;
          return !!tenor ? this.round(tenor, 1) : null;
        } else {
          const stringTenor = !!rawSecurity.metrics && !!rawSecurity.metrics.Default ? rawSecurity.metrics.Default.tenor : null;
          return !!stringTenor ? parseFloat(stringTenor) : null;
        }
      } else {
        return null;
      }
    }

    public setCoreDefinitionGroupForEachConfiguratorDefinition(configurator: DTOs.SecurityDefinitionConfiguratorDTO) {
      configurator.data.definitionList.forEach((definitionBundle: DTOs.SecurityDefinitionBundleDTO) => {
        definitionBundle.data.list.forEach((definition: DTOs.SecurityDefinitionDTO) => {
          definition.data.configuratorCoreDefinitionGroup = definitionBundle.data.label as globalConstants.definition.SecurityDefinitionConfiguratorGroupLabels;
        })
      })
    }

    public highlightKeywordInParagraph(targetString: string, keyword: string): string {
      // current algorithm only highlights the first occurrence of the keyword, if ever there is the need to highlight all occurrences, append the logic and add a flag as input to switch between two modes
      if (targetString && keyword && targetString.length > 0 && keyword.length > 0) {
        const startIndex = targetString.toUpperCase().indexOf(keyword.toUpperCase());
        const endIndex = startIndex + keyword.length;
        const beforeKeyword = targetString.slice(0, startIndex);
        const matchedKeywordPortion = targetString.slice(startIndex, endIndex);
        const afterKeyword = targetString.slice(endIndex);
        return `${beforeKeyword}<kbd>${matchedKeywordPortion}</kbd>${afterKeyword}`;
      } else {
        return null;
      }
    }

    public applySpecificListForActionMenu(
      actionMenu: DTOs.SecurityActionMenuDTO,
      coreAction: globalConstants.security.SecurityActionMenuOptionsRawText
    ) {
      actionMenu.data.allActions = this.getSpecificActionsForSecurityActionMenu(actionMenu.data.allActions, coreAction);
      actionMenu.state.isDisplayLimitedActions = true;
    }

    public resetActionMenuToDefaultState(
      actionMenu: DTOs.SecurityActionMenuDTO,
      isActive: boolean
    ) {
      actionMenu.data.selectedCoreAction = null;
      actionMenu.state.isActive = isActive;
      actionMenu.state.isCoreActionSelected = false;
      if (actionMenu.data.allActions.length > 0) {
        if (actionMenu.state.isDisplayLimitedActions) {
          actionMenu.data.allActions.forEach((action: Blocks.SecurityActionMenuOptionBlock) => {
            action.isAvailableSubAction = !action.coreAction || !actionMenu.data.allActions.find((selectedAction: Blocks.SecurityActionMenuOptionBlock) => selectedAction.rawText === action.coreAction);
          });
        } else {
          actionMenu.data.allActions.forEach((action: Blocks.SecurityActionMenuOptionBlock) => action.isAvailableSubAction = action.level === 1);
        }
      }
    }
    
    public getBackendGroupFilterFromParams(params: AdhocPacks.DefinitionConfiguratorEmitterParams): AdhocPacks.GenericKeyWithStringArrayBlock {
      const simpleBucket = {};
      params.filterList.forEach((eachItem: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => {
        const property = this.convertFEKey(eachItem.key);
        if (!!property) {
          if (eachItem.key === globalConstants.definition.SecurityDefinitionMap.TENOR.key) {
            simpleBucket[property] = eachItem.filterByBlocks.map((eachBlock: Blocks.SecurityDefinitionFilterBlock) => {
              return eachBlock.shortKey;
            });
          } else {
            if (property !== globalConstants.core.KEY_CONVERSION_FAILURE_FLAG) {
              simpleBucket[property] = eachItem.filterBy;
            }
          }
        }
      })
      return simpleBucket;
    }
  // shared end

  // market specific
    public normalizeDefinitionFilterOption(rawString): string {
      return rawString;//.replace(' ', '');
    }

    public formDefinitionFilterOptionKey(name, normalizedOption): string {
      return `${name}/${normalizedOption}`;
    }

    public retrieveGroupMetricValue(metricDTO: Blocks.SecurityGroupMetricBlock, groupDTO: DTOs.SecurityGroupDTO): number {
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
    public parseNumberToMillions(number: number, hasUnitSuffix: boolean, decimal: number = 2): string {
      const value = this.round(number/1000000, decimal).toFixed(decimal);
      if (!number || value === 0) {
        return null;
      } else {
        return !!hasUnitSuffix ? `${value}MM` : `${value}`;
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
        if (triCoreMetric === globalConstants.core.DEFAULT_DRIVER_IDENTIFIER) {
          targetDriver = this.findSecurityTargetDefaultTriCoreDriver(targetRow.data.security);
        }
        if (!!targetDriver) {
          const targetQuantLocationFromRow = globalConstants.core.TriCoreDriverConfig[targetDriver].backendTargetQuoteAttr;
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

    public getDefinitionBundleFromConfigurator(
      configurator: DTOs.SecurityDefinitionConfiguratorDTO,
      bundleKey: string
    ): DTOs.SecurityDefinitionBundleDTO {
      const selectedDefinitionBundle = configurator.data.definitionList.find((definitionBundle: DTOs.SecurityDefinitionBundleDTO) => definitionBundle.data.label === bundleKey);
      return selectedDefinitionBundle;
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
        if ( header.data.isDriverDependent && header.data.isAttrChangable && attrName === globalConstants.core.DEFAULT_DRIVER_IDENTIFIER ) {
          // when the metric is set to default, the actual metric to be used for each row depends on the driver of the mark of that particular row
          const targetDriver = this.findSecurityTargetDefaultTriCoreDriver(dto);
          attrName = globalConstants.core.TriCoreDriverConfig[targetDriver].driverLabel;
          underlineAttrName = globalConstants.core.TriCoreDriverConfig[targetDriver].driverLabel;
        }
        const driverLabel = attrName;
        let value;
        if (!!header.data.metricPackDeltaScope) {
          const deltaSubPack = dto.data.metricPack.delta[header.data.metricPackDeltaScope];
          value = !!deltaSubPack ? deltaSubPack[driverLabel] : null;
        } else {
          const rawPack = header.data.key === 'indexMark' ? dto.data.metricPack.raw.index : dto.data.metricPack.raw;
          value = !!rawPack ? rawPack[driverLabel] : null;
        }
        if (header.data.isDriverDependent && header.data.isAttrChangable) {
          value = this.parseTriCoreDriverNumber(value, attrName, dto, false);
        }
        if (header.data.key === 'workoutTerm' && value !== null && value !== undefined) {
          value = this.round(value, 3).toFixed(3);
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
                dto.data.cost.current.fifo.defaultSpread = dto.data.cost.current.fifo.defaultSpread + portfolioExist.costFifoSpread;
                dto.data.cost.current.fifo.price = dto.data.cost.current.fifo.price + portfolioExist.costFifoPrice;
                dto.data.cost.current.weightedAvg.defaultSpread = dto.data.cost.current.weightedAvg.defaultSpread + portfolioExist.costFifoSpread;
                dto.data.cost.current.weightedAvg.price = dto.data.cost.current.weightedAvg.price + portfolioExist.costFifoPrice;
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
            header.data.underlineAttrName !== globalConstants.core.DEFAULT_DRIVER_IDENTIFIER 
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
    ): Blocks.SecurityCostPortfolioBlock {
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
          const driverLabel = globalConstants.core.TriCoreDriverConfig[activeDriver].driverLabel;
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
        targetQuote.state.filteredBySpread = filteredMetricType === globalConstants.core.TriCoreDriverConfig.Spread.label;
        targetQuote.state.filteredByYield = filteredMetricType === globalConstants.core.TriCoreDriverConfig.Yield.label;
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
      const maxDelta = this.findPercentile(deltaList, globalConstants.core.QUANT_COMPARER_PERCENTILE);
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
    
    public checkForEmptyObject(obj): boolean {
      return _.isEmpty(obj);
    }

    public checkIfTraceIsAvailable(targetRow: DTOs.SecurityTableRowDTO): boolean {
      return targetRow.data.security.data.currency === 'USD' && targetRow.data.security.data.securityType !== 'Cds' && targetRow.data.security.data.securityType !== 'Stock'
    }

    public getTraceNumericFilterAmount(filterSymbol: string, filter: string): number {
      const parsedFilter = filter.split(filterSymbol)[1].trim();
      const amount = parsedFilter.includes('K') ? +(parsedFilter.split('K')[0]) * globalConstants.table.traceTradeFilterAmounts.thousand : +(parsedFilter.split('M')[0]) * globalConstants.table.traceTradeFilterAmounts.million;
      return amount;
    }

    public getTraceTradesListBasedOnAmount(list: Array<Blocks.TraceTradeBlock>, amount: number): Array<Blocks.TraceTradeBlock> {
      const newList = list.filter(trade => !!trade.volumeEstimated ? trade.volumeEstimated >= amount : trade.volumeReported >= amount);
      return newList;
    }

    public formatTraceReportedValues(amount: number, isRounded: boolean = false): string {
      if (!isRounded) {
      const reportedInteger = amount / globalConstants.core.TRACE_VOLUME_REPORTED_THRESHOLD;
      const roundedVolumeReported = Math.floor(reportedInteger);
      return `${globalConstants.table.traceTradeNumericalFilterSymbols.greaterThan} ${roundedVolumeReported}MM`;
      } else {
        const displayValue = !!amount ? `${globalConstants.table.traceTradeNumericalFilterSymbols.greaterThan} ${Math.floor(amount)}MM` : null;
        return displayValue;
      }
    }

    public getDailyTraceTrades(traceTrades: Array<Blocks.TraceTradeBlock>): Array<Blocks.TraceTradeBlock> {
      if (traceTrades.length > 0) {
        const currentDate = moment();
        const currentMonthDay = currentDate.format('MMM DD');
        const dailyTraceTradesList = traceTrades.filter(trade => {
          if (!!trade.tradeTime) {
            const parsedTraceTradeMonthDay = moment(trade.tradeTime).format('MMM DD');
            if (currentMonthDay === parsedTraceTradeMonthDay) {
              return trade;
            }
          }
        });
        return dailyTraceTradesList;
      } else {
        return [];
      }
    }
    
    public filterTraceTrades(options: Array<string>, rowData: DTOs.SecurityTableRowDTO): Array<Blocks.TraceTradeBlock> {
      let displayedList: Array<Blocks.TraceTradeBlock> = [];
      let numericalFiltersList: Array<number> = [];
      const numericFilter = globalConstants.table.traceTradeNumericalFilterSymbols.greaterThan;
      if (options.length > 0) {
        options.forEach((option) => {
          if (option.includes(numericFilter)) {
            const numericalAmount: number = this.getTraceNumericFilterAmount(numericFilter, option);
            numericalFiltersList = [...numericalFiltersList, numericalAmount];
          }
        })
        const processingTraceTradesList: Array<Blocks.TraceTradeBlock> = !rowData.data.traceTradeVisualizer.state.isDisplayAllTraceTrades ? this.getDailyTraceTrades(rowData.data.security.data.traceTrades) : rowData.data.security.data.traceTrades;
        let filterListWithContraParty: Array<Blocks.TraceTradeBlock> = [];
        const checkNumericalFilter = /\d/;
        const optionsContraPartyList = options.filter(option => !checkNumericalFilter.test(option));
        if (optionsContraPartyList.length > 0) {
          optionsContraPartyList.forEach(contraParty => {
            const contraPartyFilterList = processingTraceTradesList.filter(trade => trade.contraParty === contraParty);
            filterListWithContraParty = [...filterListWithContraParty, ...contraPartyFilterList];
          })
        }
        const traceTradesFilterData = optionsContraPartyList.length > 0 ? filterListWithContraParty : processingTraceTradesList;
        if (numericalFiltersList.length > 0) {
          numericalFiltersList.sort((tradeA: number, tradeB: number) => {
            if (tradeA < tradeB) {
              return - 1;
            } else if (tradeA > tradeB) {
              return 1;
            } else {
              return 0;
            }
          })
          const filteredWithAmountsList = this.getTraceTradesListBasedOnAmount(traceTradesFilterData, numericalFiltersList[numericalFiltersList.length - 1]);
          displayedList = [...filteredWithAmountsList];
        } else {
          displayedList = [...traceTradesFilterData];
        }
        if (displayedList.length > 0) {
          displayedList.sort((tradeA, tradeB) => {
            if (tradeA.tradeTime > tradeB.tradeTime) {
              return -1
            } else if (tradeB.tradeTime > tradeA.tradeTime) {
              return 1;
            } else {
              return 0;
            }
          })
        }
        return displayedList;
      } else {
        displayedList = !rowData.data.traceTradeVisualizer.state.isDisplayAllTraceTrades ? this.getDailyTraceTrades(rowData.data.security.data.traceTrades) : rowData.data.security.data.traceTrades;
        return displayedList;
      }
    }

    public applySearchFilterForConfigurator(targetOption: Blocks.SecurityDefinitionFilterBlock, keyword: string): boolean {
      const normalizedTarget = targetOption.displayLabel.toLowerCase();
      const normalizedKeyword = keyword.toLowerCase();
      return normalizedTarget.includes(normalizedKeyword);
    }

    public getCustomDisplayOptionListForConfiguator(
      newKeyword: string,
      configurator: DTOs.SecurityDefinitionConfiguratorDTO,
      cappedDisplayAmount: number
      ): Array<Blocks.SecurityDefinitionFilterBlock> {
      const filterSpecificOptionList: Array<Blocks.SecurityDefinitionFilterBlock> = [];
      configurator.state.showFiltersFromDefinition.data.prinstineFilterOptionList.forEach((eachOption) => {
        const optionCopy = {...eachOption};
        if (this.applySearchFilterForConfigurator(eachOption, newKeyword)) {
          optionCopy.isFilteredOut = false;
        } else {
          optionCopy.isFilteredOut = true;
        }
        !optionCopy.isFilteredOut && filterSpecificOptionList.push(optionCopy);
      });
      if (filterSpecificOptionList.length > 0) {
        const parsedKeyword = newKeyword.toLowerCase();
        const exactMatchOption: Blocks.SecurityDefinitionFilterBlock = filterSpecificOptionList.find((option: Blocks.SecurityDefinitionFilterBlock) => option.displayLabel.toLowerCase() === parsedKeyword);
        const generalMatchOptionList = !!exactMatchOption ? filterSpecificOptionList.filter((option: Blocks.SecurityDefinitionFilterBlock) => option.displayLabel.toLowerCase() !== parsedKeyword) : filterSpecificOptionList;
        const cappedGeneralMatchList = generalMatchOptionList.length > cappedDisplayAmount ? generalMatchOptionList.filter((option: Blocks.SecurityDefinitionFilterBlock, i: number) => i < cappedDisplayAmount - 1) : generalMatchOptionList;
        const formattedFilteredList: Array<Blocks.SecurityDefinitionFilterBlock> = !!exactMatchOption ? [exactMatchOption, ...cappedGeneralMatchList] : cappedGeneralMatchList;
        if (configurator.state.showFiltersFromDefinition.data.highlightSelectedOptionList.length > 0) {
          configurator.state.showFiltersFromDefinition.data.highlightSelectedOptionList.forEach((highlightOption: Blocks.SecurityDefinitionFilterBlock) => {
            const filterOptionIndex = formattedFilteredList.findIndex((filterOption: Blocks.SecurityDefinitionFilterBlock) => filterOption.displayLabel === highlightOption.displayLabel);
            if (filterOptionIndex >= 0) {
              formattedFilteredList[filterOptionIndex] = highlightOption;
            }
          })
        }
        return formattedFilteredList;
      } else {
        return [];
      }
    }

    public getModulePortionFromNavigation(event: NavigationEnd):string {
      return this.getModulePortionFromUrl(event.urlAfterRedirects);
    }

    public getModulePortionFromUrl(url: string): string {
      const removeForwardSlash = url.slice(1);
      const modulePortion = removeForwardSlash.split('/').length > 0 ? removeForwardSlash.split('/')[0] : '';
      return modulePortion;
    }

    public getStateUUIDFromNavigation(event: NavigationEnd): string {
      const removeForwardSlash = event.urlAfterRedirects.slice(1);
      const slicedUrl = removeForwardSlash.split('/');
      if (slicedUrl.length > 1) {
        return slicedUrl[1];
      } else {
        return 'n/a';
      }
    }

    public createNewCoreDefinitionFromSelectedDefinitionChanges(
      targetDefinition: DTOs. SecurityDefinitionDTO,
      isHiddenDefinition: boolean,
      filterActive: boolean
    ): DTOs.SecurityDefinitionDTO {
      const newDefinition: DTOs.SecurityDefinitionDTO = this.deepCopy(targetDefinition);
      newDefinition.state.isHiddenInConfiguratorDefinitionBundle = isHiddenDefinition;
      newDefinition.state.filterActive = !!filterActive;
      newDefinition.data.configuratorCoreDefinitionGroup = this.setCoreDefinitionBundleLabel(targetDefinition.data.key);
      return newDefinition;
    }

    public setCoreDefinitionBundleLabel(targetKey: string): globalConstants.definition.SecurityDefinitionConfiguratorGroupLabels | null {
      const nonSelectedDefinitionLayout = globalConstants.definition.ConfiguratorDefinitionLayout.filter((bundleStub: Stubs.SecurityDefinitionBundleStub) => bundleStub.label !== globalConstants.definition.SecurityDefinitionConfiguratorGroupLabels.selected);
      const selectedBundle = nonSelectedDefinitionLayout.find((bundleStub: Stubs.SecurityDefinitionBundleStub) => bundleStub.list.find((definitionStub: Stubs.SecurityDefinitionStub) => definitionStub.key === targetKey));
      if (!!selectedBundle) {
        return selectedBundle.label as globalConstants.definition.SecurityDefinitionConfiguratorGroupLabels;
      } else {
        return null;
      }
    }

    public syncDefinitionStateBetweenSelectedAndCore(
      configurator: DTOs.SecurityDefinitionConfiguratorDTO,
      targetDefinition: DTOs.SecurityDefinitionDTO,
      isHiddenDefinition: boolean,
    ) {
      configurator.data.definitionList.forEach((definitionBundle: DTOs.SecurityDefinitionBundleDTO, definitionBundleIndex: number) => {
        if (definitionBundle.data.label !== globalConstants.definition.SecurityDefinitionConfiguratorGroupLabels.selected) {
          definitionBundle.data.list.forEach((definition: DTOs.SecurityDefinitionDTO, definitionIndex: number) => {
            if (definition.data.key === targetDefinition.data.key) {
              const newCoreDefinition = this.createNewCoreDefinitionFromSelectedDefinitionChanges(targetDefinition, isHiddenDefinition, targetDefinition.state.filterActive);
              configurator.data.definitionList[definitionBundleIndex].data.list[definitionIndex] = newCoreDefinition
            }
          })
        }
      })
    }

    public generateCustomizedTitleForWatchlist(targetShortcut: DTOs.WatchlistDTO): string {
      let customDisplayTitle = '';
      let selectionOptionsList: Array<string> = [];
      // we only use the first (primary) set of configurations in the searchFilters to name the watchlist, ignore all the other "OR" conditions for now because it would make the name too long
      targetShortcut.data.searchFilters[0].forEach((definitionItem: DTOs.SecurityDefinitionDTO) => {
        // skip "Quoted Today" in the naming since that definition is just binary at the moment
        if (definitionItem.data.key !== globalConstants.definition.SecurityDefinitionMap.QUOTED_TODAY.key) {
          const isBICS = definitionItem.data.key === globalConstants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED.key;
          const groupDefinition = isBICS ? 'BICS' : globalConstants.definition.SecurityDefinitionMap[definitionItem.data.key].displayName;
          selectionOptionsList = [
            ...selectionOptionsList,
            ...definitionItem.data.highlightSelectedOptionList.length > 2
              ? [`${groupDefinition}(${definitionItem.data.highlightSelectedOptionList.length})`]
              : definitionItem.data.highlightSelectedOptionList.map((eachOption) => {
                return eachOption.shortKey;
              })
          ];
          customDisplayTitle = selectionOptionsList.length > 0 ? selectionOptionsList.join(' - ') : '';
        }
      })
      return customDisplayTitle;
    }

    public getSecurityActionMenuSubActionsFromLevel(level: number): Array<Blocks.SecurityActionMenuOptionBlock> {
      const selectedSubActions = globalConstants.security.SecurityActionMenuList.filter((optionBlock: Blocks.SecurityActionMenuOptionBlock) => optionBlock.level === level);
      return selectedSubActions;
    }

    public clearAllSelectedOptionsInDefinition(
      configurator: DTOs.SecurityDefinitionConfiguratorDTO,
      targetDefinitions: Array<DTOs.SecurityDefinitionDTO>
    ) {
      targetDefinitions.forEach((targetDefinition: DTOs.SecurityDefinitionDTO) => {
        targetDefinition.data.highlightSelectedOptionList = [];
        targetDefinition.state.filterActive = false;
        if (targetDefinition.state.isFilterCapped) {
          targetDefinition.data.displayOptionList = [];
        } else {
          targetDefinition.data.displayOptionList.forEach((option: Blocks.SecurityDefinitionFilterBlock) => {
            option.isSelected = false;
          })
        }
        this.syncDefinitionStateBetweenSelectedAndCore(configurator, targetDefinition, true);
      })
    }

    public getSpecificActionsForSecurityActionMenu(
      actionList: Array<Blocks.SecurityActionMenuOptionBlock>,
      coreAction: globalConstants.security.SecurityActionMenuOptionsRawText
    ): Array<Blocks.SecurityActionMenuOptionBlock> {
      if (actionList.length > 0) {
        const selectedActions = actionList.filter((action: Blocks.SecurityActionMenuOptionBlock) => action.coreAction === coreAction);
        if (selectedActions.length > 0) {
          selectedActions.forEach((action: Blocks.SecurityActionMenuOptionBlock) => action.isAvailableSubAction = true);
          return selectedActions;
        } else {
          return [];
        }
      } else {
        return [];
      }
    }

    public checkIfPresetsAreIdentical(
      currentPreset: DTOs.SearchShortcutDTO,
      targetPreset: DTOs.SearchShortcutDTO
    ): boolean {
      const currentPrimaryFilters = currentPreset.data.searchFilters[0];
      const targetPrimaryFilters = targetPreset.data.searchFilters[0];
      if (currentPrimaryFilters.length !== targetPrimaryFilters.length) {
        return false;
      } else {
        let targetOptions: Array<string> = [];
        let currentOptions: Array<string> = [];
        targetPrimaryFilters.forEach((definition: DTOs.SecurityDefinitionDTO) => {
          if (definition.data.highlightSelectedOptionList.length > 0) {
            const highlightedOptions = definition.data.highlightSelectedOptionList.map((optionBlock: Blocks.SecurityDefinitionFilterBlock) => optionBlock.shortKey);
            targetOptions = [...targetOptions, ...highlightedOptions];
          }
        });
        currentPrimaryFilters.forEach((definition: DTOs.SecurityDefinitionDTO) => {
          if (definition.data.highlightSelectedOptionList.length > 0) {
            const highlightedOptions = definition.data.highlightSelectedOptionList.map((optionBlock: Blocks.SecurityDefinitionFilterBlock) => optionBlock.shortKey);
            currentOptions = [...currentOptions, ...highlightedOptions];
          }
        });
        const isIdentical = currentOptions.every((currentOption: string) => targetOptions.indexOf(currentOption) >= 0);
        return isIdentical;
      }
    }
    private calculateSingleBestQuoteComparerWidth(delta: number, maxAbsDelta: number): number {
      if (delta < 0) {
        return 100;
      } else {
        const result = 100 - Math.round(delta / maxAbsDelta * 100);
        return result;
      }
    }

    public getBackendGroupFilterFromWatchlist(watchlist: DTOs.WatchlistDTO): AdhocPacks.GenericKeyWithStringArrayBlock {
      const simpleBucket = {};
      if (!!watchlist && !!watchlist.data.searchFilters && watchlist.data.searchFilters.length > 0) {
        watchlist.data.searchFilters[0].forEach((eachDefinition: DTOs.SecurityDefinitionDTO) => {
          const property = this.convertFEKey(eachDefinition.data.key);
          if (!!property && property !== globalConstants.core.KEY_CONVERSION_FAILURE_FLAG) {
            simpleBucket[property] = eachDefinition.data.highlightSelectedOptionList.map((eachBlock: Blocks.SecurityDefinitionFilterBlock) => {
              if (eachBlock.bicsLevel > 0){
                return this.bicsDictionaryLookupService.BICSNameToBICSCode(eachBlock.shortKey, eachBlock.bicsLevel);
              } else {
                return eachBlock.shortKey;
              }
            });
          }
        })
      }
      return simpleBucket;
    }
  // trade specific end

  // structuring specific
    public formBucketIdentifierForOverride(simpleBucket: Blocks.StructureBucketDataBlock): string {
      const list: Array<string> = [];
      for (let eachIdentifier in simpleBucket) {
        list.push(eachIdentifier);
      }
      list.sort((identifierA, identifierB) => {
        if (identifierA > identifierB) {
          return 1;
        } else if (identifierB > identifierA) {
          return -1;
        } else {
          return 0;
        }
      });
      let identifier = '';
      list.forEach((eachIdentifier) => {
        const parsedIdentifier = this.convertBEKeyToLabel(eachIdentifier);
        identifier = identifier === '' ? `${parsedIdentifier}` : `${identifier} ~ ${parsedIdentifier}`;
      });
      return identifier;
    }

    public formBEBucketObjectFromBucketIdentifier(identifier: string): {[property: string]: Array<string>} {
      const result = {};
      if (!!identifier) {
        const array = identifier.split(' ~ ');
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

    public formCategoryKeyForOverride(rawData: BEStructuringOverrideBaseBlock): string {
      if (!!rawData.simpleBucket) {
        const list = [];
        for (let eachIdentifier in rawData.simpleBucket) {
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
          if (eachIdentifier === globalConstants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED.backendDtoAttrName) {
            const valueArray = rawData.simpleBucket[eachIdentifier].map((eachBicsCode) => {
              return this.bicsDictionaryLookupService.BICSCodeToBICSName(eachBicsCode, true);
            });
            categoryKey = categoryKey === '' ? `${valueArray}` : `${categoryKey} ~ ${valueArray}`;
          } else {
            categoryKey = categoryKey === '' ? `${rawData.simpleBucket[eachIdentifier]}` : `${categoryKey} ~ ${rawData.simpleBucket[eachIdentifier]}`;
          }
        });
        return categoryKey;
      } else {
        return 'n/a';
      }
    }

    public populateBEBucketObjectFromRowIdentifier(
      bucket: {[property: string]: Array<string>},
      rowIdentifier: string
    ): {[property: string]: Array<string>} {
      if (!!rowIdentifier) {
        const array = rowIdentifier.split(' ~ ');
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
      overrideRawDataList: Array<BEStructuringOverrideBaseBlock>
    ): AdhocPacks.StructureOverrideToBreakdownConversionReturnPack {
      const displayLabelToCategoryPerBreakdownMap = {};
      const breakdownList: Array<BEStructuringBreakdownBlock> = [];
      overrideRawDataList.forEach((eachRawOverride: BEStructuringOverrideBaseBlock) => {
        const overrideBucketIdentifier = this.formBucketIdentifierForOverride(eachRawOverride.simpleBucket);
        const matchExistBreakdown = breakdownList.find((eachBEDTO) => {
          return eachBEDTO.groupOption === overrideBucketIdentifier;
        });
        if (!!matchExistBreakdown) {
          const categoryKey = this.formCategoryKeyForOverride(eachRawOverride);
          if (eachRawOverride.title && eachRawOverride.title.length > 0) {
            displayLabelToCategoryPerBreakdownMap[overrideBucketIdentifier][categoryKey] = eachRawOverride.title;
          }
          matchExistBreakdown.breakdown[categoryKey] = eachRawOverride.breakdown;
          matchExistBreakdown.breakdown[categoryKey].bucket = eachRawOverride.bucket;
          matchExistBreakdown.breakdown[categoryKey].simpleBucket = eachRawOverride.simpleBucket;
          matchExistBreakdown.breakdown[categoryKey].portfolioOverrideId = eachRawOverride.portfolioOverrideId;
        } else {
          const newConvertedBreakdown: BEStructuringBreakdownBlock = {
            groupOption: overrideBucketIdentifier,
            indexId: eachRawOverride.indexId,
            portfolioId: eachRawOverride.portfolioId,
            breakdown: {},
          };
          const categoryKey = this.formCategoryKeyForOverride(eachRawOverride);
          displayLabelToCategoryPerBreakdownMap[overrideBucketIdentifier] = {};
          if (eachRawOverride.title && eachRawOverride.title.length > 0) {
            displayLabelToCategoryPerBreakdownMap[overrideBucketIdentifier][categoryKey] = eachRawOverride.title;
          }
          newConvertedBreakdown.breakdown[categoryKey] = eachRawOverride.breakdown;
          newConvertedBreakdown.breakdown[categoryKey].bucket = eachRawOverride.bucket;
          newConvertedBreakdown.breakdown[categoryKey].simpleBucket = eachRawOverride.simpleBucket;
          newConvertedBreakdown.breakdown[categoryKey].portfolioOverrideId = eachRawOverride.portfolioOverrideId;
          breakdownList.push(newConvertedBreakdown);
        }
      });
      return {
        list: breakdownList,
        displayLabelMap: displayLabelToCategoryPerBreakdownMap
      };
    }

    public updateDisplayLabelForOverrideConvertedBreakdown(
      displayLabelMap: object,
      targetBreakdown: DTOs.PortfolioBreakdownDTO
    ) {
      if (!!displayLabelMap && !!targetBreakdown) {
        targetBreakdown.data.rawCs01CategoryList.forEach((eachRow) => {
          if (!!displayLabelMap[eachRow.data.category]) {
            eachRow.data.displayCategory = displayLabelMap[eachRow.data.category];
          }
        });
        targetBreakdown.data.rawLeverageCategoryList.forEach((eachRow) => {
          if (!!displayLabelMap[eachRow.data.category]) {
            eachRow.data.displayCategory = displayLabelMap[eachRow.data.category];
          }
        });
      }
    }

    public getCompareValuesForStructuringVisualizer(rawData: BEStructuringBreakdownBlock): Array<number> {
      let findCs01Max = 0;
      let findCs01Min = 0;
      let findLeverageMax = 0;
      let findLeverageMin = 0;
      for (const eachCategory in rawData.breakdown) {
        const eachCs01Entry = rawData.breakdown[eachCategory] && rawData.breakdown[eachCategory].metricBreakdowns ? rawData.breakdown[eachCategory].metricBreakdowns.Cs01 : null;
        if (!!eachCs01Entry) {
          const highestVal = Math.max(eachCs01Entry.currentLevel, eachCs01Entry.targetLevel);
          const lowestVal = Math.min(eachCs01Entry.currentLevel, eachCs01Entry.targetLevel);
          if (highestVal > findCs01Max && highestVal >= 1000) {
            findCs01Max = highestVal;
          }
          if (lowestVal < findCs01Min) {
            findCs01Min = lowestVal;
          }
        }
        const eachLeverageEntry = rawData.breakdown[eachCategory] && rawData.breakdown[eachCategory].metricBreakdowns ? rawData.breakdown[eachCategory].metricBreakdowns.CreditLeverage : null;
        if (!!eachLeverageEntry) {
          const highestVal = Math.max(eachLeverageEntry.currentLevel, eachLeverageEntry.targetLevel);
          const lowestVal = Math.min(eachLeverageEntry.currentLevel, eachLeverageEntry.targetLevel);
          if (highestVal > findLeverageMax) {
            findLeverageMax = highestVal;
          }
          if (lowestVal < findLeverageMin) {
            findLeverageMin = lowestVal;
          }
        }
      }

      return [findCs01Min, findCs01Max, findLeverageMin, findLeverageMax];
    }

    public calculateAlignmentRating(breakdownData: DTOs.PortfolioBreakdownDTO) {
      const targetList = breakdownData.state.isDisplayingCs01 ? breakdownData.data.rawCs01CategoryList : breakdownData.data.rawLeverageCategoryList;
      if (targetList.length > 0) {
        const filteredList = breakdownData.state.isBICs ? targetList.filter(row => row.data.bicsLevel < 2 || !row.data.bicsLevel) : targetList;
        if (filteredList.length > 0 ) {
          let totalLevel = 0;
          filteredList.forEach((eachCategory) => {
            totalLevel = totalLevel + eachCategory.data.currentLevel;
          });
          const filteredListWithTargets = filteredList.filter((eachCategory) => {
            return eachCategory.data.targetLevel !== null;
          });
          if (filteredListWithTargets.length > 0) {
            let misalignmentAggregate = 0;
            filteredListWithTargets.forEach((eachCategory) => {
              const misalignmentPercentage = eachCategory.data.diffToTarget / totalLevel * 100;
              misalignmentAggregate = misalignmentAggregate + Math.abs(misalignmentPercentage);
            });
            misalignmentAggregate = misalignmentAggregate > 100 ? 100 : misalignmentAggregate;
            breakdownData.style.ratingFillWidth = 100 - this.round(misalignmentAggregate, 0);
            breakdownData.data.ratingHoverText = `${100 - this.round(misalignmentAggregate, 0)}`;
            breakdownData.state.isTargetAlignmentRatingAvail = true;
          } else {
            breakdownData.state.isTargetAlignmentRatingAvail = false;
          }
        }
      }
    }

    public sortOverrideRows(breakdownData: DTOs.PortfolioBreakdownDTO) {
      breakdownData.data.rawCs01CategoryList.sort((rowA, rowB) => {
        if (rowA.data.displayCategory < rowB.data.displayCategory) {
          return -1
        } else if (rowA.data.displayCategory > rowB.data.displayCategory) {
          return 1;
        } else {
          return 0;
        }
      });
      breakdownData.data.rawLeverageCategoryList.sort((rowA, rowB) => {
        if (rowA.data.displayCategory < rowB.data.displayCategory) {
          return -1
        } else if (rowA.data.displayCategory > rowB.data.displayCategory) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    public getRowDiffToTarget(currentLevel: number, targetLevel: number, isCs01: boolean): number {
      if (!!targetLevel || targetLevel === 0) {
        return !!isCs01 ? Math.round(targetLevel - currentLevel) : this.round(targetLevel - currentLevel, 2);
      } else {
        return 0;
      }
    }

    public getBreakdownRowDiffText(amount: number, isCs01: boolean): string {
      let displayText: string;
      if (amount < 0) {
        displayText = !!isCs01 ? `${amount}k` : `${amount}`;
      }
      if (amount > 0) {
        displayText = !!isCs01 ? `+${amount}k` : `+${amount}`;
      }
      return displayText;
    }

    public getMetricSpecificMinAndMaxForVisualizer(rawBreakdownData: BEStructuringBreakdownBlock, isCs01: boolean): Array<number> {
      const [cs01Min, cs01Max, creditLeverageMin, creditLeverageMax] = this.getCompareValuesForStructuringVisualizer(rawBreakdownData);
      const minValue = !!isCs01 ? cs01Min : creditLeverageMin;
      const maxValue = !!isCs01 ? cs01Max : creditLeverageMax;
      const parsedMinValue = this.getParsedValueForVisualizerCompare(minValue, isCs01);
      const parsedMaxValue = this.getParsedValueForVisualizerCompare(maxValue, isCs01);
      return [parsedMinValue, parsedMaxValue];
    }

    public getParsedValueForVisualizerCompare(value: number, isCs01: boolean): number | null {
      let parsedValue: number | null;
      // the check for >= 1000 is to make sure to equalize small number that would be be scaled out by the rounding and causing it to be larger than the max, which then throw the moveVisualizer's bar off the chart
      if (!!value || value === 0) {
        parsedValue = !!isCs01 ? Math.abs(value) >= 1000 ? this.round(value/1000, 0) : 0 : this.round(value, 2);
      } else {
        parsedValue = null;
      }
      return parsedValue;
    }

    public checkIfDiveInIsAvailable(row: DTOs.StructurePortfolioBreakdownRowDTO): boolean {
      const isNonDiveInCategory = globalConstants.structuring.BICS_DIVE_IN_UNAVAILABLE_CATEGORIES.find(categoryCode => categoryCode === row.data.code);
      if (!isNonDiveInCategory && row.data.code) {
        const subLevelCategories = this.bicsDictionaryLookupService.getNextBICSSubLevelCodesByPerCategory(row.data.code);
        return subLevelCategories.length > 0;
      } else {
        return false;
      }
    }

    public formViewPayloadTransferPackForSingleEdit(data: AdhocPacks.StructureRowSetViewData): AdhocPacks.StructureSetViewTransferPack {
      const { view, row } = data;
      const isRegularBICSRow = row.data.bicsLevel >= 1 && !!row.data.code;
      let formattedDisplayCategory: string;
      if (!!isRegularBICSRow) {
        const level = row.data.bicsLevel;
        formattedDisplayCategory = `${row.data.displayCategory} (Lv.${level})`;
      } else {
        formattedDisplayCategory = row.data.displayCategory;
      }
      const viewData: AdhocPacks.StructureSetViewTransferPack = {
        bucket: !!row.data.portfolioOverrideId ? [row.data.simpleBucket] : [row.data.bucket],
        view: view !== row.data.view ? [view] : [null],
        displayCategory: formattedDisplayCategory
      }
      return viewData;
    }

    public convertFESubPortfolioTextToBEKey(subPortfolio: globalConstants.structuring.SubPortfolioFilter): string {
      switch (subPortfolio) {
        case globalConstants.structuring.SubPortfolioFilter.all:
          return 'All';
          break;
        case globalConstants.structuring.SubPortfolioFilter.nonHedging:
          return 'NonHedging';
          break;
        case globalConstants.structuring.SubPortfolioFilter.nonShortCarry:
          return 'NonShortCarry';
          break;
        case globalConstants.structuring.SubPortfolioFilter.shortCarry:
          return 'ShortCarry';
          break;
        default:
          return null;
          break;
      }
    }

    public getFormattedRowDisplayCategory(
      category: string,
      isOverride: boolean
      ): string {
      const isBICSSubLevel = category.includes(globalConstants.structuring.BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX);
      let displayCategory: string;
      if (isBICSSubLevel) {
        displayCategory = isOverride ? category.split(globalConstants.structuring.BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX).join('Lv.'): category.split(globalConstants.structuring.BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX)[0].trim();
      } else {
        displayCategory = category;
      }
      return displayCategory;
    }

    public checkIfFundDeltaIsSignificantPositive(delta: number): boolean {
      const isSignificantPositive = delta > 0 && delta >= 0.1 ? true : false;
      return isSignificantPositive;
    }

    public checkIfFundDeltaIsSignificantNegative(delta: number): boolean {
      const isSignificantNegative = delta < 0 && delta <= -0.1 ? true : false;
      return isSignificantNegative;
    }

    public getRawOverridesFromFund(rawOverrides: BEStructuringOverrideBlock): Array<BEStructuringOverrideBaseBlock> {
      let rawOverridesList: Array<BEStructuringOverrideBaseBlock> = [];
      for (let bucket in rawOverrides) {
        if (rawOverrides[bucket]) {
          for (let category in rawOverrides[bucket]) {
            rawOverridesList = [...rawOverridesList, rawOverrides[bucket][category]];
          }
        }
      }
      return rawOverridesList;
    }

    public filterOutExcludedStrategiesForSeeBond(definition: DTOs.SecurityDefinitionDTO, activeSubPortfolio: globalConstants.structuring.SubPortfolioFilter) {
        definition.data.displayOptionList.forEach((eachOption) => {
        const subPortfolioMapping = globalConstants.definition.StrategyExcludedFiltersMapping[activeSubPortfolio];
        const isExcluded = subPortfolioMapping.excluded.find(strategy => strategy === eachOption.displayLabel);
        if (!isExcluded) {
          eachOption.isSelected = true;
          definition.data.highlightSelectedOptionList.push(eachOption);
        }
      })
    }

    public formOverrideTitle(backendGroupOptionIdentifier: string): string {
      const identifiers = backendGroupOptionIdentifier.split(' ~ ');
      identifiers.forEach((identifier: string, index: number) => {
        const identifierBlock = globalConstants.structuring.BEIdentifierToFEDisplayMapping.find((block: AdhocPacks.BEIdentifierToFEMappingBlock) => block.identifier === identifier);
        if (identifierBlock) {
          identifiers[index] = identifierBlock.display;
        }
      })
      const title = identifiers.join(' ~ ');
      return title;
    }
  // structuring specific end
}
