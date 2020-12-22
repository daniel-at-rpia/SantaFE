import { Injectable } from '@angular/core';
import { BEBICsHierarchyBlock } from 'Core/models/backend/backend-models.interface';
import { BICSHierarchyDictionaryByLevel } from 'Core/models/frontend/frontend-adhoc-packages.interface';
import { BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX } from 'Core/constants/structureConstants.constants';

@Injectable()

export class BICSDictionaryLookupService {
  private reversedBICSHierarchyDictionary: BICSHierarchyDictionaryByLevel = {
    level1: {},
    level2: {},
    level3: {},
    level4: {}
  };
  private bicsDictionary: BEBICsHierarchyBlock;

  constructor() {}

  public loadBICSData(data: BEBICsHierarchyBlock) {
    this.bicsDictionary = data;
    this.buildReversedBICSHierarchyDictionary(data);
  }

  public returnDictionary(): BEBICsHierarchyBlock {
    return this.bicsDictionary;
  }

  public BICSCodeToBICSName(
    bicsCode: string,
    containSubLevelSuffixIdentifier: boolean = false
  ): string {
    if (!!bicsCode && bicsCode.length >= 2) {
      const targetItemBlock = this.bicsDictionary[bicsCode];
      let bicsName = null;
      if (!!targetItemBlock) {
        if (!!targetItemBlock.item4) {
          bicsName = targetItemBlock.item4;
        } else if (!!targetItemBlock.item3) {
          bicsName = targetItemBlock.item3;
        } else if (!!targetItemBlock.item2) {
          bicsName = targetItemBlock.item2;
        } else {
          bicsName = targetItemBlock.item1;
        }
      }
      const formattedName = bicsCode.length > 2 ? `${bicsName} ${BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX}${Math.floor(bicsCode.length/2)}` : bicsName;
      return containSubLevelSuffixIdentifier ? formattedName : bicsName;
    } else {
      return null;
    }
  }

  public BICSNameToBICSCode(bicsName: string, level: number): string {
    if (level >= 1 && level <= 4) {
      const targetBlock = this.reversedBICSHierarchyDictionary[`level${level}`];
      return targetBlock[bicsName] || null;
    } else {
      return null;
    }
  }

  private buildReversedBICSHierarchyDictionary(data: BEBICsHierarchyBlock) {
    for (let eachCode in data) {
      const block = data[eachCode];
      let bicsName = null;
      let level = 1;
      if (!!block.item4) {
        bicsName = block.item4;
        level = 4;
      } else if (!!block.item3) {
        bicsName = block.item3;
        level = 3;
      } else if (!!block.item2) {
        bicsName = block.item2;
        level = 2;
      } else {
        bicsName = block.item1;
      }
      if (!!bicsName) {
        this.reversedBICSHierarchyDictionary[`level${level}`][bicsName] = eachCode;
      }
    }
  }

}