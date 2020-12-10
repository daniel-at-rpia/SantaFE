import { Injectable } from '@angular/core';
import {
  BICsHierarchyAllDataBlock,
  BICsHierarchyBlock,
  BICsCategorizationBlock,
  SecurityDefinitionFilterBlock
} from 'App/modules/core/models/frontend/frontend-blocks.interface';
import {
  BEBICsHierarchyBlock,
  BEPortfolioStructuringDTO,
  BEStructuringBreakdownBlock,
  BEMetricBreakdowns
} from 'Core/models/backend/backend-models.interface';
import {
  PortfolioBreakdownDTO,
  MoveVisualizerDTO,
  StructurePortfolioBreakdownRowDTO
} from 'Core/models/frontend/frontend-models.interface';
import {
  DefinitionConfiguratorEmitterParams,
  BICSServiceConsolidateReturnPack,
  BICSHierarchyDictionaryByLevel,
  AdhocExtensionBEMetricBreakdowns
} from 'Core/models/frontend/frontend-adhoc-packages.interface';
import {
  BICS_BRANCH_DEFAULT_HEIGHT,
  BICS_BRANCH_DEFAULT_HEIGHT_LARGE,
  BICS_BRANCH_CHARACTER_LIMIT,
  BICS_DICTIONARY_KEY_PREFIX,
  BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX
} from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { BICsLevels } from 'Core/constants/structureConstants.constants';
import { UtilityService } from './UtilityService';

@Injectable()

