import {
  SecurityTableHeaderConfigStub,
  SecurityTableQuoteHeaderConfigStub,
  TradeHistoryHeaderConfigStub,
  SecurityTableSpecificAlertHeaderConfigsStub,
  TradeTraceHeaderConfigStub
} from 'FEModels/frontend-stub-models.interface';

import {
  TriCoreDriverConfig,
  SecurityMetricOptions,
  DEFAULT_DRIVER_IDENTIFIER
} from 'Core/constants/coreConstants.constant';


export const SECURITY_TABLE_QUOTE_TYPE_RUN = 'Run';
export const SECURITY_TABLE_QUOTE_TYPE_AXE = 'Axe';

// Currently all data comes in a single bulk return, so there is no need for additional stages, but the logic should remain in case it is needed in the future
export const SECURITY_TABLE_FINAL_STAGE = 1;

export const AGGRID_DETAIL_COLUMN_WIDTH = 50;
export const AGGRID_SECURITY_CARD_COLUMN_WIDTH = 285;
export const AGGRID_QUOTE_COLUMN_WIDTH = 244;    // $securityTable_cell_width_best_quote + $spacing_small * 2
export const AGGRID_ALERT_SIDE_COLUMN_WIDTH = 115;
export const AGGRID_ALERT_STATUS_COLUMN_WIDTH = 155;  // can not use simple text because cancelled status would wrap into 2 lines
export const AGGRID_ALERT_IS_BENCHMARK_HEDGED_COLUMN_WIDTH = 155;
export const AGGRID_SIMPLE_NUM_COLUMN_WIDTH = 140;
export const AGGRID_SIMPLE_TEXT_COLUMN_WIDTH = 135;
export const AGGRID_ALERT_MESSAGE_COLUMN_WIDTH = 240;
export const AGGRID_ROW_HEIGHT = 40;
export const AGGRID_ROW_HEIGHT_SLIM = 34;
export const AGGRID_DETAIL_ROW_HEIGHT_PER_ROW = 37;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET = 145;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET_OFFTHERUNCDS = 185;
export const AGGRID_DETAIL_ROW_DEFAULT_COUNT = 9;
export const AGGRID_DETAIL_ROW_HEIGHT_MAX = AGGRID_DETAIL_ROW_HEIGHT_OFFSET + AGGRID_DETAIL_ROW_HEIGHT_PER_ROW * AGGRID_DETAIL_ROW_DEFAULT_COUNT;
export const AGGRID_DETAIL_ROW_HEIGHT_MINIMUM = 400;
export const AGGRID_HEADER_CLASS = 'santaTable__agGridTable-agGrid-header';
export const AGGRID_ROW_CLASS = 'santaTable__agGridTable-agGrid-row';
export const AGGRID_CELL_CLASS = 'santaTable__agGridTable-agGrid-cell';
export const AGGRID_DETAIL_COLUMN_KEY = 'Quotes';
export enum AggridSortOptions {
  asc = "asc",
  desc = "desc"
}

export const SECURITY_TABLE_HEADER_NO_GROUP = 'noGroup';
export const SecurityTableHeaderConfigGroups = {
  bestQuote: 'Best Quote',
  alert: 'Alert-related',
  mark: 'Mark',
  markDiscrepancies: 'Mark Discrepancies',
  weight: 'Weight % within fund/table',
  cost: 'Position Cost',
  position: 'Position (MM)',
  cs01: 'CS01 (k)',
  delta: 'Deltas',
  securityInfo: 'Security Info',
  ownership: 'Ownership',
  lastTrace: 'Trace Last Print (IG > 1MM / HY > 500k) (Vol in MM)'
};

export const SECURITY_TABLE_ICONS = {
  columnGroupOpened: '<i class="far fa-plus-square"/>',
  columnGroupClosed: '<i class="far fa-minus-square"/>',
  menu: '<i class="fa fa-bars" style="width: 10px"/>',
  sortAscending: '<i class="fas fa-sort-amount-up"></i>',
  sortDescending: '<i class="fas fa-sort-amount-down"></i>'
};

