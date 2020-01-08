  // dependencies
    import { Injectable } from '@angular/core';

    import * as _ from 'lodash';

    import {
      BESecurityDTO,
      BESecurityDeltaMetricDTO,
      BESecurityGroupDTO
    } from 'BEModels/backend-models.interface';
    import {
      SecurityDTO,
      SecurityTableHeaderDTO,
      SecurityTableRowDTO,
      SecurityTableCellDTO,
      SecurityGroupDTO,
      SecurityDefinitionDTO,
      SecurityDefinitionConfiguratorDTO,
      QuantComparerDTO,
      SearchShortcutDTO
    } from 'FEModels/frontend-models.interface';
    import {
      SecurityGroupMetricBlock,
      SecurityGroupMetricPackBlock
    } from 'FEModels/frontend-blocks.interface';
    import { DefinitionConfiguratorEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      GroupMetricOptions
    } from 'Core/constants/marketConstants.constant';
    import {
      SecurityMetricOptions,
      BackendKeyDictionary,
      TriCoreMetricConfig
    } from 'Core/constants/coreConstants.constant';
    import uuid from 'uuidv4';
  // dependencies

@Injectable()
export class UtilityService {
  // Any code about naming stuff goes into this service
  groupGroupMetricOptions = GroupMetricOptions;
  securityMetricOptions = SecurityMetricOptions;
  keyDictionary = BackendKeyDictionary;
  triCoreMetricConfig = TriCoreMetricConfig;

  constructor(){}

  // shared
    public deepCopy(input): any {
      if (!!input) {
        return _.cloneDeep(input);
      } else {
        return null;
      }
    }

    public round(input, precision): any {
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
        case "Sr Subordinated":
          return 3;
        case "Subordinated":
          return 3;
        case "SUB":  // this is for SUB
          return 3;
        case "Jr Subordinated":
          return 3;
        case "Subordinated Unsecured":
          return 3;
        case "Jr Subordinated Unsecured":
          return 3;
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
          return 'n/a';
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
          return 5;
        case 'CC':
          return 5;
        case 'C':
          return 5;
        case 'D':
          return 5;
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
      input: SecurityGroupDTO | BESecurityGroupDTO | SecurityDTO | BESecurityDTO
    ): boolean {
      if (isGroup) {
        if (input['data']) {
          const dtoInput = input as SecurityGroupDTO;
          return dtoInput.data.name.indexOf('Cds') >= 0;
        } else {
          const rawDataInput = input as BESecurityGroupDTO;
          return rawDataInput.name.indexOf('Cds') >= 0;
        }
      } else {
        if (input['data']) {
          const dtoInput = input as SecurityDTO;
          return dtoInput.data.name.indexOf('CDS') >= 0;
        } else {
          const rawDataInput = input as BESecurityDTO;
          return rawDataInput.name.indexOf('CDS') >= 0;
        }
      }
    }