export class BICsDataProcessingService {
  private reversedBICSHierarchyDictionary: BICSHierarchyDictionaryByLevel = {
    level1: {},
    level2: {},
    level3: {},
    level4: {}
  };
  private bicsRawData: Array<BICsCategorizationBlock> = [];
  private formattedBICsHierarchyData: BICsHierarchyAllDataBlock;
  private subBicsLevelList: Array<string> = [];
  private bicsDictionary: BEBICsHierarchyBlock;

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService
  ) {}

  public loadBICSData(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock) {
    this.bicsDictionary = data;
    this.buildReversedBICSHierarchyDictionary(data);
    this.setBICsLevelOneCategories(data, parent)
    this.iterateBICsData(data, parent);
    this.formattedBICsHierarchyData = parent;
  }

  public getTargetSpecificHierarchyList(childCode: string, childBicsLevel: number): Array<BICsHierarchyBlock> {
    const data = this.bicsDictionary[childCode];
    const hierarchyDataList: Array<BICsHierarchyBlock> = [];
    for (let item in data) {
      if (!!data[item]) {
        const itemLevel: number = +(item.split(BICS_DICTIONARY_KEY_PREFIX)[1]);
        if (itemLevel < childBicsLevel) {
          const object: BICsHierarchyBlock = {
            name: data[item],
            bicsLevel: itemLevel,
            code: childCode.substring(0, itemLevel * 2),
            children: null
          }
          hierarchyDataList.push(object);
        }
      }
    }
    return hierarchyDataList;
  }

  public addSortedRegularBICsWithSublevels(rowList: Array<StructurePortfolioBreakdownRowDTO>): Array<StructurePortfolioBreakdownRowDTO> {
    const rowListCopy = this.utilityService.deepCopy(rowList);
    const primaryRowList = rowListCopy.filter((row: StructurePortfolioBreakdownRowDTO) => row.data.bicsLevel === 1);
    const subRowList = rowListCopy.filter((row: StructurePortfolioBreakdownRowDTO) => row.data.bicsLevel >= 2);
    const parsedRowList: Array<StructurePortfolioBreakdownRowDTO> = [];
    if (subRowList.length > 0) {
      subRowList.forEach((eachRow: StructurePortfolioBreakdownRowDTO) => {
        if (!!eachRow.data.targetLevel) {
          const ifExistsInParsedList = parsedRowList.find(parsedRow => parsedRow.data.code === eachRow.data.code)
          !ifExistsInParsedList && parsedRowList.push(eachRow);
          const hierarchyList: Array<BICsHierarchyBlock> = this.getTargetSpecificHierarchyList(eachRow.data.code, eachRow.data.bicsLevel);
          if (hierarchyList.length > 0) {
            hierarchyList.forEach((listItem: BICsHierarchyBlock) => {
              const ifExistsInParsedList = parsedRowList.find(parsedRow => parsedRow.data.code === listItem.code);
              if (!ifExistsInParsedList) {
                const matchedRow = subRowList.find((subRow: StructurePortfolioBreakdownRowDTO) => subRow.data.code === listItem.code);
                if (!!matchedRow) {
                  parsedRowList.push(matchedRow);
                }
              }
            })
          }
        }
      })
      if (parsedRowList.length > 0 ) {
        // parsedRowList should be sorted in ascending order to ensure that parentRow lookup can be done
        parsedRowList.sort((rowA: StructurePortfolioBreakdownRowDTO, rowB: StructurePortfolioBreakdownRowDTO) => {
          if (rowA.data.bicsLevel < rowB.data.bicsLevel) {
            return - 1
          } else if (rowA.data.bicsLevel > rowB.data.bicsLevel) {
            return 1;
          } else {
            return 0;
          }
        });
        parsedRowList.forEach((row: StructurePortfolioBreakdownRowDTO) => {
          const hierarchyList: Array<BICsHierarchyBlock> = this.getTargetSpecificHierarchyList(row.data.code, row.data.bicsLevel);
          const parentLevel = !!row.data.bicsLevel ? row.data.bicsLevel - 1: null;
          if (!!parentLevel) {
            const parentRow = hierarchyList.find(parentRow => parentRow.bicsLevel === parentLevel);
            row.data.parentRow = primaryRowList.find(targetRow => targetRow.data.category === parentRow.name && targetRow.data.bicsLevel === parentRow.bicsLevel);
            const parentIndex = primaryRowList.findIndex(primaryRow => primaryRow.data.category === parentRow.name && primaryRow.data.bicsLevel === parentRow.bicsLevel);
            const subRowIndex = parentIndex + 1;
            primaryRowList.splice(subRowIndex, 0, row);
          }
        })
        const newRowList: Array<StructurePortfolioBreakdownRowDTO> = this.formUIBranchForSubLevels(primaryRowList);
        newRowList.forEach(newRow => {
          this.getDisplayedSubLevelsForCategory(newRow, newRowList);
        })
        return newRowList;
      } else {
        return primaryRowList;
      }
    } else {
      return primaryRowList;
    }
  }

  public formUIBranchForSubLevels(rowList: Array<StructurePortfolioBreakdownRowDTO>) {
    const rowListCopy = this.utilityService.deepCopy(rowList);
    rowListCopy.forEach((row: StructurePortfolioBreakdownRowDTO, i) => {
      if (row.data.bicsLevel >= 2) {
        const previousRow: StructurePortfolioBreakdownRowDTO = rowListCopy[i-1];
        const branchHeight = previousRow.data.displayCategory.length >= BICS_BRANCH_CHARACTER_LIMIT ? BICS_BRANCH_DEFAULT_HEIGHT_LARGE : BICS_BRANCH_DEFAULT_HEIGHT;
        if (previousRow.data.bicsLevel === row.data.bicsLevel - 1 || previousRow.data.bicsLevel === row.data.bicsLevel) {
          // previous row is a parent or sibling element, so the branch needs to only extend to the button before it
          row.style.branchHeight = `${branchHeight}px`;
          row.style.top = `-${branchHeight/2}px`;
        } else if (row.data.bicsLevel < previousRow.data.bicsLevel) {
        // needs to find the closest sibling element as the previous row is a child of a sibling element
        const modifiedList: Array<StructurePortfolioBreakdownRowDTO> = rowListCopy.slice(0, i);
        const findSiblingRows: Array<StructurePortfolioBreakdownRowDTO> = modifiedList.filter(sibilingRow => !!sibilingRow.data.parentRow && sibilingRow.data.parentRow.data.code === row.data.parentRow.data.code);
        const nearestSiblingRow: StructurePortfolioBreakdownRowDTO = findSiblingRows[findSiblingRows.length - 1];
        const sibilingRowIndex = rowListCopy.findIndex(eachRow => eachRow.data.code === nearestSiblingRow.data.code);
        const indexDifference = i - sibilingRowIndex;
        row.style.branchHeight = `${indexDifference * branchHeight}px`;
        row.style.top = `-${(indexDifference * branchHeight) - (branchHeight / 2)}px`;
        }
      }
    })
    return rowListCopy;
  }
  public returnAllBICSBasedOnHierarchyDepth(depth: number): Array<string> {
    const allBICSList = [];
    this.recursiveTraverseForPackagingAllBICSAtGivenDepth(
      allBICSList,
      this.formattedBICsHierarchyData.children,
      depth,
      1
    );
    allBICSList.sort((bicsA, bicsB) => {
      if (bicsA > bicsB) {
        return 1;
      } else if (bicsB > bicsA) {
        return -1;
      } else {
        return 0;
      }
    });
    return allBICSList;
  }

  public setRawBICsData(rawData: BEPortfolioStructuringDTO) {
    const { BicsCodeLevel1, BicsCodeLevel2, BicsCodeLevel3, BicsCodeLevel4 } = rawData.breakdowns;
    const block: BICsCategorizationBlock = {
      portfolioID: rawData.portfolioId,
      bicsLevel1: BicsCodeLevel1,
      bicsLevel2: BicsCodeLevel2,
      bicsLevel3: BicsCodeLevel3,
      bicsLevel4: BicsCodeLevel4
    }
    const existingPortfolioIndex = this.bicsRawData.findIndex(portfolio => portfolio.portfolioID === block.portfolioID);
    if (existingPortfolioIndex > -1) {
      this.bicsRawData[existingPortfolioIndex] = block;
    } else {
      this.bicsRawData.push(block);
    }
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

  public formSubLevelBreakdown(
    breakdownRow: StructurePortfolioBreakdownRowDTO,
    isDisplayCs01: boolean
  ) {
    const categoryPortfolioID = breakdownRow.data.portfolioID;
    const selectedSubRawBICsData = this.bicsRawData.find(rawData => rawData.portfolioID === categoryPortfolioID);
    const subTierList = this.getSubLevelList(breakdownRow.data.category, breakdownRow.data.bicsLevel);
    const subBICsLevel = BICsLevels[breakdownRow.data.bicsLevel + 1];
    const selectedSubRawBreakdown: BEStructuringBreakdownBlock  = selectedSubRawBICsData[subBICsLevel];
    if (!!selectedSubRawBreakdown) {
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
        const categoryCode = this.BICSNameToBICSCode(subTier, breakdownRow.data.bicsLevel + 1);
        for (let code in selectedSubRawBreakdown.breakdown) {
          if (!!code && selectedSubRawBreakdown.breakdown[code]) {
            if (categoryCode === code) {
              object.breakdown[subTier] = selectedSubRawBreakdown.breakdown[code];
              (object.breakdown[subTier] as AdhocExtensionBEMetricBreakdowns).customLevel = breakdownRow.data.bicsLevel + 1;
              (object.breakdown[subTier] as AdhocExtensionBEMetricBreakdowns).code = code;
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
  }

  public formBICSRow(code: string, portfolioID: number, level: number, isCs01: boolean): Array<StructurePortfolioBreakdownRowDTO> {
    const rawData: BICsCategorizationBlock = this.bicsRawData.find(bicsData => bicsData.portfolioID === portfolioID);
    if (!!rawData) {
      const bicsLevel = BICsLevels[level];
      const rawBreakdown: BEStructuringBreakdownBlock = rawData[bicsLevel];
      if (!!rawBreakdown) {
        const { date, groupOption, indexId, portfolioBreakdownId, portfolioId } = rawBreakdown;
        const customRawBreakdown: BEStructuringBreakdownBlock = {
          date,
          groupOption,
          indexId,
          portfolioBreakdownId,
          portfolioId,
          breakdown: {}
        }
        const breakdownData = rawData[bicsLevel].breakdown[code];
        if (!!breakdownData) {
          customRawBreakdown.breakdown[code] = breakdownData;
          (customRawBreakdown.breakdown[code] as AdhocExtensionBEMetricBreakdowns).customLevel = level;
        }
        const customBreakdown: PortfolioBreakdownDTO = this.dtoService.formPortfolioBreakdown(false, customRawBreakdown, [code], isCs01, false);
        const cs01Row = customBreakdown.data.rawCs01CategoryList[0];
        const creditLeverageRow = customBreakdown.data.rawLeverageCategoryList[0];
        if (!!cs01Row && !!creditLeverageRow) {
          cs01Row.state.isStencil = false;
          cs01Row.data.moveVisualizer.state.isStencil = false;
          creditLeverageRow.state.isStencil = false;
          creditLeverageRow.data.moveVisualizer.state.isStencil = false;
          return [cs01Row, creditLeverageRow];
        }
      }
    }
  }

  public getShallowestLevel(category: string): number {
    // traverse the bics and return the level of the earliest encounter of a given bics, useful to find the true level of a bics since now that same category would nest over and over
    // not used in anywhere but might be useful
    return this.getLevelRecursion(
      category,
      1,
      this.formattedBICsHierarchyData.children
    );
  }

  public consolidateBICS(
    definitionBlockList: Array<SecurityDefinitionFilterBlock>
  ): BICSServiceConsolidateReturnPack {
    let deepestLevel = 4;
    // temporarily disable this, always set level to 4
    // definitionBlockList.forEach((eachBlock) =>{
    //   if (eachBlock.bicsLevel > deepestLevel) {
    //     deepestLevel = eachBlock.bicsLevel;
    //   }
    // });
    let convertedToLowestLevelStrings = [];
    definitionBlockList.forEach((eachBlock) => {
      if (eachBlock.bicsLevel < deepestLevel) {
        const eachResult:Array<string> = this.convertCategoryToChildren(eachBlock.shortKey, eachBlock.bicsLevel, deepestLevel);
        convertedToLowestLevelStrings = convertedToLowestLevelStrings.concat(eachResult);
      } else {
        convertedToLowestLevelStrings.push(eachBlock.shortKey);
      }
    });
    return {
      deepestLevel: deepestLevel,
      consolidatedStrings: convertedToLowestLevelStrings
    };
  }

  public getDisplayedSubLevelsForCategory(row: StructurePortfolioBreakdownRowDTO, rowList: Array<StructurePortfolioBreakdownRowDTO>){
    if (row.data.displayedSubLevelRows.length > 0) {
      row.data.displayedSubLevelRows.forEach(subLevel => {
        subLevel.state.isVisibleSubLevel = !!row.state.isShowingSubLevels;
      })
    } else {
      const rowIndex = rowList.findIndex(displayRow => displayRow.data.code === row.data.code);
      const modifiedDisplayList: Array<StructurePortfolioBreakdownRowDTO> = rowList.slice(rowIndex + 1);
      if (rowIndex >= 0) {
        for (let i = 0; i < modifiedDisplayList.length; i++) {
          const isSubLevel = modifiedDisplayList[i].data.code.indexOf(row.data.code) === 0;
          if (!!isSubLevel) {
            row.data.displayedSubLevelRows.push(modifiedDisplayList[i])
          } else {
            break;
          }
        }
      }
    }
  }

  public resetBICsSubLevelsState(rowList: Array<StructurePortfolioBreakdownRowDTO>) {
    rowList.forEach(row => {
      if (row.data.bicsLevel === 1) {
        row.state.isShowingSubLevels = false;
      } else {
        row.state.isVisibleSubLevel = false;
      }
    })
  }

  public BICSCodeToBICSName(bicsCode: string): string {
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
      return formattedName;
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

  private setBreakdownListProperties(
    breakdownList: Array<StructurePortfolioBreakdownRowDTO>,
    parentRow: StructurePortfolioBreakdownRowDTO
  ) {
    breakdownList.forEach(breakdown => {
      breakdown.data.bicsLevel = parentRow.data.bicsLevel + 1;
      breakdown.data.diveInLevel = parentRow.data.diveInLevel + 1;
      breakdown.data.moveVisualizer.state.isStencil = false;
      breakdown.state.isStencil = false;
      breakdown.data.moveVisualizer.data.diveInLevel = breakdown.data.diveInLevel;
      breakdown.state.isWithinPopover = true;
      this.applyPopoverStencilMasks(breakdown.data.moveVisualizer);
      if (breakdown.data.bicsLevel >= 4) {
        breakdown.state.isBtnDiveIn = false;
      }
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

  private setBICsLevelOneCategories(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock) {
    for (let code in data) {
      if (!!data[code]) {
        const intiialLevel = 1;
        const key = `item${intiialLevel}`;
        const BICsData: BICsHierarchyBlock = {
          name: data[code][key],
          bicsLevel: intiialLevel,
          code: code,
          children: []
        }
        const isExists = parent.children.find(block => block.name === data[code][key])
        if (!isExists) {
          parent.children.push(BICsData);;
        }
      }
    }
  }

  private formCompleteHierarchyWithSubLevels(rawData: BEBICsHierarchyBlock, parent: BICsHierarchyBlock | Array<BICsHierarchyBlock> , counter: number) {
    counter += 1;
    const parentKey = `item${counter - 1}`;
    const targetKey = `item${counter}`;
    const keyAfterTarget = `item${counter + 1}`;
    if (counter < 5) {
      if (Array.isArray(parent)) {
        parent.forEach(category => {
          for (let code in rawData) {
            if (!!rawData[code] && !!rawData[code][targetKey] && rawData[code][parentKey] === category.name && (!rawData[code][keyAfterTarget] === null || !rawData[code][keyAfterTarget])) {
              const BICSData: BICsHierarchyBlock = {
                name: rawData[code][targetKey],
                bicsLevel: counter,
                code: code,
                children: []
              }
              const isExists = category.children.find(existingCategory => existingCategory.name === rawData[code][targetKey]);
              if (!isExists) {
                category.children.push(BICSData);
              }
              this.formCompleteHierarchyWithSubLevels(rawData, category.children, counter);
            }
          }
        })
      } else {
        for (let code in rawData) {
          if (!!rawData[code] && !!rawData[code][targetKey] && rawData[code][keyAfterTarget] === null) {
            if (rawData[code][parentKey] === parent.name) {
              const BICSData: BICsHierarchyBlock = {
                name: rawData[code][targetKey],
                bicsLevel: counter,
                code: code,
                children: []
              }
              parent.children.push(BICSData);
              this.formCompleteHierarchyWithSubLevels(rawData, parent.children, counter)
            }
          }
        }
      }
    }
  }

  private iterateBICsData(rawData: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock) {
    parent.children.forEach(category => {
      let counter = 1;
      this.formCompleteHierarchyWithSubLevels(rawData, category, counter)
    })
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

  private recursiveTraverseForPackagingAllBICSAtGivenDepth(
    packageList: Array<string>,
    formattedDataList: Array<BICsHierarchyBlock>,
    targetDepth: number,
    counter: number
  ) {
    if (targetDepth === counter) {
      formattedDataList.forEach((eachBlock) => {
        packageList.push(eachBlock.name);
      });
    } else {
      formattedDataList.forEach((eachBlock) => {
        if (eachBlock.children && eachBlock.children.length > 0) {
          const newCounter = counter + 1;
          this.recursiveTraverseForPackagingAllBICSAtGivenDepth(
            packageList,
            eachBlock.children,
            targetDepth,
            newCounter
          );
        }
      });
    }
  }

  private getLevelRecursion(
    targetCategory: string,
    currentLevel: number,
    currentLevelBlockList: Array<BICsHierarchyBlock>
  ): number {
    if (!currentLevelBlockList || currentLevelBlockList.length === 0) {
      return -1;
    } else {
      const existOnThisLevel = currentLevelBlockList.find((eachBlock) => {
        return eachBlock.name === targetCategory;
      });
      if (!!existOnThisLevel) {
        return currentLevel;
      } else {
        const resultInChild = currentLevelBlockList.map((eachBlock) => {
          return this.getLevelRecursion(
            targetCategory,
            currentLevel+1,
            eachBlock.children
          );
        });
        const childExistLevel = Math.max(...resultInChild);
        if ( childExistLevel > 0) {
          return childExistLevel;
        } else {
          return -1;
        }
      }
    }
  }

  private convertCategoryToChildren(
    category: string,
    categoryLevel: number,
    targetLevel: number
  ): Array<string>{
    let loopCategoryList = [category];
    for (let i = categoryLevel; i < targetLevel; i++) {
      let convertResult = [];
      loopCategoryList.forEach((eachCategory) =>{
        const children = this.getSubLevelList(eachCategory, i);
        convertResult = convertResult.concat(children);
      });
      loopCategoryList = convertResult;
    }
    return loopCategoryList;
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