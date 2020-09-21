import { Injectable } from '@angular/core';
import { BICsHierarchyAllDataBlock, BICsHierarchyBlock } from 'App/modules/core/models/frontend/frontend-blocks.interface';
import { PortfolioStructureDTO } from 'App/modules/core/models/frontend/frontend-models.interface';

@Injectable()

export class BICsHierarchyService {
  private BICsHierarchyData: BICsHierarchyAllDataBlock;

  public storeFormattedBICsData(data: BICsHierarchyAllDataBlock) {
    this.BICsHierarchyData = data;
  }

}