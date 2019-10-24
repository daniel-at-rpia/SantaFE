import { Injectable } from '@angular/core';
import { BESecurityGroupDTO } from 'BEModels/backend-models.interface';
import { SecurityGroupDTO } from 'FEModels/frontend-models.interface';
import {
  SecurityGroupMetricBlock,
  SecurityGroupMetricPackBlock
} from 'FEModels/frontend-blocks.interface';
import {
  MetricOptions,
  BackendKeyDictionary
} from 'App/stubs/marketModuleSpecifics.stub';
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
      case "1st Lien Secured":
        return 1;
      case "1st lien":
        return 1;
      case "2nd lien":
        return 1;
      case "2nd lien Secured":
        return 1;
      case "Secured":
        return 2;
      case "Asset Backed":
        return 2;
      case "Sr Unsecured":
        return 2;
      case "Sr Subordinated":
        return 3;
      case "Subordinated":
        return 3;
      case "Jr Subordinated":
        return 3;
      case "Sr Preferred":
        return 4;
      case "Preferred":
        return 4;
      case "Sr Non Preferred":
        return 4;
      case "Unsecured":
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

  public isIG(input:string): boolean {
    if (input === 'AAA' || input === 'AA' || input === 'A' || input === 'BBB') {
      return true;
    } else {
      return false;
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
    return rawString.replace(' ', '');
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
        Mtd: {},
        MoM: {},
        Ytd: {}
      }
    };
    if (!!rawData) {
      this.metricOptions.forEach((eachMetric) => {
        const rawValue = rawData.metrics[eachMetric.backendDtoAttrName];
        if (rawValue === null || rawValue === undefined) {
          object.raw[eachMetric.label] = null;
        } else {
          if (eachMetric.label === 'Size') {
            object.raw[eachMetric.label] = Math.round(rawValue/100)/10000;
          } else {
            object.raw[eachMetric.label] = Math.round(rawValue*100)/100;
          }
        }
        eachMetric.deltaOptions.forEach((eachDeltaScope) => {
          const deltaSubPack = rawData.deltaMetrics[eachDeltaScope];
          const deltaValue = !!deltaSubPack ? deltaSubPack[eachMetric.backendDtoAttrName] : null;
          if (deltaValue === null || deltaValue === undefined) {
            object.delta[eachDeltaScope][eachMetric.label] = null;
          } else {
            if (eachMetric.label === 'Size') {
              object.delta[eachDeltaScope][eachMetric.label] = Math.round(deltaValue/100)/10000;
            } else {
              object.delta[eachDeltaScope][eachMetric.label] = Math.round(deltaValue*1000)/1000;
            }
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
        value = Math.round(value*1000)/1000;
      } else {
        value = groupDTO.data.metricPack.raw[metricLabel];
        value = Math.round(value*100)/100;
      }
      if (value === null || value === undefined) {
        return -3.1415926;
      } else {
        // further round the metric if it is Size
        if (metricLabel === 'Size') {
          return Math.round(value);
        } else {
          return value;
        }
      }
    }
    return -3.1415926;
  }

  public retrievePrimaryMetricValue(rawData: BESecurityGroupDTO): string {
    let value = `n/a`;
    if (!!rawData) {
      const rating = rawData.metrics[this.keyDictionary.RATING];
      if (this.isIG(rating)) {
        const spread = rawData.metrics[this.keyDictionary.SPREAD];
        value = `${Math.round(spread)}`;
      } else {
        const price = rawData.metrics[this.keyDictionary.PRICE];
        const yieldVal = rawData.metrics[this.keyDictionary.YIELD];
        value = `${Math.round(price*100)/100} / ${Math.round(yieldVal*100)/100}`;
      }
    }
    return value;
  }

  public retrieveRawSupportingDataForLeftPie(rawData: BESecurityGroupDTO): object {
    if (!!rawData) {
      const object = rawData.descriptiveMetrics[this.keyDictionary.RATING_DES];
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
    if (!!rawData) {
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
}