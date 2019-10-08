import { Injectable } from '@angular/core';
import uuid from 'uuidv4';

declare const require: any;
export const cloneDeep = require('lodash.cloneDeep');

@Injectable()
export class UtilityService {
  // Any code about naming stuff goes into this service

  constructor(){}

  public mapSeniorities(input): number {
    switch (input) {
      case "Sr Unsecured":
        return 1;
      default:
        return 1;
    }
  }

  public mapRatings(input): string {
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

}