export const SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START = '<';
export const SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END = '>';

export const SecurityTableHeaderConfigs: Array<SecurityTableHeaderConfigStub> = [
  {
    key: 'securityCard',
    content: {
      label: 'Security',
      attrName: null,
      underlineAttrName: null,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isForSecurityCard: true,
      groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP,
      isCustomComponent: true,
      tableSpecifics: {
        default: {
          active: true,
          pinned: true
        }
      }
    }
  },{
    key: 'alertTime',
    content : {
      label: 'Time',
      attrName: 'alertTime',
      underlineAttrName: 'alertTimeRaw',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true,
          sortActivated: AggridSortOptions.asc
        }
      }
    }
  },{
    key: 'alertType',
    content: {
      label: 'Type',
      attrName: 'alertType',
      underlineAttrName: 'alertType',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertStatus',
    content: {
      label: 'Status',
      attrName: 'alertStatus',
      underlineAttrName: 'alertStatus',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      isCustomComponent: true,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertSide',
    content: {
      label: 'Side',
      attrName: 'alertSide',
      underlineAttrName: 'alertSide',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      isCustomComponent: true,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertIsBenchmarkHedged',
    content: {
      label: 'Is Benchmark Hedged',
      attrName: 'alertIsBenchmarkHedged',
      underlineAttrName: 'alertIsBenchmarkHedged',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      isDataTypeText: true,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: false
        }
      }
    }
  },{
    key: 'alertLevel',
    content: {
      label: 'Level',
      attrName: 'alertLevel',
      underlineAttrName: 'alertLevelRaw',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: false,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertQuantity',
    content: {
      label: 'Quantity (MM)',
      attrName: 'alertQuantity',
      underlineAttrName: 'alertQuantityRaw',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: false,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertQuoteDealer',
    content: {
      label: 'Dealer',
      attrName: 'alertQuoteDealer',
      underlineAttrName: 'alertQuoteDealer',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTradeTrader',
    content: {
      label: 'Trader',
      attrName: 'alertTradeTrader',
      underlineAttrName: 'alertTradeTrader',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: false
        }
      }
    }
  },{
    key: 'alertTraceReportingParty',
    content: {
      label: 'Reporting Party',
      attrName: 'alertTraceReportingParty',
      underlineAttrName: 'alertTraceReportingParty',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTraceContraParty',
    content: {
      label: 'Contra Party',
      attrName: 'alertTraceContraParty',
      underlineAttrName: 'alertTraceContraParty',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTracePrice',
    content: {
      label: 'Px',
      attrName: 'alertTracePrice',
      underlineAttrName: 'alertTracePrice',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTraceSpread',
    content: {
      label: 'Sprd',
      attrName: 'alertTraceSpread',
      underlineAttrName: 'alertTraceSpread',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTraceVolumeEstimated',
    content: {
      label: 'Vol (Estimated)',
      attrName: 'alertTraceVolumeEstimated',
      underlineAttrName: 'alertTraceVolumeEstimated',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTraceVolumeReported',
    content: {
      label: 'Vol (Reported)',
      attrName: 'alertTraceVolumeReported',
      underlineAttrName: 'alertTraceVolumeReported',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertTraceBenchmarkName',
    content: {
      label: 'Benchmark Name',
      attrName: 'alertTraceBenchmarkName',
      underlineAttrName: 'alertTraceBenchmarkName',
      blockAttrName: 'alert',
      isDataTypeText: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: false,
          disabled: true,
          groupShow: true
        }
      }
    }
  },{
    key: 'alertMessage',
    content: {
      label: 'Alert Message',
      attrName: 'alertMessage',
      underlineAttrName: 'alertMessage',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        },
        tradeAlert: {
          active: true,
          disabled: false,
          groupShow: false
        }
      }
    }
  },{
    key: 'bestQuote',
    content: {
      label: 'Best Quote (Bid vs Ask)',
      attrName: null,
      blockAttrName: 'combined',
      underlineAttrName: null,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isForBestQuoteComparer: true,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.bestQuote,
      isCustomComponent: true,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false,
          groupShow: false
        }
      }
    }
  },{
    key: 'bestAxeQuote',
    content: {
      label: 'Best Axe Quote (Bid vs Ask)',
      attrName: null,
      blockAttrName: 'axe',
      underlineAttrName: null,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isForBestQuoteComparer: true,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.bestQuote,
      isCustomComponent: true,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false,
          groupShow: false
        }
      }
    }
  },{
    key: 'bestBid',
    content: {
      label: 'Best Bid',
      attrName: 'bid',
      blockAttrName: 'bestQuote',
      underlineAttrName: 'bid',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.bestQuote,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'bestAsk',
    content: {
      label: 'Best Ask',
      attrName: 'ask',
      blockAttrName: 'bestQuote',
      underlineAttrName: 'ask',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.bestQuote,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'mark',
    content: {
      label: 'Mark',
      attrName: 'mark',
      underlineAttrName: 'markRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'price',
    content: {
      label: 'Price',
      attrName: 'price',
      underlineAttrName: 'priceRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'spread',
    content: {
      label: 'Spread',
      attrName: 'spread',
      underlineAttrName: 'spreadRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markDriver',
    content: {
      label: 'Driver',
      attrName: 'markDriver',
      underlineAttrName: 'markDriver',
      blockAttrName: 'mark',
      isDataTypeText: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'indexMark',
    content: {
      label: 'Index Mark (t-1)',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'metricPack',
      isAttrChangable: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          disabled: false,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markDeltaToIndex',
    content: {
      label: 'Δ to Index Mark (t-1)',
      attrName: 'markDisIndex',
      underlineAttrName: 'markDisIndexRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markLastUpdatedBy',
    content: {
      label: 'Mark Last Updated By',
      attrName: 'markChangedBy',
      underlineAttrName: 'markChangedBy',
      blockAttrName: 'mark',
      isDataTypeText: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markLastUpdateTime',
    content: {
      label: 'Mark Last Update Time',
      attrName: 'markChangedTime',
      underlineAttrName: 'markChangedTime',
      blockAttrName: 'mark',
      isDataTypeText: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.mark,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'ticker',
    content: {
      label: 'Ticker',
      attrName: 'ticker',
      underlineAttrName: 'ticker',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'rating',
    content: {
      label: 'Rating',
      attrName: 'ratingValue',
      underlineAttrName: 'ratingValue',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'currency',
    content: {
      label: 'Currency',
      attrName: 'currency',
      underlineAttrName: 'currency',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'bicsCode',
    content: {
      label: 'BICS Code',
      attrName: 'code',
      underlineAttrName: 'code',
      blockAttrName: 'bics',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: false,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'bicsLevel1',
    content: {
      label: 'BICS Lv.1',
      attrName: 'bicsLevel1',
      underlineAttrName: 'bicsLevel1',
      blockAttrName: 'bics',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'bicsLevel2',
    content: {
      label: 'BICS Lv.2',
      attrName: 'bicsLevel2',
      underlineAttrName: 'bicsLevel2',
      blockAttrName: 'bics',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'bicsLevel3',
    content: {
      label: 'BICS Lv.3',
      attrName: 'bicsLevel3',
      underlineAttrName: 'bicsLevel3',
      blockAttrName: 'bics',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'bicsLevel4',
    content: {
      label: 'BICS Lv.4',
      attrName: 'bicsLevel4',
      underlineAttrName: 'bicsLevel4',
      blockAttrName: 'bics',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'issuer',
    content: {
      label: 'Issuer',
      attrName: 'obligorName',
      underlineAttrName: 'obligorName',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      columnWidth: 180,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'securityType',
    content: {
      label: 'Security Type',
      attrName: 'securityType',
      underlineAttrName: 'securityType',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'securitySubType',
    content: {
      label: 'Security Sub-Type',
      attrName: 'securitySubType',
      underlineAttrName: 'securitySubType',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'seniority',
    content: {
      label: 'Seniority',
      attrName: 'seniority',
      underlineAttrName: 'seniority',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'country',
    content: {
      label: 'Country',
      attrName: 'country',
      underlineAttrName: 'country',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'tenor',
    content: {
      label: 'Tenor (yrs)',
      attrName: 'tenor',
      underlineAttrName: 'tenor',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: false,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'maturityType',
    content: {
      label: 'Maturity Type',
      attrName: 'maturityType',
      underlineAttrName: 'maturityType',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.securityInfo,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markDeltaToBid',
    content: {
      label: 'Δ to Bid',
      attrName: 'markDisBid',
      underlineAttrName: 'markDisBidRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.markDiscrepancies,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markDeltaToAsk',
    content: {
      label: 'Δ to Ask',
      attrName: 'markDisAsk',
      underlineAttrName: 'markDisAskRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.markDiscrepancies,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markDeltaToMid',
    content: {
      label: 'Δ to Mid',
      attrName: 'markDisMid',
      underlineAttrName: 'markDisMidRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.markDiscrepancies,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'markDeltaToLiquidation',
    content: {
      label: 'Δ to Liquid',
      attrName: 'markDisLiquidation',
      underlineAttrName: 'markDisLiquidationRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.markDiscrepancies,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'weightFundCS01',
    content: {
      label: `${SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START}Fund${SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END} - CS01`,
      attrName: 'fundCS01PctDisplay',
      underlineAttrName: 'fundCS01Pct',
      blockAttrName: 'weight',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      columnWidth: 110,
      groupBelongs: SecurityTableHeaderConfigGroups.weight,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          disabled: true,
          active: false
        }
      }
    }
  },{
    key: 'weightTableCS01',
    content: {
      label: 'Table - CS01',
      attrName: 'groupCS01PctDisplay',
      underlineAttrName: 'groupCS01Pct',
      blockAttrName: 'weight',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isFrontendAggregation: true,
      columnWidth: 110,
      groupBelongs: SecurityTableHeaderConfigGroups.weight,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          disabled: true,
          active: false
        }
      }
    }
  },{
    key: 'weightFundBEV',
    content: {
      label: `${SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START}Fund${SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END} - BEV`,
      attrName: 'fundBEVPctDisplay',
      underlineAttrName: 'fundBEVPct',
      blockAttrName: 'weight',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      columnWidth: 110,
      groupBelongs: SecurityTableHeaderConfigGroups.weight,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          disabled: true,
          active: false
        }
      }
    }
  },{
    key: 'weightTableBEV',
    content: {
      label: 'Table - BEV',
      attrName: 'groupBEVPctDisplay',
      underlineAttrName: 'groupBEVPct',
      blockAttrName: 'weight',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      columnWidth: 110,
      groupBelongs: SecurityTableHeaderConfigGroups.weight,
      tableSpecifics: {
        default:{
          active: true,
          groupShow: false
        },
        tradeAlert: {
          disabled: true,
          active: false
        }
      }
    }
  },{
    key: 'costDOFWeightedAvg',
    content: {
      label: 'DOF Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'costSOFWeightedAvg',
    content: {
      label: 'SOF Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'costSTIPWeightedAvg',
    content: {
      label: 'STIP Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'costFIPWeightedAvg',
    content: {
      label: 'FIP Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'costCIPWeightedAvg',
    content: {
      label: 'CIP Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'costAGBWeightedAvg',
    content: {
      label: 'AGB Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'costBBBWeightedAvg',
    content: {
      label: 'BBB Cost',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'cost',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cost,
      isDriverDependent: true,
      isAttrChangable: true,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'currentPosition',
    content: {
      label: 'Position',
      attrName: 'positionCurrentInMM',
      underlineAttrName: 'positionCurrent',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'unitPosition',
    content: {
      label: 'Firm Position',
      attrName: 'positionFirmInMM',
      underlineAttrName: 'positionFirm',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'hfPosition',
    content: {
      label: 'HF Position',
      attrName: 'positionHFInMM',
      underlineAttrName: 'positionHF',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'nlfPosition',
    content: {
      label: 'NLF Position',
      attrName: 'positionNLFInMM',
      underlineAttrName: 'positionNLF',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'dofPosition',
    content: {
      label: 'DOF Position',
      attrName: 'positionDOFInMM',
      underlineAttrName: 'positionDOF',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'sofPosition',
    content: {
      label: 'SOF Position',
      attrName: 'positionSOFInMM',
      underlineAttrName: 'positionSOF',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'stipPosition',
    content: {
      label: 'STIP Position',
      attrName: 'positionSTIPInMM',
      underlineAttrName: 'positionSTIP',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'fipPosition',
    content: {
      label: 'FIP Position',
      attrName: 'positionFIPInMM',
      underlineAttrName: 'positionFIP',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'cipPosition',
    content: {
      label: 'CIP Position',
      attrName: 'positionCIPInMM',
      underlineAttrName: 'positionCIP',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'agbPosition',
    content: {
      label: 'AGB Position',
      attrName: 'positionAGBInMM',
      underlineAttrName: 'positionAGB',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'bbbPosition',
    content: {
      label: 'BBB Position',
      attrName: 'positionBBBInMM',
      underlineAttrName: 'positionBBB',
      blockAttrName: 'position',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.position,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: true
        }
      }
    }
  },{
    key: 'lastTraceSpread',
    content: {
      label: 'Spread',
      attrName: 'lastTraceSpread',
      underlineAttrName: 'lastTraceSpread',
      blockAttrName: 'lastTrace',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: false,
      groupBelongs: SecurityTableHeaderConfigGroups.lastTrace,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          disabled: false,
          groupShow: true
        },
        tradeAlert: {
          active: false,
          disabled: true
        }
      }
    }
  },{
    key: 'lastTracePrice',
    content: {
      label: 'Price',
      attrName: 'lastTracePrice',
      underlineAttrName: 'lastTracePrice',
      blockAttrName: 'lastTrace',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: false,
      groupBelongs: SecurityTableHeaderConfigGroups.lastTrace,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          disabled: false,
          groupShow: true
        },
        tradeAlert: {
          active: false,
          disabled: true
        }
      }
    }
  },{
    key: 'lastTraceVolumeEstimated',
    content: {
      label: 'Vol (Estimated)',
      attrName: 'lastTraceVolumeEstimated',
      underlineAttrName: 'lastTraceVolumeEstimated',
      blockAttrName: 'lastTrace',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: false,
      groupBelongs: SecurityTableHeaderConfigGroups.lastTrace,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          disabled: false,
          groupShow: false
        },
        tradeAlert: {
          active: false,
          disabled: true
        }
      }
    }
  },{
    key: 'lastTraceVolumeReported',
    content: {
      label: 'Vol (Reported)',
      attrName: 'lastTraceVolumeReported',
      underlineAttrName: 'lastTraceVolumeReported',
      blockAttrName: 'lastTrace',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDriverDependent: false,
      groupBelongs: SecurityTableHeaderConfigGroups.lastTrace,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          disabled: false,
          groupShow: false
        },
        tradeAlert: {
          active: false,
          disabled: true
        }
      }
    }
  },{
    key: 'cs01CadCurrent',
    content: {
      label: 'CS01 Cad',
      attrName: 'cs01CadCurrentInK',
      underlineAttrName: 'cs01CadCurrent',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cs01,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'cs01LocalCurrent',
    content: {
      label: 'CS01 Local',
      attrName: 'cs01LocalCurrentInK',
      underlineAttrName: 'cs01LocalCurrent',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cs01,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'cs01CadFirm',
    content: {
      label: 'Firm CS01 CAD',
      attrName: 'cs01CadFirmInK',
      underlineAttrName: 'cs01CadFirm',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cs01,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'cs01LocalFirm',
    content: {
      label: 'Firm CS01 Local',
      attrName: 'cs01LocalFirmInK',
      underlineAttrName: 'cs01LocalFirm',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cs01,
      columnWidth: 95,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'dodDelta',
    content: {
      label: 'DoD Δ',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'metricPack',
      isAttrChangable: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      metricPackDeltaScope: 'Dod',
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'wowDelta',
    content: {
      label: 'WoW Δ',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'metricPack',
      isAttrChangable: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      metricPackDeltaScope: 'Wow',
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'thirtyDayDelta',
    content: {
      label: 'MoM Δ',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'metricPack',
      isAttrChangable: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      metricPackDeltaScope: 'Mom',
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'yoyDelta',
    content: {
      label: 'YoY Δ',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'metricPack',
      isAttrChangable: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      metricPackDeltaScope: 'Yoy',
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'ytdDelta',
    content: {
      label: 'YtD Δ',
      attrName: DEFAULT_DRIVER_IDENTIFIER,
      underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
      blockAttrName: 'metricPack',
      isAttrChangable: true,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      metricPackDeltaScope: 'Ytd',
      isDriverDependent: true,
      columnWidth: 95,
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'quoteCount',
    content: {
      label: 'Quote Count',
      attrName: null,
      underlineAttrName: null,
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP,
      tableSpecifics: {
        default: {
          active: false,
          disabled: true
        }
      }
    }
  },{
    key: 'primaryPM',
    content: {
      label: 'Primary',
      attrName: 'primaryPmName',
      underlineAttrName: 'primaryPmName',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.ownership,
      columnWidth: 70,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'backupPM',
    content: {
      label: 'Backup',
      attrName: 'backupPmName',
      underlineAttrName: 'backupPmName',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.ownership,
      columnWidth: 70,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'research',
    content: {
      label: 'Research',
      attrName: 'researchName',
      underlineAttrName: 'researchName',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.ownership,
      columnWidth: 70,
      tableSpecifics: {
        default: {
          active: true,
          groupShow: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'strategy',
    content: {
      label: 'Strategy',
      attrName: 'strategyFirm',
      underlineAttrName: 'strategyFirm',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP,
      tableSpecifics: {
        default: {
          active: false
        },
        tradeAlert: {
          active: false
        }
      }
    }
  },{
    key: 'hedgeFactor',
    content: {
      label: 'Hedge Factor',
      attrName: 'hedgeFactor',
      underlineAttrName: 'hedgeFactor',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      columnWidth: 95,
      groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP,
      tableSpecifics: {
        default: {
          active: true
        },
        tradeAlert: {
          active: false
        }
      }
    }
  }
];

const POSITION_ALERT_HEADERS = ['hfPosition', 'nlfPosition', 'dofPosition', 'sofPosition', 'stipPosition', 'fipPosition', 'cipPosition', 'agbPosition', 'bbbPosition'];

const TRACE_ALERT_HEADERS = ['alertTraceReportingParty', 'alertTraceContraParty', 'alertTraceVolumeEstimated', 'alertTraceVolumeReported', 'alertTraceBenchmarkName', 'alertTracePrice', 'alertTraceSpread'];

const TRACE_ALERT_EXCLUDED_HEADERS = SecurityTableHeaderConfigs.filter(header => header.key.indexOf('Trace') === -1 && !!header.content.tableSpecifics.tradeAlert && !!header.content.tableSpecifics.tradeAlert.active).map(newHeader => newHeader.key);

export const SecurityTableAlertHeaderConfigs: SecurityTableSpecificAlertHeaderConfigsStub = {
  axe: {
    include: ['cs01CadFirm'],
    exclude: ['alertTradeTrader', ...POSITION_ALERT_HEADERS, ...TRACE_ALERT_HEADERS]
  },
  mark: {
    include: ['cs01CadFirm'],
    exclude: ['alertTradeTrader', 'alertIsBenchmarkHedged', ...POSITION_ALERT_HEADERS, ...TRACE_ALERT_HEADERS]
  },
  trade: {
    include: ['cs01CadFirm'],
    exclude: ['alertType', 'alertStatus', 'alertIsBenchmarkHedged', 'hfPosition', 'nlfPosition', ...TRACE_ALERT_HEADERS]
  },
  trace: {
    include: ['alertTime', 'alertMessage', 'alertSide',...TRACE_ALERT_HEADERS],
    exclude: ['alertIsBenchmarkHedged', ...TRACE_ALERT_EXCLUDED_HEADERS]
  },
  all: {
    include: ['cs01CadFirm'],
    exclude: []
  },
}

export const QuoteHeaderConfigList: Array<SecurityTableQuoteHeaderConfigStub> = [
  {
    labelList: ['B Time', 'A Time'],
    textOnly: true,
    size: 2,
    isNonCDS: false
  },
  {
    labelList: ['Source'],
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['Dealer'],
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['B Px', 'A Px'],
    size: 3,
    textOnly: true,
    isNonCDS: true
  },{
    labelList: ['B YTW', 'A YTW'],
    size: 3,
    textOnly: true,
    isNonCDS: true
  },{
    labelList: ['B Sprd', 'A Sprd'],
    size: 3,
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['B Size', 'A Size'],
    size: 3,
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['Benchmarks'],
    size: 4,
    textOnly: true,
    isNonCDS: true
  }
];

export const TradeHistoryHeaderConfigList: Array<TradeHistoryHeaderConfigStub> = [
  {
    headerKey: 'tradeDateTime',
    headerDisplayLabel: 'Date & Time',
    attrName: 'tradeDateTimeParsed',
    size: 8
  },{
    headerKey: 'portfolio',
    headerDisplayLabel: 'Fund',
    attrName: 'vestedPortfolio'
  },{
    headerKey: 'trader',
    headerDisplayLabel: 'Trader',
    attrName: 'trader'
  },{
    headerKey: 'counterPartyName',
    headerDisplayLabel: 'Counter Party',
    attrName: 'counterPartyName',
    size: 7
  },{
    headerKey: 'quantity',
    headerDisplayLabel: 'Quantity',
    attrName: 'quantity',
    size: 7,
    applyQuantColorCodes: true,
    underlineAttrName: 'rawQuantity'
  },{
    headerKey: 'spread',
    headerDisplayLabel: 'Sprd',
    attrName: 'spread'
  },{
    headerKey: 'wgtAvgSpread',
    headerDisplayLabel: 'Sprd Cost',
    attrName: 'wgtAvgSpread',
    size: 5
  },{
    headerKey: 'price',
    headerDisplayLabel: 'Px',
    attrName: 'price'
  },{
    headerKey: 'wgtAvgPrice',
    headerDisplayLabel: 'Px Cost',
    attrName: 'wgtAvgPrice'
  },{
    headerKey: 'strategy',
    headerDisplayLabel: 'Strategy',
    attrName: 'vestedStrategy',
    size: 7
  },{
    headerKey: 'postTradeSumQuantity',
    headerDisplayLabel: 'Quantity After Trade',
    attrName: 'postTradeSumQuantity',
    size: 9
  }
];

export const TradeTraceHeaderConfigList: Array<TradeTraceHeaderConfigStub> = [
  {
    headerKey: 'displayTradeTime',
    headerDisplayLabel: 'Trade Time',
    attrName: 'displayTradeTime',
    size: 7
  },{
    headerKey: 'displayReportingTime',
    headerDisplayLabel: 'Reporting Time',
    attrName: 'displayReportingTime',
    size: 7
  },{
    headerKey: 'side',
    headerDisplayLabel: 'Side',
    attrName: 'side',
    applyQuantColorCodes: true
  },{
    headerKey: 'reportingParty',
    headerDisplayLabel: 'Reporting Party',
    attrName: 'reportingParty',
    size: 7
  },{
    headerKey: 'contraParty',
    headerDisplayLabel: 'Contra Party',
    attrName: 'contraParty',
    size: 7
  },{
    headerKey: 'displayVolumeEstimated',
    headerDisplayLabel: 'Vol (Estimated)',
    attrName: 'displayVolumeEstimated',
    size: 7,
  },{
    headerKey: 'displayVolumeReported',
    headerDisplayLabel: 'Vol (Reported)',
    attrName: 'displayVolumeReported',
    size: 7
  },
  // Temporarily disable benchmark name until feed becomes available in MA
  //{
  //   headerKey: 'displayBenchMarkName',
  //   headerDisplayLabel: 'Benchmark Name',
  //   attrName: 'displayBenchMarkName',
  //   size: 8
  // },
  {
    headerKey: 'price',
    headerDisplayLabel: 'Px',
    attrName: 'price',
    size: 5
  },{
    headerKey: 'yield',
    headerDisplayLabel: 'Yield',
    attrName: 'yield'
  },{
    headerKey: 'spread',
    headerDisplayLabel: 'Sprd',
    attrName: 'spread'
  },{
    headerKey: 'oasSpread',
    headerDisplayLabel: 'OAS Sprd',
    attrName: 'oasSpread',
    size: 5
  },{
    headerKey: 'gSpread',
    headerDisplayLabel: 'G Sprd',
    attrName: 'gSpread',
  },{
    headerKey: 'iSpread',
    headerDisplayLabel: 'I Sprd',
    attrName: 'iSpread',
  },
  {
    headerKey: 'parSpread',
    headerDisplayLabel: 'Par Sprd',
    attrName: 'parSpread',
    size: 4
  }
]

export const AGGRID_PINNED_FULL_WIDTH_ROW_KEYWORD = 'fullWidth';

export const AGGRID_PINNED_FULL_WIDTH_PINNED_ROW_KEYWORD = 'pinned';

export const TRACE_SCATTER_GRAPH_ID = 'traceScatterGraphID';

export const TRACE_PIE_GRAPH_LEFT_ID = 'tracePieGraphLeftID';

export const TRACE_PIE_GRAPH_RIGHT_ID = 'tracePieGraphRightID';

export const TRACE_SCATTER_GRAPH_WEEKLY_TIME_INTERVAL = 1440; // 24hrs as minutes

export enum TraceTradeParty {
  Dealer = 'Dealer',
  Client = 'Client',
  ClientAffiliate = 'Client Affiliate',
  ATS = 'ATS'
}

export enum TradeSideValueEquivalent {
  Bid = 'Buy',
  Ask = 'Sell'
}

export enum traceTradeNumericalFilters {
  filter250K = '≥ 250K',
  filter1M = '≥ 1M',
  filter5M = '≥ 5M'
}

export enum traceTradeFilterAmounts {
  thousand = 1000,
  million = 1000000
}

export enum traceTradeNumericalFilterSymbols {
  greaterThan = '≥',
  lessThan = '≤'
}

export enum traceTradePieGraphKeys {
  contraParty = 'contraParty',
  side = 'side'
}

export enum benchMarkHedgedDisplayOptions {
  yes = 'Y',
  no = 'N'
}

export const TraceTradePartyList: Array<TraceTradeParty> = [TraceTradeParty.Dealer, TraceTradeParty.Client, TraceTradeParty.ClientAffiliate, TraceTradeParty.ATS];
