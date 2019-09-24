import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {
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
}