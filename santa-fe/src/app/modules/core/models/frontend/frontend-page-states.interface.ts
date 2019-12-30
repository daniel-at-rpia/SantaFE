import {
  SecurityDTO,
  SecurityTableDTO,
  SecurityTableRowDTO,
  SecurityGroupDTO,
  SecurityDefinitionDTO,
  SecurityDefinitionConfiguratorDTO,
  SecurityGroupAverageVisualizerDTO,
  SearchShortcutDTO,
  QuantComparerDTO,
  QuantitativeVisualizerDTO,
} from 'FEModels/frontend-models.interface';
import {  ObligorChartCategoryDTO } from 'FEModels/frontend-blocks.interface';
import {
  SecurityDefinitionStub,
  SecurityTableMetricStub
} from 'FEModels/frontend-stub-models.interface';
import { DefinitionConfiguratorEmitterParamsItem } from 'FEModels/frontend-adhoc-packages.interface';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export interface MarketState {
}

export interface MarketGroupPanelState {
  powerModeActivated: boolean;
  landscapeViewActivated: boolean;
  isConfiguratorCollapsed: boolean;
  isGroupDataLoaded: boolean;
  configurator: {
    dto: SecurityDefinitionConfiguratorDTO;
    showSelectedGroupConfig: boolean;
    cachedOriginalConfig: SecurityDefinitionConfiguratorDTO;
    shortcutList: Array<SearchShortcutDTO>;
    selectedShortcut: SearchShortcutDTO;
  }
  searchResult: {
    securityGroupList: Array<SecurityGroupDTO>;
    renderProgress: number;
    searchFailed: boolean;
    searchFailedError: string;
  }
  utility: {
    selectedWidget: string;
    visualizer: SecurityGroupAverageVisualizerDTO;
    pieConfigurator: {
      left: {
        selected: boolean;
        options: Array<SecurityDefinitionStub>;
        displayText: string;
        activeMetric: SecurityDefinitionStub;
      }
      right: {
        selected: boolean;
        options: Array<SecurityDefinitionStub>;
        displayText: string;
        activeMetric: SecurityDefinitionStub;
      }
    }
  }
}

export interface TradeState {
  graphsCollapsed: boolean;
  ownerInitial: string;
}

export interface TradeCenterPanelState {
  currentContentStage: number;
  presets : {
    selectedPreset: any;
    shortcutList: Array<SearchShortcutDTO>;
  }
  configurator: {
    dto: SecurityDefinitionConfiguratorDTO;
    boosted: boolean;
  }
  table: {
    metrics: Array<SecurityTableMetricStub>;
    dto: SecurityTableDTO;
  }
  fetchResult: {
    fetchTableDataFailed: boolean;
    fetchTableDataFailedError: string;
    rowList: Array<SecurityTableRowDTO>;
    prinstineRowList: Array<SecurityTableRowDTO>;
    liveUpdatedRowList: Array<SecurityTableRowDTO>;
  }
  filters: {
    quickFilters: {
      metricType: string;
      portfolios: Array<string>;
      keyword: string;
      owner: Array<string>;
    }
    securityFilters: Array<DefinitionConfiguratorEmitterParamsItem>
  }
}

export interface TradeUtilityPanelState {
  prompt: string;
  updateCountdown: string;
  isPaused: boolean;
  isCallingAPI: boolean;
  isProcessingData: boolean;
  isPresetSelected: boolean;
  isInitialDataLoaded: boolean;
  validWindowConfig: {
    valueRaw: number;
    valueDisplay: string;
    isEditing: boolean;
  }
}

export interface TradeMarketAnalysisPanelState {
  receivedSecurity: boolean;
  quantVisualizer: {
    groupByOptions: Array<SecurityDefinitionDTO>;
    dto: QuantitativeVisualizerDTO;
    targetSecurity: SecurityDTO;
  }
  table: {
    securityList: Array<SecurityDTO>;
  }
}

export interface TradeObligorGraphPanelState {
  obligorChart: am4charts.XYChart;
  obligorSecurityID: string;
  obligorName: string;
  obligorCurrency: string;
  securityTableRowDTOList: SecurityTableRowDTO[];
  metric: {
    spread:boolean;
    yield:boolean;
  }
  markValue: {
    cS01:boolean;
    quantity:boolean;
  }
  xAxisData: [{workoutTerm: number}];
  yAxisData: number[];
  activeCharts: {
    srBond: boolean;
    subBond: boolean;
    srCDS: boolean;
    subCDS: boolean;
  }
  chartCategories: ObligorChartCategoryDTO[];
}