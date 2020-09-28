import { Injectable } from '@angular/core';
import { BICsHierarchyAllDataBlock, BICsHierarchyBlock } from 'App/modules/core/models/frontend/frontend-blocks.interface';
import { BEBICsHierarchyBlock } from 'Core/models/backend/backend-models.interface';

@Injectable()

export class BICsDataProcessingService {
  constructor() {}

  public formFormattedBICsHierarchy(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock, counter: number,) {
    this.iterateBICsData(data, parent, counter);
    return parent;
  }

  private iterateBICsData(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock, counter: number) {
    if (!data) return;
    for (let category in data) {
      if (!!category) {
        const BICsData: BICsHierarchyBlock = {
          name: category,
          tier: counter,
          children: []
        }
        parent.children.push(BICsData);
        this.iterateBICsData(data[category], BICsData, BICsData.tier + 1);
      }
    }
  }

}