    public isFloat(
      isGroup: boolean, 
      input: SecurityGroupDTO | BESecurityGroupDTO | SecurityDTO | BESecurityDTO
    ): boolean {
      if (isGroup) {
        if (input['data']) {
          const dtoInput = input as SecurityGroupDTO;
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
          return rawDataInput.metrics ? rawDataInput.metrics.isFloat : false;
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
          Ytd: {}
        }
      };
      if (!!rawData) {
        const isGroup = !!rawData['groupIdentifier'];
        const metricList = isGroup ? this.groupGroupMetricOptions : this.securityMetricOptions;
        metricList.forEach((eachMetric) => {
          let keyToRetrieveMetric = eachMetric.backendDtoAttrName;
          if (eachMetric.label === 'Default Spread') {
            if (this.isCDS(isGroup, rawData)) {
              keyToRetrieveMetric = 'spread';
             } else if (this.isFloat(isGroup, rawData)) {
               keyToRetrieveMetric = 'zSpread';
            } else {
              keyToRetrieveMetric = 'gSpread';
            }
          };
          const rawValue = rawData.metrics ? rawData.metrics[keyToRetrieveMetric] : null;
          if (rawValue === null || rawValue === undefined) {
            object.raw[eachMetric.label] = null;
          } else {
            object.raw[eachMetric.label] = Math.round(rawValue);
          }
          eachMetric.deltaOptions.forEach((eachDeltaScope) => {
            const deltaSubPack = rawData.deltaMetrics[eachDeltaScope];
            const deltaValue = !!deltaSubPack ? deltaSubPack[keyToRetrieveMetric] : null;
            if (deltaValue === null || deltaValue === undefined) {
              object.delta[eachDeltaScope][eachMetric.label] = null;
            } else {
              object.delta[eachDeltaScope][eachMetric.label] = Math.round(deltaValue*100)/100;
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
      targetShortcut: SearchShortcutDTO,
      targetConfigurator: SecurityDefinitionConfiguratorDTO
    ): SecurityDefinitionConfiguratorDTO {
      const newConfig = this.deepCopy(targetConfigurator);
      targetShortcut.data.configuration.forEach((eachShortcutDef) => {
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
      configuratorData: SecurityDefinitionConfiguratorDTO
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
            targetAttribute: eachDefinition.data.securityDTOAttr,
            filterBy: activeFilters.map((eachFilter) => {
              return eachFilter.displayLabel;
            })
          });
        });
      });
      return params;
    }

    public skewedNumber(input: number): number {
      return input * input;
    } 
  // shared end

  // market specific 
    public normalizeDefinitionFilterOption(rawString): string {
      return rawString;//.replace(' ', '');
    }

    public formDefinitionFilterOptionKey(name, normalizedOption): string {
      return `${name}/${normalizedOption}`;
    }

    public retrieveGroupMetricValue(metricDTO: SecurityGroupMetricBlock, groupDTO: SecurityGroupDTO): number {
      if (!!groupDTO && !!metricDTO) {
        const metricLabel = metricDTO.label;
        let value, deltaSubPack;
        if (!!metricDTO.deltaScope) {
          deltaSubPack = groupDTO.data.metricPack.delta[metricDTO.deltaScope];
          value = !!deltaSubPack ? deltaSubPack[metricLabel] : null;
          value = Math.round(value*10)/10;
        } else {
          value = groupDTO.data.metricPack.raw[metricLabel];
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
      if (!!rawData && !!rawData.descriptiveMetrics) {
        const object = rawData.descriptiveMetrics[this.keyDictionary.RATING];
        if (!!object) {
          return object;
        } else {
          return {};
        }
      } else {
        return {}
      }
    }

    public retrieveRawSupportingDataForRightPie(rawData: BESecurityGroupDTO): object {
      if (!!rawData && !!rawData.descriptiveMetrics) {
        const object = rawData.descriptiveMetrics[this.keyDictionary.SENIORITY];
        if (!!object) {
          return object;
        } else {
          return {};
        }
      } else {
        return {}
      }
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

    public flattenDefinitionList(configurator: SecurityDefinitionConfiguratorDTO): Array<SecurityDefinitionDTO> {
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

    public parsePositionToMM(position: number, hasUnitSuffix: boolean): string {
      const value = this.round(position/1000000, 2).toFixed(2);
      if (value === 0) {
        return null;
      } else {
        return !!hasUnitSuffix ? `${value}MM` : `${value}`;
      }
    }

    public retrieveSecurityMetricFromMetricPack(dto: SecurityDTO, header: SecurityTableHeaderDTO): number {
      if (!!dto && !!header) {
        const metricLabel = header.data.attrName;
        let value, deltaSubPack;
        if (!!header.data.metricPackDeltaScope) {
          deltaSubPack = dto.data.metricPack.delta[header.data.metricPackDeltaScope];
          value = !!deltaSubPack ? deltaSubPack[metricLabel] : null;
          if (!!value) {
            value = Math.round(value*10)/10;
          }
        } else {
          value = dto.data.metricPack.raw[metricLabel];
          if (!!value) {
            value = Math.round(value);
          }
        }
        return value;
      } else {
        return null;
      }
    }

    // TODO: move this into a SecurityTableHelper service 
    public populateSecurityTableCellFromSecurityCard(
      targetHeader: SecurityTableHeaderDTO,
      targetRow: SecurityTableRowDTO,
      newCellDTO: SecurityTableCellDTO,
      triCoreMetric: string
    ): SecurityTableCellDTO {
      if (targetHeader.state.isQuantVariant) {
        const targetQuantAttr = targetHeader.data.targetQuantLocationFromRow;
        const targetSecurity = targetRow.data.security;
        newCellDTO.data.quantComparerDTO = targetRow.data.bestQuotes[targetQuantAttr];
        // only show mark if the current selected metric is the mark's driver, unless the selected metric is default
        if ( targetSecurity.data.mark.markDriver === triCoreMetric || triCoreMetric === 'Default') {
          targetSecurity.data.mark.markRaw = targetRow.data.security.data.mark.markBackend;
          const rounding = TriCoreMetricConfig[triCoreMetric].rounding;
          targetSecurity.data.mark.mark = targetSecurity.data.mark.markRaw > 0 ? this.round(targetSecurity.data.mark.markRaw, rounding).toFixed(rounding) : null;
        } else {
          targetSecurity.data.mark.markRaw = null;
          targetSecurity.data.mark.mark = null;
        }
        this.calculateMarkDiscrepancies(
          targetRow.data.security,
          newCellDTO.data.quantComparerDTO,
        );
        if (!!newCellDTO.data.quantComparerDTO) {
          if (newCellDTO.data.quantComparerDTO.state.hasBid) {
            targetSecurity.data.bestQuote.bid = newCellDTO.data.quantComparerDTO.data.bid.number;
          } else {
            targetSecurity.data.bestQuote.bid = null;
          }
          if (newCellDTO.data.quantComparerDTO.state.hasOffer) {
            targetSecurity.data.bestQuote.ask = newCellDTO.data.quantComparerDTO.data.offer.number;
          } else {
            targetSecurity.data.bestQuote.ask = null;
          }
        }
        return newCellDTO;
      } else {
        let value;
        value = this.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, targetRow.data.security, false);
        value = (value == null || value === 'n/a') ? null : value;
        newCellDTO.data.textData = value;
        return newCellDTO;
      }
    }

    // TODO: move this into a SecurityTableHelper service 
    public retrieveAttrFromSecurityBasedOnTableHeader(
      targetHeader: SecurityTableHeaderDTO,
      securityCard: SecurityDTO,
      isRetrievingUnderlineValue: boolean
    ): any {
      if (!!targetHeader && !!securityCard) {
        if (!!targetHeader.data.blockAttrName) {
          if (targetHeader.data.blockAttrName === 'metricPack') {
            return this.retrieveSecurityMetricFromMetricPack(securityCard, targetHeader);
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
    public calculateMarkDiscrepancies(
      targetSecurity: SecurityDTO,
      targetQuant: QuantComparerDTO
    ) {
      const markBlock = targetSecurity.data.mark;
      if (!!targetQuant && targetSecurity.data.mark.markRaw) {
        const rounding = this.triCoreMetricConfig[targetSecurity.data.mark.markDriver].rounding;
        if (targetQuant.state.hasBid) {
          markBlock.markDisBidRaw = markBlock.markRaw - targetQuant.data.bid.number;
          markBlock.markDisBid = this.round(markBlock.markDisBidRaw, rounding).toFixed(rounding);
          if (targetSecurity.data.positionFirm > 0) {
            markBlock.markDisLiquidationRaw = markBlock.markDisBidRaw;
            markBlock.markDisLiquidation = markBlock.markDisBid;
          }
        }
        if (targetQuant.state.hasOffer) {
          markBlock.markDisAskRaw = markBlock.markRaw - targetQuant.data.offer.number;
          markBlock.markDisAsk = this.round(markBlock.markDisAskRaw, rounding).toFixed(rounding);
          if (targetSecurity.data.positionFirm < 0) {
            markBlock.markDisLiquidationRaw = markBlock.markDisAskRaw;
            markBlock.markDisLiquidation = markBlock.markDisAsk;
          }
        }
        if (targetQuant.state.hasBid && targetQuant.state.hasOffer) {
          markBlock.markDisMidRaw = markBlock.markRaw - targetQuant.data.mid;
          markBlock.markDisMid = this.round(markBlock.markDisMidRaw, rounding).toFixed(rounding);
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
      }
    }

  // trade specific end
}