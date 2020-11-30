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
  BEStructuringBreakdownBlock
} from 'Core/models/backend/backend-models.interface';
import {
  PortfolioBreakdownDTO,
  MoveVisualizerDTO,
  StructurePortfolioBreakdownRowDTO
} from 'Core/models/frontend/frontend-models.interface';
import {
  DefinitionConfiguratorEmitterParams,
  BICSServiceConsolidateReturnPack,
} from 'Core/models/frontend/frontend-adhoc-packages.interface';
import {
  BICS_BRANCH_DEFAULT_HEIGHT,
  BICS_BRANCH_DEFAULT_HEIGHT_LARGE,
  BICS_BRANCH_CHARACTER_LIMIT
} from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { BICsLevels } from 'Core/constants/structureConstants.constants';
import { UtilityService } from './UtilityService';

@Injectable()

export class BICsDataProcessingService {
  private bicsRawData: Array<BICsCategorizationBlock> = [];
  private formattedBICsHierarchyData: BICsHierarchyAllDataBlock;
  private subBicsLevelList: Array<string> = [];
  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService
  ) {}

  public formFormattedBICsHierarchy(data: BEBICsHierarchyBlock, parent: BICsHierarchyAllDataBlock | BICsHierarchyBlock) {
    this.setBICsLevelOneCategories(data, parent)
    this.iterateBICsData(data, parent);
    this.formattedBICsHierarchyData = parent;
    return parent;
  }

  public getParentCategory(hierarchyData: Array<BICsHierarchyBlock>, hierarchyList: Array<BICsHierarchyBlock>, targetCategory: BICsHierarchyBlock) {
    if (!!targetCategory) {
      hierarchyData.forEach((block: BICsHierarchyBlock) => {
        if (block.children.length > 0) {
          const parentCategory = block.children.find(category => category.name === targetCategory.name && category.bicsLevel === targetCategory.bicsLevel);
          if (!!parentCategory && block.bicsLevel === targetCategory.bicsLevel - 1) {
            hierarchyList.push(block)
            this.getParentCategory(hierarchyData, hierarchyList, block);
          }
        }
      })
    }
  }

  public getTargetSpecificHierarchyList(childCategory: string, childBicsLevel: number, hierarchyList: Array<BICsHierarchyBlock>): Array<BICsHierarchyBlock> {
    if (!!this.formattedBICsHierarchyData) {
      let isFound = false;
      this.formattedBICsHierarchyData.children.forEach(mainCategory => {
        let categoryTraversalList: Array<BICsHierarchyBlock> = [{name: mainCategory.name, bicsLevel: mainCategory.bicsLevel, children: mainCategory.children, code: mainCategory.code}];
        const traverseThroughCategories = (block: Array<BICsHierarchyBlock>, targetCategory: string) => {
          if (!!isFound)  {
            return;
          } else {
            block.forEach(newCategory => {
              categoryTraversalList.push({name: newCategory.name, bicsLevel: newCategory.bicsLevel, children: newCategory.children, code: mainCategory.code});
              if (newCategory.name === targetCategory && newCategory.bicsLevel === childBicsLevel) {
                isFound = true;
                this.getParentCategory(categoryTraversalList, hierarchyList, newCategory);
              } else {
                if (!isFound ) {
                  traverseThroughCategories(newCategory.children, childCategory);
                }
              }
            })
          }
        }
        if (mainCategory.children.length > 0) {
          traverseThroughCategories(mainCategory.children, childCategory);
        }
      })
      return hierarchyList;
    }
  }

  public addSortedRegularBICsWithSublevels(rowList: Array<StructurePortfolioBreakdownRowDTO>): Array<StructurePortfolioBreakdownRowDTO> {
    const rowListCopy = this.utilityService.deepCopy(rowList);
    const primaryRowList = rowListCopy.filter((row: StructurePortfolioBreakdownRowDTO) => row.data.bicsLevel === 1);
    const subRowList = rowListCopy.filter((row: StructurePortfolioBreakdownRowDTO) => row.data.bicsLevel >= 2);
    const parsedRowList: Array<StructurePortfolioBreakdownRowDTO> = [];
    if (subRowList.length > 0) {
      subRowList.forEach((eachRow: StructurePortfolioBreakdownRowDTO) => {
        if (!!eachRow.data.targetLevel) {
          parsedRowList.push(eachRow);
          const hierarchyList: Array<BICsHierarchyBlock> = this.getTargetSpecificHierarchyList(eachRow.data.category, eachRow.data.bicsLevel, []);
          if (hierarchyList.length > 0) {
            hierarchyList.forEach((listItem: BICsHierarchyBlock) => {
              const ifExistsInParsedList = parsedRowList.find(parsedRow => !!parsedRow && parsedRow.data.displayCategory === listItem.name && parsedRow.data.bicsLevel === listItem.bicsLevel);
              if (!ifExistsInParsedList && eachRow.data.bicsLevel >= 3) { // level 2 parent category is in the primary list already
                const matchedRow = subRowList.find((subRow: StructurePortfolioBreakdownRowDTO) => subRow.data.displayCategory === listItem.name && subRow.data.bicsLevel === listItem.bicsLevel);
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
          const hierarchyList: Array<BICsHierarchyBlock> = this.getTargetSpecificHierarchyList(row.data.category, row.data.bicsLevel, []);
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
        return rowList;
      }
    } else {
      return rowList;
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
        const findSiblingRows: Array<StructurePortfolioBreakdownRowDTO> = modifiedList.filter(sibilingRow => !!sibilingRow.data.parentRow && sibilingRow.data.parentRow.data.displayCategory === row.data.parentRow.data.displayCategory);
        const nearestSiblingRow: StructurePortfolioBreakdownRowDTO = findSiblingRows[findSiblingRows.length - 1];
        const sibilingRowIndex = rowListCopy.findIndex(eachRow => eachRow.data.displayCategory === nearestSiblingRow.data.displayCategory && eachRow.data.bicsLevel === nearestSiblingRow.data.bicsLevel); 
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
    const { BicsLevel1, BicsLevel2, BicsLevel3, BicsLevel4 } = rawData.breakdowns;
    const block: BICsCategorizationBlock = {
      portfolioID: rawData.portfolioId,
      bicsLevel1: BicsLevel1,
      bicsLevel2: BicsLevel2,
      bicsLevel3: BicsLevel3,
      bicsLevel4: BicsLevel4
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

  public formSubLevelBreakdown(breakdownRow: StructurePortfolioBreakdownRowDTO, isDisplayCs01: boolean, isEditingView: boolean) {
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
      breakdown.state.isEditingView = !!isEditingView;
      this.setBreakdownListProperties(breakdown.data.rawCs01CategoryList, breakdownRow, isEditingView);
      this.setBreakdownListProperties(breakdown.data.rawLeverageCategoryList, breakdownRow, isEditingView);
      breakdown.data.displayCategoryList = breakdown.state.isDisplayingCs01 ? breakdown.data.rawCs01CategoryList : breakdown.data.rawLeverageCategoryList;
      breakdown.data.title = breakdownRow.data.category;
      return breakdown;
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
        row.state.isShowingSubLevels = !row.state.isShowingSubLevels;
        row.data.displayedSubLevelRows.forEach(subLevel => {
          subLevel.state.isVisibleSubLevel = !subLevel.state.isVisibleSubLevel;
        })
    } else {
      const rowIndex = rowList.findIndex(displayRow => displayRow.data.displayCategory === row.data.displayCategory && displayRow.data.bicsLevel === row.data.bicsLevel);
      const modifiedDisplayList: Array<StructurePortfolioBreakdownRowDTO> = rowList.slice(rowIndex + 1);
      if (rowIndex >= 0) {
        for (let i = 0; i < modifiedDisplayList.length; i++) {
          // stops the loop when you find the next adjacent sibling
          if (modifiedDisplayList[i].data.bicsLevel === row.data.bicsLevel) {
            break;
          } else {
            row.data.displayedSubLevelRows.push(modifiedDisplayList[i])
          }
        }
      }
    }
  }

  private setBreakdownListProperties(breakdownList: Array<StructurePortfolioBreakdownRowDTO>, parentRow: StructurePortfolioBreakdownRowDTO, isEditingView: boolean) {
    breakdownList.forEach(breakdown => {
      breakdown.data.bicsLevel = parentRow.data.bicsLevel + 1;
      breakdown.data.diveInLevel = parentRow.data.diveInLevel + 1;
      breakdown.data.moveVisualizer.state.isStencil = false;
      breakdown.state.isEditingView = !!isEditingView;
      breakdown.state.isStencil = false;
      breakdown.data.moveVisualizer.data.diveInLevel = breakdown.data.diveInLevel;
      breakdown.state.isWithinPopover = true;
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

}