import { Injectable } from '@angular/core';

import { DTOs, Blocks, AdhocPacks, PageStates } from '../models/frontend';
import {
  BEBICsHierarchyBlock,
  BEStructuringFundBlock,
  BEStructuringBreakdownBlock,
  BEStructuringBreakdownMetricBlock,
  BEStructuringBreakdownBlockWithSubPortfolios
} from 'Core/models/backend/backend-models.interface';
import {
  BICS_BRANCH_DEFAULT_HEIGHT,
  BICS_BRANCH_DEFAULT_HEIGHT_LARGE,
  BICS_BRANCH_CHARACTER_LIMIT,
  BICS_DICTIONARY_KEY_PREFIX,
  BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX,
  BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
  BICS_BREAKDOWN_FRONTEND_KEY,
  DeltaScope,
  StructureMetricBlockFallback
} from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { BICsLevels } from 'Core/constants/structureConstants.constants';
import { UtilityService } from './UtilityService';
import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
import { BICSDictionaryLookupService } from 'Core/services/BICSDictionaryLookupService';
import { PortfolioStructureBreakdownRowEmptySample } from 'Structure/stubs/structure.stub';
@Injectable()

export class BICSDataProcessingService {
  private bicsRawData: Array<Blocks.BICSCategorizationBlock> = [];
  private bicsComparedDeltaRawData: Array<Blocks.BICSCategorizationBlock> = [];
  private bicsRawCategoryCodes: Array<string> = [];

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ) {}

  public loadBICSData(
    data: BEBICsHierarchyBlock,
    immediatelyLoadBICSToConfigurator?: DTOs.SecurityDefinitionConfiguratorDTO
  ) {
    this.bicsRawCategoryCodes = [...Object.keys(data)];
    this.bicsDictionaryLookupService.loadBICSData(data);
    !!immediatelyLoadBICSToConfigurator && this.loadBICSOptionsIntoConfigurator(immediatelyLoadBICSToConfigurator);
  }

  public getTargetSpecificHierarchyList(
    childCode: string,
    childBicsLevel: number
  ): Array<Blocks.BICsHierarchyBlock> {
    const data = this.bicsDictionaryLookupService.returnDictionary()[childCode];
    const hierarchyDataList: Array<Blocks.BICsHierarchyBlock> = [];
    for (let item in data) {
      if (!!data[item]) {
        const itemLevel: number = +(item.split(BICS_DICTIONARY_KEY_PREFIX)[1]);
        if (itemLevel < childBicsLevel) {
          const object: Blocks.BICsHierarchyBlock = {
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

  public addSortedRegularBICsWithSublevels(rowList: Array<DTOs.StructurePortfolioBreakdownRowDTO>): Array<DTOs.StructurePortfolioBreakdownRowDTO> {
    const rowListCopy = this.utilityService.deepCopy(rowList);
    const primaryRowList = rowListCopy.filter((row: DTOs.StructurePortfolioBreakdownRowDTO) => row.data.bicsLevel === 1);
    const subRowList = rowListCopy.filter((row: DTOs.StructurePortfolioBreakdownRowDTO) => row.data.bicsLevel >= 2);
    const parsedRowList: Array<DTOs.StructurePortfolioBreakdownRowDTO> = [];
    if (subRowList.length > 0) {
      subRowList.forEach((eachRow: DTOs.StructurePortfolioBreakdownRowDTO) => {
        if (eachRow.data.targetLevel !== null) {
          const ifExistsInParsedList = parsedRowList.find(parsedRow => parsedRow.data.code === eachRow.data.code)
          !ifExistsInParsedList && parsedRowList.push(eachRow);
          const hierarchyList: Array<Blocks.BICsHierarchyBlock> = this.getTargetSpecificHierarchyList(eachRow.data.code, eachRow.data.bicsLevel);
          if (hierarchyList.length > 0) {
            hierarchyList.forEach((listItem: Blocks.BICsHierarchyBlock) => {
              const ifExistsInParsedList = parsedRowList.find(parsedRow => parsedRow.data.code === listItem.code);
              if (!ifExistsInParsedList) {
                const matchedRow = subRowList.find((subRow: DTOs.StructurePortfolioBreakdownRowDTO) => subRow.data.code === listItem.code);
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
        parsedRowList.sort((rowA: DTOs.StructurePortfolioBreakdownRowDTO, rowB: DTOs.StructurePortfolioBreakdownRowDTO) => {
          if (rowA.data.bicsLevel < rowB.data.bicsLevel) {
            return - 1
          } else if (rowA.data.bicsLevel > rowB.data.bicsLevel) {
            return 1;
          } else {
            return 0;
          }
        });
        parsedRowList.forEach((row: DTOs.StructurePortfolioBreakdownRowDTO) => {
          const hierarchyList: Array<Blocks.BICsHierarchyBlock> = this.getTargetSpecificHierarchyList(row.data.code, row.data.bicsLevel);
          const parentLevel = !!row.data.bicsLevel ? row.data.bicsLevel - 1: null;
          if (!!parentLevel) {
            const parentRow = hierarchyList.find(parentRow => parentRow.bicsLevel === parentLevel);
            row.data.parentRow = primaryRowList.find(targetRow => targetRow.data.code === parentRow.code);
            const parentIndex = primaryRowList.findIndex(primaryRow => primaryRow.data.code === parentRow.code);
            const subRowIndex = parentIndex + 1;
            primaryRowList.splice(subRowIndex, 0, row);
          }
        })
        const newRowList: Array<DTOs.StructurePortfolioBreakdownRowDTO> = this.formUIBranchForSubLevels(primaryRowList);
        newRowList.forEach(newRow => {
          this.getDisplayedSubLevelsForCategory(newRow, newRowList);
          this.getDisplayedSubLevelsWithTargetsForCategory(newRow, newRowList)
        })
        return newRowList;
      } else {
        return primaryRowList;
      }
    } else {
      return primaryRowList;
    }
  }

  public returnAllBICSBasedOnHierarchyDepth(depth: number): Array<string> {
    const identifier = `level${depth}`;
    const allBICSList = this.bicsDictionaryLookupService.getBICSCategoryNamesByLevel(identifier);
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

  public setRawBICsData(
    rawData: BEStructuringFundBlock,
    comparedDeltaRawData: BEStructuringFundBlock
  ) {
    const {
      BicsCodeLevel1,
      BicsCodeLevel2,
      BicsCodeLevel3,
      BicsCodeLevel4,
      BicsCodeLevel5,
      BicsCodeLevel6,
      BicsCodeLevel7
    } = rawData.breakdowns;
    const block: Blocks.BICSCategorizationBlock = {
      portfolioID: rawData.portfolioId,
      bicsLevel1: BicsCodeLevel1,
      bicsLevel2: BicsCodeLevel2,
      bicsLevel3: BicsCodeLevel3,
      bicsLevel4: BicsCodeLevel4,
      bicsLevel5: BicsCodeLevel5,
      bicsLevel6: BicsCodeLevel6,
      bicsLevel7: BicsCodeLevel7
    }
    const existingPortfolioIndex = this.bicsRawData.findIndex(portfolio => portfolio.portfolioID === block.portfolioID);
    if (existingPortfolioIndex > -1) {
      this.bicsRawData[existingPortfolioIndex] = block;
    } else {
      this.bicsRawData.push(block);
    }
    if (!!comparedDeltaRawData) {
      const {
        BicsCodeLevel1: deltaBicsCodeLevel1,
        BicsCodeLevel2: deltaBicsCodeLevel2,
        BicsCodeLevel3: deltaBicsCodeLevel3,
        BicsCodeLevel4: deltaBicsCodeLevel4,
        BicsCodeLevel5: deltaBicsCodeLevel5,
        BicsCodeLevel6: deltaBicsCodeLevel6,
        BicsCodeLevel7: deltaBicsCodeLevel7
      } = comparedDeltaRawData.breakdowns;
      const deltaBlock: Blocks.BICSCategorizationBlock = {
        portfolioID: rawData.portfolioId,
        bicsLevel1: deltaBicsCodeLevel1,
        bicsLevel2: deltaBicsCodeLevel2,
        bicsLevel3: deltaBicsCodeLevel3,
        bicsLevel4: deltaBicsCodeLevel4,
        bicsLevel5: deltaBicsCodeLevel5,
        bicsLevel6: deltaBicsCodeLevel6,
        bicsLevel7: deltaBicsCodeLevel7
      }
      if (existingPortfolioIndex > -1) {
        this.bicsComparedDeltaRawData[existingPortfolioIndex] = deltaBlock;
      } else {
        this.bicsComparedDeltaRawData.push(deltaBlock);
      }
    } else {
      this.bicsComparedDeltaRawData = [];
    }
  }

  public getBICSCategoryRawData(
    portfolioId: number,
    level: number,
    code: string
  ): BEStructuringBreakdownMetricBlock {
    const rawData = this.bicsRawData.find(bicsRawData => bicsRawData.portfolioID === portfolioId);
    if (!!rawData) {
      const groupOption = `${BICS_BREAKDOWN_FRONTEND_KEY}${level}`;
      const targetRawData: BEStructuringBreakdownMetricBlock = rawData[groupOption].breakdown[code];
      if (!!targetRawData && !!targetRawData.metricBreakdowns) {
        if (!targetRawData.metricBreakdowns.CreditDuration) {
          targetRawData.metricBreakdowns.CreditDuration = StructureMetricBlockFallback.metricBreakdowns.CreditDuration;
        }
        if (!targetRawData.metricBreakdowns.Cs01) {
          targetRawData.metricBreakdowns.Cs01 = StructureMetricBlockFallback.metricBreakdowns.Cs01;
        }
        if (!targetRawData.metricBreakdowns.CreditLeverage) {
          targetRawData.metricBreakdowns.CreditLeverage = StructureMetricBlockFallback.metricBreakdowns.CreditLeverage;
        }
        return targetRawData ? this.utilityService.deepCopy(targetRawData) : null;
      } else {
        return this.utilityService.deepCopy(StructureMetricBlockFallback);
      }
    } else {
      return this.utilityService.deepCopy(StructureMetricBlockFallback);
    }
  }

  public formRawBreakdownDetailsObject(
    portfolioID: number,
    level: number
  ): BEStructuringBreakdownBlock {
    const rawData = this.bicsRawData.find(bicsRawData => bicsRawData.portfolioID === portfolioID);
    if (!!rawData) {
      const targetedRawBreakdown: BEStructuringBreakdownBlock = rawData[`${BICS_BREAKDOWN_FRONTEND_KEY}${level}`];
      const breakdown: BEStructuringBreakdownBlock = {
        groupOption: targetedRawBreakdown.groupOption,
        indexId: targetedRawBreakdown.indexId,
        portfolioBreakdownId: targetedRawBreakdown.portfolioBreakdownId,
        portfolioId: targetedRawBreakdown.portfolioId,
        breakdown: {}
      }
      return breakdown;
    } else {
      return null;
    }
  }

  public formSubLevelBreakdown(
    breakdownRow: DTOs.StructurePortfolioBreakdownRowDTO,
    isDisplayCs01: boolean,
    existingDisplayList?: Array<DTOs.StructurePortfolioBreakdownRowDTO>
  ): DTOs.PortfolioBreakdownDTO {
    const categoryPortfolioID = breakdownRow.data.portfolioID;
    const selectedSubRawBICsData = this.bicsRawData.find(rawData => rawData.portfolioID === categoryPortfolioID);
    const deltaRawData = this.bicsComparedDeltaRawData && this.bicsComparedDeltaRawData.length > 0 ? this.bicsComparedDeltaRawData.find(rawData => rawData.portfolioID === categoryPortfolioID) : null;
    const targetCodeList = this.bicsDictionaryLookupService.getNextBICSSubLevelCodesByPerCategory(breakdownRow.data.code);
    let subLevelCategoryNames: Array<string> = [];
    targetCodeList.forEach(subLevelCode => {
      const name = this.bicsDictionaryLookupService.BICSCodeToBICSName(subLevelCode);
      subLevelCategoryNames = [...subLevelCategoryNames, name];
    })
    const customRawBreakdown: BEStructuringBreakdownBlock = this.formBEBreakdownRawDataFromCategorizationBlock(
      selectedSubRawBICsData,
      breakdownRow.data.bicsLevel + 1,
      targetCodeList
    );
    const customRawDeltaBreakdown: BEStructuringBreakdownBlock = this.formBEBreakdownRawDataFromCategorizationBlock(
      deltaRawData,
      breakdownRow.data.bicsLevel + 1,
      targetCodeList
    );
    // Allows the visualziers to be formed relative to any existing categories/parents
    // Doesnt affect the actual breakdown being created since that's derived from the definition list
    if (!!existingDisplayList && existingDisplayList.length > 0) {
      existingDisplayList.forEach(existingRow => {
        const selectedRawData = selectedSubRawBICsData[`${BICS_BREAKDOWN_FRONTEND_KEY}${existingRow.data.bicsLevel}`];
        if (!!selectedRawData.breakdown[existingRow.data.code]) {
          const parsedCategoryName = `${existingRow.data.displayCategory} ${BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX}${existingRow.data.bicsLevel}`;
          customRawBreakdown.breakdown[parsedCategoryName] = selectedRawData.breakdown[existingRow.data.code];
        }
      })
    }
    const breakdown: DTOs.PortfolioBreakdownDTO = this.dtoService.formPortfolioBreakdown(false, customRawBreakdown, customRawDeltaBreakdown, subLevelCategoryNames, isDisplayCs01);
    breakdown.data.diveInLevel = breakdownRow.data.diveInLevel + 1;
    this.setBreakdownListProperties(breakdown.data.rawCs01CategoryList, breakdownRow);
    this.setBreakdownListProperties(breakdown.data.rawLeverageCategoryList, breakdownRow);
    breakdown.data.displayCategoryList = breakdown.state.isDisplayingCs01 ? breakdown.data.rawCs01CategoryList : breakdown.data.rawLeverageCategoryList;
    breakdown.data.title = breakdownRow.data.displayCategory;
    return breakdown;
  }

  public formBICSRow(mainRowData: Blocks.BICSMainRowDataBlock): Array<DTOs.StructurePortfolioBreakdownRowDTO> {
    const { code, portfolioID, level, isCs01} = mainRowData;
    const rawData: Blocks.BICSCategorizationBlock = this.bicsRawData.find(bicsData => bicsData.portfolioID === portfolioID);
    const deltaRawData: Blocks.BICSCategorizationBlock = this.bicsComparedDeltaRawData && this.bicsComparedDeltaRawData.length > 0 ? this.bicsComparedDeltaRawData.find(bicsData => bicsData.portfolioID === portfolioID) : null;
    const customRawBreakdown: BEStructuringBreakdownBlock = this.formBEBreakdownRawDataFromCategorizationBlock(rawData, level, [code]);
    const customRawDeltaBreakdown: BEStructuringBreakdownBlock = this.formBEBreakdownRawDataFromCategorizationBlock(deltaRawData, level, [code]);
    if (!!customRawBreakdown) {
      const categoryName = this.bicsDictionaryLookupService.BICSCodeToBICSName(code);
      const customBreakdown: DTOs.PortfolioBreakdownDTO = this.dtoService.formPortfolioBreakdown(
        false,
        customRawBreakdown,
        customRawDeltaBreakdown,
        [categoryName],
        isCs01,
        false
      );
      const cs01Row = customBreakdown.data.rawCs01CategoryList[0];
      const creditLeverageRow = customBreakdown.data.rawLeverageCategoryList[0];
      if (!!cs01Row && !!creditLeverageRow) {
        cs01Row.state.isStencil = false;
        cs01Row.data.moveVisualizer.state.isStencil = false;
        creditLeverageRow.state.isStencil = false;
        creditLeverageRow.data.moveVisualizer.state.isStencil = false;
      }
      return [cs01Row, creditLeverageRow];
    } else {
      return [null, null];
    }
  }

  public getDisplayedSubLevelsForCategory(
    targetRow: DTOs.StructurePortfolioBreakdownRowDTO,
    rowList: Array<DTOs.StructurePortfolioBreakdownRowDTO>
  ) {
    if (targetRow.data.displayedSubLevelRows.length > 0) {
      targetRow.data.displayedSubLevelRows.forEach(subLevel => {
        subLevel.state.isVisibleSubLevel = !!targetRow.state.isShowingSubLevels;
      })
    } else {
      const displayedSubLevelList = rowList.filter(row => row.data.code.indexOf(targetRow.data.code) === 0 && row.data.bicsLevel > targetRow.data.bicsLevel);
      targetRow.data.displayedSubLevelRows = displayedSubLevelList;
    }
  }

  public resetBICsSubLevelsState(rowList: Array<DTOs.StructurePortfolioBreakdownRowDTO>) {
    rowList.forEach(row => {
      if (row.data.bicsLevel === 1) {
        row.state.isShowingSubLevels = false;
      } else {
        row.state.isVisibleSubLevel = false;
      }
    })
  }

  public convertSecurityDefinitionConfiguratorBICSOptionsEmitterParamsToCode(params: AdhocPacks.DefinitionConfiguratorEmitterParams) {
    params.filterList.forEach((eachFilter) => {
      if (eachFilter.key === SecurityDefinitionMap.BICS_CONSOLIDATED.key) {
        eachFilter.filterBy = [];
        eachFilter.filterByBlocks.forEach((eachBlock) => {
          const targetCode = this.bicsDictionaryLookupService.BICSNameToBICSCode(eachBlock.shortKey, eachBlock.bicsLevel);
          if (targetCode !== null) {
            eachFilter.filterBy.push(targetCode);
          }
        });
      }
    })
  }

  public loadBICSOptionsIntoConfigurator(configuratorDTO: DTOs.SecurityDefinitionConfiguratorDTO) {
    this.dtoService.loadBICSOptionsIntoConfigurator(
      configuratorDTO,
      this.returnAllBICSBasedOnHierarchyDepth(1),
      this.returnAllBICSBasedOnHierarchyDepth(2),
      this.returnAllBICSBasedOnHierarchyDepth(3),
      this.returnAllBICSBasedOnHierarchyDepth(4),
      this.returnAllBICSBasedOnHierarchyDepth(5),
      this.returnAllBICSBasedOnHierarchyDepth(6),
      this.returnAllBICSBasedOnHierarchyDepth(7)
    )
  }

  public seeBondPackageBICSBreakdownDataTransfer(
    configurator: DTOs.SecurityDefinitionConfiguratorDTO,
    targetRow: DTOs.StructurePortfolioBreakdownRowDTO,
    filterList: Array<DTOs.SecurityDefinitionDTO>
  ) {
    configurator.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        if (eachDefinition.data.key === SecurityDefinitionMap.BICS_CONSOLIDATED.key) {
          const selectedOptionList = [];
          selectedOptionList.push(targetRow.data.displayCategory);
          eachDefinition.data.highlightSelectedOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(
            eachDefinition.data.key,
            selectedOptionList,
            targetRow.data.bicsLevel
          );
          eachDefinition.data.highlightSelectedOptionList.forEach((eachOption) => {
            eachOption.isSelected = true;
          });
          filterList.push(eachDefinition);
        }
      });
    });
  }

  public populateServerReturnBICSBreakdownWithRemainingEmptyRows(rawData: BEStructuringBreakdownBlockWithSubPortfolios) {
    // this is to allow FE to populate all rows that are not sent by the BE due to performance-related reasons
    const level = rawData.groupOption.split(BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER).length === 2 ? +(rawData.groupOption.split(BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER)[1]) : null;
    if (level) {
      const categoryCodes = this.getCategoryCodesBasedOnLevel(level);
      if (categoryCodes.length > 0) {
        categoryCodes.forEach(code => {
          if (!rawData.breakdown[code]) {
            rawData.breakdown[code] = PortfolioStructureBreakdownRowEmptySample;
          }
        })
      }
    }
  }
  
  private setBreakdownListProperties(
    breakdownList: Array<DTOs.StructurePortfolioBreakdownRowDTO>,
    parentRow: DTOs.StructurePortfolioBreakdownRowDTO
  ) {
    breakdownList.forEach(breakdown => {
      breakdown.data.bicsLevel = parentRow.data.bicsLevel + 1;
      breakdown.data.diveInLevel = parentRow.data.diveInLevel + 1;
      breakdown.data.moveVisualizer.state.isStencil = false;
      breakdown.state.isStencil = false;
      breakdown.data.moveVisualizer.data.diveInLevel = breakdown.data.diveInLevel;
      breakdown.state.isWithinPopover = true;
      this.applyPopoverStencilMasks(breakdown.data.moveVisualizer);
      if (breakdown.data.bicsLevel >= 7) {
        breakdown.state.isBtnDiveIn = false;
      }
    })
  }

  private applyPopoverStencilMasks(visualizer: DTOs.MoveVisualizerDTO) {
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


  private formCompleteHierarchyWithSubLevels(
    rawData: BEBICsHierarchyBlock,
    parent: Blocks.BICsHierarchyBlock | Array<Blocks.BICsHierarchyBlock>,
    counter: number
  ) {
    counter += 1;
    const parentKey = `item${counter - 1}`;
    const targetKey = `item${counter}`;
    const keyAfterTarget = `item${counter + 1}`;
    if (counter < 8) {
      const parentData = Array.isArray(parent) ? parent : Object.keys(parent).length > 0 ? [parent] : null;
      const directSubLevelCategoryCodes = this.getCategoryCodesBasedOnLevel(counter);
      if (parentData && directSubLevelCategoryCodes.length > 0) {
        parentData.forEach((category: Blocks.BICsHierarchyBlock) => {
          directSubLevelCategoryCodes.forEach(code => {
            const data = rawData[code]
            if (data && data[targetKey] && data[parentKey] === category.name && !data[keyAfterTarget]) {
              const BICSData: Blocks.BICsHierarchyBlock = {
                name: data[targetKey],
                bicsLevel: counter,
                code: code,
                children: []
              }
              const isExists = category.children.find(existingCategory => existingCategory.name === data[targetKey]);
              if (!isExists) {
                category.children.push(BICSData);
              }
              this.formCompleteHierarchyWithSubLevels(rawData, category.children, counter);
            }
          })
        })
      }
    }
  }

  private formBEBreakdownRawDataFromCategorizationBlock(
    rawData: Blocks.BICSCategorizationBlock,
    level: number,
    targetCodeList: Array<string>
  ): BEStructuringBreakdownBlock | null {
    const bicsLevel = BICsLevels[level];
    if (!!rawData && !!rawData[bicsLevel]) {
      const rawBreakdown: BEStructuringBreakdownBlock = rawData[bicsLevel];
      const { groupOption, indexId, portfolioBreakdownId, portfolioId } = rawBreakdown;
      const customRawBreakdown: BEStructuringBreakdownBlock = {
        groupOption,
        indexId,
        portfolioBreakdownId,
        portfolioId,
        breakdown: {}
      }
      targetCodeList.forEach((eachTargetCode) => {
        const breakdownData = rawData[bicsLevel].breakdown[eachTargetCode];
        const categoryName = this.bicsDictionaryLookupService.BICSCodeToBICSName(eachTargetCode);
        if (!!breakdownData) {
          customRawBreakdown.breakdown[categoryName] = breakdownData;
          (customRawBreakdown.breakdown[categoryName] as AdhocPacks.AdhocExtensionBEStructuringBreakdownMetricBlock).customLevel = level;
          (customRawBreakdown.breakdown[categoryName] as AdhocPacks.AdhocExtensionBEStructuringBreakdownMetricBlock).code = eachTargetCode;
        }
      });
      return customRawBreakdown;
    } else {
      return null;
    }
  }

  private getDisplayedSubLevelsWithTargetsForCategory(
    targetRow: DTOs.StructurePortfolioBreakdownRowDTO,
    rowList: Array<DTOs.StructurePortfolioBreakdownRowDTO>
  ) {
    const displayedSubLevelListWithTargets = rowList.filter(row => row.data.code.indexOf(targetRow.data.code) === 0 && row.data.bicsLevel > targetRow.data.bicsLevel && row.data.targetLevel !== null);
    targetRow.data.displayedSubLevelRowsWithTargets = displayedSubLevelListWithTargets;
  }

  private formUIBranchForSubLevels(rowList: Array<DTOs.StructurePortfolioBreakdownRowDTO>): Array<DTOs.StructurePortfolioBreakdownRowDTO> {
    const rowListCopy = this.utilityService.deepCopy(rowList);
    rowListCopy.forEach((row: DTOs.StructurePortfolioBreakdownRowDTO, i) => {
      if (row.data.bicsLevel >= 2) {
        const previousRow: DTOs.StructurePortfolioBreakdownRowDTO = rowListCopy[i-1];
        const branchHeight = previousRow.data.displayCategory.length >= BICS_BRANCH_CHARACTER_LIMIT ? BICS_BRANCH_DEFAULT_HEIGHT_LARGE : BICS_BRANCH_DEFAULT_HEIGHT;
        if (previousRow.data.bicsLevel === row.data.bicsLevel - 1 || previousRow.data.bicsLevel === row.data.bicsLevel) {
          // previous row is a parent or sibling element, so the branch needs to only extend to the button before it
          row.style.branchHeight = `${branchHeight}px`;
          row.style.top = `-${branchHeight/2}px`;
        } else if (row.data.bicsLevel < previousRow.data.bicsLevel) {
        // needs to find the closest sibling element as the previous row is a child of a sibling element
        const modifiedList: Array<DTOs.StructurePortfolioBreakdownRowDTO> = rowListCopy.slice(0, i);
        const findSiblingRows: Array<DTOs.StructurePortfolioBreakdownRowDTO> = modifiedList.filter(sibilingRow => !!sibilingRow.data.parentRow && sibilingRow.data.parentRow.data.code === row.data.parentRow.data.code);
        const nearestSiblingRow: DTOs.StructurePortfolioBreakdownRowDTO = findSiblingRows[findSiblingRows.length - 1];
        const sibilingRowIndex = rowListCopy.findIndex(eachRow => eachRow.data.code === nearestSiblingRow.data.code);
        const indexDifference = i - sibilingRowIndex;
        row.style.branchHeight = `${indexDifference * branchHeight}px`;
        row.style.top = `-${(indexDifference * branchHeight) - (branchHeight / 2)}px`;
        }
      }
    })
    return rowListCopy;
  }

  private getCategoryCodesBasedOnLevel(level: number): Array<string> {
    const categoryCodes = this.bicsRawCategoryCodes.length > 0 ? this.bicsRawCategoryCodes.filter(code => code.length === level * 2) : [];
    return categoryCodes
  }
}