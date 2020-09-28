import { Injectable } from '@angular/core';
import { BICsHierarchyAllDataBlock, BICsHierarchyBlock, BICsCategorizationBlock } from 'App/modules/core/models/frontend/frontend-blocks.interface';
import { BEBICsHierarchyBlock, BEPortfolioStructuringDTO, BEStructuringBreakdownBlock } from 'Core/models/backend/backend-models.interface';
import { PortfolioBreakdownDTO } from 'Core/models/frontend/frontend-models.interface';
import { DTOService } from 'Core/services/DTOService';
import { BICsLevels } from 'Core/constants/structureConstants.constants';
import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
@Injectable()

export class BICsDataProcessingService {
  private bicsRawData: Array<BICsCategorizationBlock> = [];
  private formattedBICsHierarchyData: BICsHierarchyAllDataBlock;
  private subBicsLevelList: Array<string> = [];
  constructor(private dtoService: DTOService) {}

  public formFormattedBICsHierarchy(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock, counter: number,) {
    this.iterateBICsData(data, parent, counter);
    this.formattedBICsHierarchyData = parent;
    return parent;
  }

  private iterateBICsData(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock, counter: number) {
    if (!data) return;
    for (let category in data) {
      if (!!category) {
        const BICsData: BICsHierarchyBlock = {
          name: category,
          bicsLevel: counter,
          children: []
        }
        parent.children.push(BICsData);
        this.iterateBICsData(data[category], BICsData, BICsData.bicsLevel + 1);
      }
    }
  }

  public getRawBICsData(rawData: BEPortfolioStructuringDTO) {
    const { BicsLevel1, BicsLevel2, BicsLevel3, BicsLevel4 } = rawData.breakdowns;
    const block: BICsCategorizationBlock = {
      portfolioId: rawData.portfolioId,
      bicsLevel1: BicsLevel1,
      bicsLevel2: BicsLevel2,
      bicsLevel3: BicsLevel3,
      bicsLevel4: BicsLevel4
    }
    this.bicsRawData.push(block);
  }

   public getBICsBreakdownDefinitionList(rawData: BEStructuringBreakdownBlock): Array<string> {
    const definitionList = [];
    for (const category in rawData.breakdown) {
      definitionList.push(category);
    }
    return definitionList;
  }

   public getSubLevelList(category: string, bicsLevel: number = 1): Array<string> {
    if(!!this.formattedBICsHierarchyData) {
      const BICSDataList = this.formattedBICsHierarchyData.children.map(category => category); 
      this.getSubLevels(category, bicsLevel, BICSDataList);
      return this.subBicsLevelList;
    }
  }

  private getSubLevels(category: string, bicsLevel: number, data: Array<BICsHierarchyBlock>): Array<string> {
    if (!data || data.length <= 0) return;
    data.forEach(block => {
      for (let key in block) {
        const value = block[key];
        if (category === block.name && bicsLevel === block.bicsLevel) { 
          const subLevels = block.children.map(child => child.name); 
          this.subBicsLevelList = subLevels;
        } else {
          if (Array.isArray(value)) {
            this.getSubLevels(category, bicsLevel, value);
          }
        }
      }
    })
  }

  public formSubLevelBreakdown(breakdownRow: StructurePortfolioBreakdownRowDTO, isDisplayCs01: boolean) {
  const categoryPortfolioId = breakdownRow.data.portfolioId;
  const selectedSubRawBICsData = this.bicsRawData.find(rawData => rawData.portfolioId === categoryPortfolioId); 
  const subTierList = this.getSubLevelList(breakdownRow.data.category, breakdownRow.data.bicsLevel);
  const subBICsLevel = BICsLevels[breakdownRow.data.bicsLevel + 1];
  const selectedSubRawBreakdown: BEStructuringBreakdownBlock  = selectedSubRawBICsData[subBICsLevel];
  const { date, groupOption, indexId, portfolioBreakdownId, portfolioId } = selectedSubRawBreakdown;
  const object: BEStructuringBreakdownBlock = {
    date,
    groupOption,
    indexId,
    portfolioBreakdownId,
    portfolioId,
    breakdown: {}
  }
  subTierList.forEach(subTier => {
    for (let category in selectedSubRawBreakdown.breakdown) {
      if (!!category && selectedSubRawBreakdown.breakdown[category]) {
        if (subTier === category) {
          object.breakdown[subTier] = selectedSubRawBreakdown.breakdown[category];
        }
      }
    }
  })
  const definitionList = this.getBICsBreakdownDefinitionList(object);
  const breakdown: PortfolioBreakdownDTO = this.dtoService.formPortfolioBreakdown(false, object, definitionList, isDisplayCs01);
  breakdown.data.rawCs01CategoryList.forEach(category => {
    category.data.bicsLevel = breakdownRow.data.bicsLevel + 1;
    category.data.moveVisualizer.state.isStencil = false;
  })
  breakdown.data.rawLeverageCategoryList.forEach(category => {
    category.data.bicsLevel = breakdownRow.data.bicsLevel + 1;
    category.data.moveVisualizer.state.isStencil = false;
  })
  breakdown.data.displayCategoryList = breakdown.state.isDisplayingCs01 ? breakdown.data.rawCs01CategoryList : breakdown.data.rawLeverageCategoryList;
  breakdown.data.title = breakdownRow.data.category;
  return breakdown;
}

}