import { Injectable } from '@angular/core';
import { BESecurityGroupDTO } from 'BEModels/backend-models.interface';
import {
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO
} from 'FEModels/frontend-models.interface';
import {
  SecurityGroupMetricBlock,
  SecurityGroupMetricPackBlock
} from 'FEModels/frontend-blocks.interface';
import {
  MetricOptions,
  BackendKeyDictionary
} from 'Core/constants/marketConstants.constant';
import uuid from 'uuidv4';

declare const require: any;
export const cloneDeep = require('lodash.cloneDeep');

@Injectable()
export class UtilityService {
  // Any code about naming stuff goes into this service
  metricOptions = MetricOptions;
  keyDictionary = BackendKeyDictionary;

  constructor(){}

  public deepCopy(input): any {
    if (!!input) {
      return cloneDeep(input);
    } else {
      return null;
    }
  }

  public mapSeniorities(input): number {
    switch (input) {
      case "Secured":
        return 2;
      case "1st lien":
        return 2;
      case "2nd lien":
        return 2;
      case "3rd lien":
        return 2;
      case "Asset Backed":
        return 2;
      case "Sr Preferred":
        return 3;
      case "Sr Unsecured":
        return 3;
      case "Sr Non Preferred":
        return 3;
      case "Unsecured":
        return 3;
      case "Sr Subordinated":
        return 4;
      case "Subordinated":
        return 4;
      case "Jr Subordinated":
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

  public isCDS(input: SecurityGroupDTO | BESecurityGroupDTO): boolean {
    if (input['data']) {
      const dtoInput = input as SecurityGroupDTO;
      return dtoInput.data.name.indexOf('Cds') >= 0;
    } else {
      const rawDataInput = input as BESecurityGroupDTO;
      return rawDataInput.groupName.indexOf('Cds') >= 0;
    }
  }

  public isEURorGBP(input: SecurityGroupDTO | BESecurityGroupDTO): boolean {
    if (input['data']) {
      const dtoInput = input as SecurityGroupDTO;
      return dtoInput.data.name.indexOf('EUR') >= 0 || dtoInput.data.name.indexOf('GBP') >= 0;
    } else {
      const rawDataInput = input as BESecurityGroupDTO;
      return rawDataInput.groupName.indexOf('EUR') >= 0 || rawDataInput.groupName.indexOf('GBP') >= 0;
    }
  }

  public isFloat(input: SecurityGroupDTO | BESecurityGroupDTO): boolean {
    if (input['data']) {
      const dtoInput = input as SecurityGroupDTO;
      return dtoInput.data.definitionConfig['CouponType'] && dtoInput.data.definitionConfig['CouponType'] === ['Float'];
    } else {
      const rawDataInput = input as BESecurityGroupDTO;
      return rawDataInput.groupIdentifier.groupOptionValues['CouponType'] && rawDataInput.groupIdentifier.groupOptionValues['CouponType'] === ['Float'];
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

  public generateUUID() {
    if (typeof uuid === 'undefined') {
      return 'n/a';
    } else {
      return uuid();
    }
  }

  public normalizeDefinitionFilterOption(rawString): string {
    return rawString;//.replace(' ', '');
  }

  public formDefinitionFilterOptionKey(name, normalizedOption): string {
    return `${name}/${normalizedOption}`;
  }

  public packMetricData(rawData: BESecurityGroupDTO): SecurityGroupMetricPackBlock {
    const object: SecurityGroupMetricPackBlock = {
      raw: {},
      delta: {
        DoD: {},
        WoW: {},
        MoM: {},
        Ytd: {}
      }
    };
    if (!!rawData) {
      this.metricOptions.forEach((eachMetric) => {
        let keyToRetrieveMetric = eachMetric.backendDtoAttrName;
        if (eachMetric.label === 'Default Spread') {
          if (this.isCDS(rawData)) {
            keyToRetrieveMetric = 'spread';
          } else if (this.isFloat(rawData)) {
            keyToRetrieveMetric = 'zSpread';
          } else if (this.isEURorGBP(rawData)) {
            keyToRetrieveMetric = 'zSpread';
          } else {
            keyToRetrieveMetric = 'oasSpread';
          }
        }
        const rawValue = rawData.metrics[keyToRetrieveMetric];
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
      if (value === null || value === undefined) {
        return -3.1415926;
      } else {
        return value;
      }
    }
    return -3.1415926;
  }

  public retrievePrimaryMetricValue(rawData: BESecurityGroupDTO): string {
    let value = `n/a`;
    if (!!rawData) {
      // disable the automatic differentiation betwen IG & HY
      // const rating = rawData.metrics[this.keyDictionary.RATING];
      // if (this.isIG(rating)) {
      const spread = rawData.metrics[this.keyDictionary.SPREAD];
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

  public flattenDefinitionList(configurator: SecurityGroupDefinitionConfiguratorDTO): Array<SecurityGroupDefinitionDTO> {
    const flattenDefinitionList = [];
    configurator.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        flattenDefinitionList.push(eachDefinition);
      });
    });
    return flattenDefinitionList;
  }
}