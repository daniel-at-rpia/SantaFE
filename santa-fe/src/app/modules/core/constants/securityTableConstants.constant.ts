import {
  SecurityTableHeaderConfigStub,
  SecurityTableQuoteHeaderConfigStub,
  TradeHistoryHeaderConfigStub
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
export const AGGRID_SECURITY_CARD_COLUMN_WIDTH = 276;
export const AGGRID_QUOTE_COLUMN_WIDTH = 244;    // $securityTable_cell_width_quant + $spacing_small * 2
export const AGGRID_ALERT_SIDE_COLUMN_WIDTH = 115;
export const AGGRID_ALERT_STATUS_COLUMN_WIDTH = 145;  // can not use simple text because cancelled status would wrap into 2 lines
export const AGGRID_SIMPLE_NUM_COLUMN_WIDTH = 140;
export const AGGRID_SIMPLE_TEXT_COLUMN_WIDTH = 135;
export const AGGRID_NARROW_COLUMN_WIDTH = 95;
export const AGGRID_ALERT_MESSAGE_COLUMN_WIDTH = 240;
export const AGGRID_ROW_HEIGHT = 40;
export const AGGRID_ROW_HEIGHT_SLIM = 32;
export const AGGRID_DETAIL_ROW_HEIGHT_PER_ROW = 34;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET = 140;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET_OFFTHERUNCDS = 175;
export const AGGRID_DETAIL_ROW_DEFAULT_COUNT = 9;
export const AGGRID_DETAIL_ROW_HEIGHT_MAX = AGGRID_DETAIL_ROW_HEIGHT_OFFSET + AGGRID_DETAIL_ROW_HEIGHT_PER_ROW * AGGRID_DETAIL_ROW_DEFAULT_COUNT;
export const AGGRID_DETAIL_ROW_HEIGHT_DEFAULT = 200;
export const AGGRID_HEADER_CLASS = 'santaTable__agGridTable-agGrid-header';
export const AGGRID_ROW_CLASS = 'santaTable__agGridTable-agGrid-row';
export const AGGRID_CELL_CLASS = 'santaTable__agGridTable-agGrid-cell';
export const AGGRID_DETAIL_COLUMN_KEY = 'Quotes';

export const SECURITY_TABLE_HEADER_NO_GROUP = 'noGroup';
export const SecurityTableHeaderConfigGroups = {
  bestQuote: 'Best Quote',
  alert: 'Alert-related',
  mark: 'Mark',
  markDiscrepancies: 'Mark Discrepancies',
  cost: 'Position Cost',
  position: 'Position (MM)',
  cs01: 'CS01 (k)',
  delta: 'Security Driver Deltas',
  securityInfo: 'Security Info',
  ownership: 'Ownership'
};

export const SECURITY_TABLE_ICONS = {
  columnGroupOpened: '<i class="far fa-plus-square"/>',
  columnGroupClosed: '<i class="far fa-minus-square"/>',
  menu: '<i class="fa fa-bars" style="width: 10px"/>',
  sortAscending: '<i class="fas fa-sort-amount-up"></i>',
  sortDescending: '<i class="fas fa-sort-amount-down"></i>'
};

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
      isColumnWidthNarrow: true,
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
    key: 'alertType',
    content: {
      label: 'Type',
      attrName: 'alertType',
      underlineAttrName: 'alertType',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: true,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      isColumnWidthNarrow: true,
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
    key: 'alertSide',
    content: {
      label: 'Side',
      attrName: 'alertSide',
      underlineAttrName: 'alertSide',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      isColumnWidthNarrow: true,
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
    key: 'alertLevel',
    content: {
      label: 'Level',
      attrName: 'alertLevel',
      underlineAttrName: 'alertLevelRaw',
      blockAttrName: 'alert',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isDataTypeText: false,
      groupBelongs: SecurityTableHeaderConfigGroups.alert,
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isForQuantComparer: true,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.bestQuote,
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
      isForQuantComparer: true,
      isDriverDependent: true,
      groupBelongs: SecurityTableHeaderConfigGroups.bestQuote,
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
      isFrontEndMetric: true,
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
      isFrontEndMetric: true,
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
    key: 'markDeltaToIndex',
    content: {
      label: 'Δ to Index Mark (t-1)',
      attrName: 'markDisIndex',
      underlineAttrName: 'markDisIndexRaw',
      blockAttrName: 'mark',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      isFrontEndMetric: true,
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
    key: 'sector',
    content: {
      label: 'Sector',
      attrName: 'sector',
      underlineAttrName: 'sector',
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
    key: 'issuer',
    content: {
      label: 'Issuer',
      attrName: 'obligorName',
      underlineAttrName: 'obligorName',
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
    key: 'industry',
    content: {
      label: 'Industry',
      attrName: 'industry',
      underlineAttrName: 'industry',
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
    key: 'securityType',
    content: {
      label: 'Security Type',
      attrName: 'securityType',
      underlineAttrName: 'securityType',
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
      isFrontEndMetric: true,
      isDriverDependent: true,
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
      isFrontEndMetric: true,
      isDriverDependent: true,
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
      isFrontEndMetric: true,
      isDriverDependent: true,
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
      isFrontEndMetric: true,
      isDriverDependent: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
      isColumnWidthNarrow: true,
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
    key: 'cs01CadCurrent',
    content: {
      label: 'CS01 Cad',
      attrName: 'cs01CadCurrentInK',
      underlineAttrName: 'cs01CadCurrent',
      readyStage: SECURITY_TABLE_FINAL_STAGE,
      groupBelongs: SecurityTableHeaderConfigGroups.cs01,
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
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
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
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
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
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
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
      groupBelongs: SecurityTableHeaderConfigGroups.delta,
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
    size: 6,
    applyQuantColorCodes: true,
    underlineAttrName: 'rawQuantity'
  },{
    headerKey: 'spread',
    headerDisplayLabel: 'Spread',
    attrName: 'spread'
  },{
    headerKey: 'wgtAvgSpread',
    headerDisplayLabel: 'Spread Cost',
    attrName: 'wgtAvgSpread',
    size: 6
  },{
    headerKey: 'price',
    headerDisplayLabel: 'Price',
    attrName: 'price'
  },{
    headerKey: 'wgtAvgPrice',
    headerDisplayLabel: 'Price Cost',
    attrName: 'wgtAvgPrice',
    size: 6
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