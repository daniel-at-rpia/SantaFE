import { Injectable } from '@angular/core';
import { BICsHierarchyAllDataBlock, BICsHierarchyBlock, BICsCategorizationBlock } from 'App/modules/core/models/frontend/frontend-blocks.interface';
import { BEBICsHierarchyBlock, BEPortfolioStructuringDTO, BEStructuringBreakdownBlock } from 'Core/models/backend/backend-models.interface';
import { PortfolioBreakdownDTO, MoveVisualizerDTO, StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import { DTOService } from 'Core/services/DTOService';
import { BICsLevels } from 'Core/constants/structureConstants.constants';
@Injectable()

export class BICsDataProcessingService {
  private bicsRawData: Array<BICsCategorizationBlock> = [];
  private formattedBICsHierarchyData: BICsHierarchyAllDataBlock;
  private subBicsLevelList: Array<string> = [];
  constructor(
    private dtoService: DTOService
  ) {}

  public formFormattedBICsHierarchy(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock, counter: number,) {
    this.iterateBICsData(data, parent, counter);
    this.formattedBICsHierarchyData = parent;
    return parent;
  }

  public setRawBICsData(rawData: BEPortfolioStructuringDTO) {
    const { BicsLevel1, BicsLevel2, BicsLevel3, BicsLevel4 } = rawData.breakdowns;
    const block: BICsCategorizationBlock = {
      portfolioID: rawData.portfolioId,
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

  public formSubLevelBreakdown(breakdownRow: StructurePortfolioBreakdownRowDTO, isDisplayCs01: boolean) {
  const categoryPortfolioID = breakdownRow.data.portfolioID;
  const selectedSubRawBICsData = this.bicsRawData.find(rawData => rawData.portfolioID === categoryPortfolioID);
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
  breakdown.data.diveInLevel = breakdownRow.data.diveInLevel + 1;
  this.setBreakdownListProperties(breakdown.data.rawCs01CategoryList, breakdownRow);
  this.setBreakdownListProperties(breakdown.data.rawLeverageCategoryList, breakdownRow);
  breakdown.data.displayCategoryList = breakdown.state.isDisplayingCs01 ? breakdown.data.rawCs01CategoryList : breakdown.data.rawLeverageCategoryList;
  breakdown.data.title = breakdownRow.data.category;
  return breakdown;
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

private setBreakdownListProperties(breakdownList: Array<StructurePortfolioBreakdownRowDTO>, parentRow: StructurePortfolioBreakdownRowDTO) {
  breakdownList.forEach(breakdown => {
    breakdown.data.bicsLevel = parentRow.data.bicsLevel + 1;
    breakdown.data.diveInLevel = parentRow.data.diveInLevel + 1;
    breakdown.data.moveVisualizer.state.isStencil = false;
    breakdown.state.isStencil = false;
    breakdown.data.moveVisualizer.data.diveInLevel = breakdown.data.diveInLevel;
    this.applyPopoverStencilMasks(breakdown.data.moveVisualizer);
  })
}

private applyPopoverStencilMasks(visualizer: MoveVisualizerDTO) {
  switch(visualizer.data.diveInLevel) {
    case 1:
      visualizer.style.backgroundColor = "#f5f5f5";
      break;
    case 2:
    visualizer.style.backgroundColor = "#eee";
      break;
    case 3:
    visualizer.style.backgroundColor = "#d5d5d5";
      break;
    default:
    visualizer.style.backgroundColor = "#eee";
  }
}

}