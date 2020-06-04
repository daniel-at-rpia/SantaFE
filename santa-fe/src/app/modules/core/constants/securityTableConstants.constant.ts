import {
  SecurityTableMetricStub,
  SecurityTableQuoteMetric
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
export const AGGRID_SIMPLE_NUM_COLUMN_WIDTH = 140;
export const AGGRID_SIMPLE_TEXT_COLUMN_WIDTH = 135;
export const AGGRID_NARROW_COLUMN_WIDTH = 85;
export const AGGRID_ROW_HEIGHT = 40;
export const AGGRID_ROW_HEIGHT_SLIM = 32;
export const AGGRID_DETAIL_ROW_HEIGHT_PER_ROW = 34;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET = 120;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET_OFFTHERUNCDS = 155;
export const AGGRID_DETAIL_ROW_DEFAULT_COUNT = 10;
export const AGGRID_DETAIL_ROW_HEIGHT_MAX = AGGRID_DETAIL_ROW_HEIGHT_OFFSET + AGGRID_DETAIL_ROW_HEIGHT_PER_ROW * AGGRID_DETAIL_ROW_DEFAULT_COUNT;
export const AGGRID_DETAIL_ROW_HEIGHT_DEFAULT = 200;
export const AGGRID_HEADER_CLASS = 'santaTable__agGridTable-agGrid-header';
export const AGGRID_ROW_CLASS = 'santaTable__agGridTable-agGrid-row';
export const AGGRID_CELL_CLASS = 'santaTable__agGridTable-agGrid-cell';
export const AGGRID_DETAIL_COLUMN_KEY = 'Quotes';

export const SECURITY_TABLE_HEADER_NO_GROUP = 'noGroup';
export const SecurityTableMetricGroups = {
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

export const SecurityTableMetrics: Array<SecurityTableMetricStub> = [
  {
    key: 'securityCard',
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
  },{
    key: 'alertTime',
    label: 'Time',
    attrName: 'alertTime',
    underlineAttrName: 'alertTimeRaw',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertType',
    label: 'Type',
    attrName: 'alertType',
    underlineAttrName: 'alertType',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertStatus',
    label: 'Status',
    attrName: 'alertStatus',
    underlineAttrName: 'alertStatus',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertSide',
    label: 'Side',
    attrName: 'alertSide',
    underlineAttrName: 'alertSide',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertLevel',
    label: 'Level',
    attrName: 'alertLevel',
    underlineAttrName: 'alertLevelRaw',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: false,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertQuantity',
    label: 'Quantity (MM)',
    attrName: 'alertQuantity',
    underlineAttrName: 'alertQuantityRaw',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: false,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertQuoteDealer',
    label: 'Dealer',
    attrName: 'alertQuoteDealer',
    underlineAttrName: 'alertQuoteDealer',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.alert,
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
  },{
    key: 'alertTradeTrader',
    label: 'Trader',
    attrName: 'alertTradeTrader',
    underlineAttrName: 'alertTradeTrader',
    blockAttrName: 'alert',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.alert,
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
    // },{
    //   key: 'alertMessage',
    //   label: 'Alert Message',
    //   attrName: 'alertMessage',
    //   underlineAttrName: 'alertMessage',
    //   blockAttrName: 'alert',
    //   readyStage: SECURITY_TABLE_FINAL_STAGE,
    //   isDataTypeText: true,
    //   groupBelongs: SecurityTableMetricGroups.alert,
    //   tableSpecifics: {
    //     default: {
    //       active: false,
    //       disabled: true
    //     },
    //     tradeAlert: {
    //       active: true,
    //       disabled: false,
    //       groupShow: false
    //     }
    //   }
    // },{
    //   key: 'alertValue',
    //   label: 'Alert Value',
    //   attrName: 'alertValue',
    //   underlineAttrName: 'alertValue',
    //   blockAttrName: 'alert',
    //   readyStage: SECURITY_TABLE_FINAL_STAGE,
    //   isDataTypeText: true,
    //   groupBelongs: SecurityTableMetricGroups.alert,
    //   tableSpecifics: {
    //     default: {
    //       active: false,
    //       disabled: true
    //     },
    //     tradeAlert: {
    //       active: true,
    //       disabled: false,
    //       groupShow: false
    //     }
    //   }
    // },{
    //   key: 'alertTarget',
    //   label: 'Alert Target',
    //   attrName: 'alertTarget',
    //   underlineAttrName: 'alertTarget',
    //   blockAttrName: 'alert',
    //   readyStage: SECURITY_TABLE_FINAL_STAGE,
    //   isDataTypeText: true,
    //   groupBelongs: SecurityTableMetricGroups.alert,
    //   tableSpecifics: {
    //     default: {
    //       active: false,
    //       disabled: true
    //     },
    //     tradeAlert: {
    //       active: true,
    //       disabled: false,
    //       groupShow: false
    //     }
    //   }
  },{
    key: 'bestQuote',
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    blockAttrName: 'combined',
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isForQuantComparer: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
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
  },{
    key: 'bestAxeQuote',
    label: 'Best Axe Quote (Bid vs Ask)',
    attrName: null,
    blockAttrName: 'axe',
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isForQuantComparer: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
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
  },{
    key: 'bestBid',
    label: 'Best Bid',
    attrName: 'bid',
    blockAttrName: 'bestQuote',
    underlineAttrName: 'bid',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'bestAsk',
    label: 'Best Ask',
    attrName: 'ask',
    blockAttrName: 'bestQuote',
    underlineAttrName: 'ask',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'mark',
    label: 'Mark',
    attrName: 'mark',
    underlineAttrName: 'markRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'price',
    label: 'Price',
    attrName: 'price',
    underlineAttrName: 'priceRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'spread',
    label: 'Spread',
    attrName: 'spread',
    underlineAttrName: 'spreadRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markDriver',
    label: 'Driver',
    attrName: 'markDriver',
    underlineAttrName: 'markDriver',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'indexMark',
    label: 'Index Mark (t-1)',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markDeltaToIndex',
    label: 'Δ to Index Mark (t-1)',
    attrName: 'markDisIndex',
    underlineAttrName: 'markDisIndexRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markLastUpdatedBy',
    label: 'Mark Last Updated By',
    attrName: 'markChangedBy',
    underlineAttrName: 'markChangedBy',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markLastUpdateTime',
    label: 'Mark Last Update Time',
    attrName: 'markChangedTime',
    underlineAttrName: 'markChangedTime',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.mark,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markDeltaToBid',
    label: 'Δ to Bid',
    attrName: 'markDisBid',
    underlineAttrName: 'markDisBidRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markDeltaToAsk',
    label: 'Δ to Ask',
    attrName: 'markDisAsk',
    underlineAttrName: 'markDisAskRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markDeltaToMid',
    label: 'Δ to Mid',
    attrName: 'markDisMid',
    underlineAttrName: 'markDisMidRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'markDeltaToLiquidation',
    label: 'Δ to Liquid',
    attrName: 'markDisLiquidation',
    underlineAttrName: 'markDisLiquidationRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  // },{
  //   key: 'costCurrentFifo',
  //   label: 'Fifo',
  //   attrName: DEFAULT_DRIVER_IDENTIFIER,
  //   underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
  //   blockAttrName: 'cost',
  //   readyStage: SECURITY_TABLE_FINAL_STAGE,
  //   groupBelongs: SecurityTableMetricGroups.cost,
  //   isDriverDependent: true,
  //   isAttrChangable: true,
  //   tableSpecifics: {
  //     default: {
  //       active: true,
  //       groupShow: true
  //     },
  //     tradeAlert: {
  //       active: true,
  //       groupShow: true
  //     }
  //   }
  // },{
  //   key: 'costCurrentWeightedAvg',
  //   label: 'Wgt Avg',
  //   attrName: DEFAULT_DRIVER_IDENTIFIER,
  //   underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
  //   blockAttrName: 'cost',
  //   readyStage: SECURITY_TABLE_FINAL_STAGE,
  //   groupBelongs: SecurityTableMetricGroups.cost,
  //   isDriverDependent: true,
  //   isAttrChangable: true,
  //   tableSpecifics: {
  //     default: {
  //       active: true,
  //       groupShow: true
  //     },
  //     tradeAlert: {
  //       active: true,
  //       groupShow: true
  //     }
  //   }
  },{
    key: 'costDOFWeightedAvg',
    label: 'DOF Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: true,
        groupShow: true
      }
    }
  },{
    key: 'costSOFWeightedAvg',
    label: 'SOF Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: true,
        groupShow: false
      }
    }
  },{
    key: 'costSTIPWeightedAvg',
    label: 'STIP Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: true,
        groupShow: false
      }
    }
  },{
    key: 'costFIPWeightedAvg',
    label: 'FIP Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: true,
        groupShow: false
      }
    }
  },{
    key: 'costCIPWeightedAvg',
    label: 'CIP Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: true,
        groupShow: false
      }
    }
  },{
    key: 'costAGBWeightedAvg',
    label: 'AGB Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: true,
        groupShow: false
      }
    }
  },{
    key: 'costBBBWeightedAvg',
    label: 'BBB Cost',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'cost',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cost,
    isDriverDependent: true,
    isAttrChangable: true,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: false
      },
      tradeAlert: {
        active: true,
        groupShow: false
      }
    }
  },{
    key: 'currentPosition',
    label: 'Position',
    attrName: 'positionCurrentInMM',
    underlineAttrName: 'positionCurrent',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
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
  },{
    key: 'unitPosition',
    label: 'Firm Position',
    attrName: 'positionFirmInMM',
    underlineAttrName: 'positionFirm',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
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
  },{
    key: 'hfPosition',
    label: 'HF Position',
    attrName: 'positionHFInMM',
    underlineAttrName: 'positionHF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'nlfPosition',
    label: 'NLF Position',
    attrName: 'positionNLFInMM',
    underlineAttrName: 'positionNLF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'dofPosition',
    label: 'DOF Position',
    attrName: 'positionDOFInMM',
    underlineAttrName: 'positionDOF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'sofPosition',
    label: 'SOF Position',
    attrName: 'positionSOFInMM',
    underlineAttrName: 'positionSOF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'stipPosition',
    label: 'STIP Position',
    attrName: 'positionSTIPInMM',
    underlineAttrName: 'positionSTIP',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'fipPosition',
    label: 'FIP Position',
    attrName: 'positionFIPInMM',
    underlineAttrName: 'positionFIP',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'cipPosition',
    label: 'CIP Position',
    attrName: 'positionCIPInMM',
    underlineAttrName: 'positionCIP',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'agbPosition',
    label: 'AGB Position',
    attrName: 'positionAGBInMM',
    underlineAttrName: 'positionAGB',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'bbbPosition',
    label: 'BBB Position',
    attrName: 'positionBBBInMM',
    underlineAttrName: 'positionBBB',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.position,
    isColumnWidthNarrow: true,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'cs01CadCurrent',
    label: 'CS01 Cad',
    attrName: 'cs01CadCurrentInK',
    underlineAttrName: 'cs01CadCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cs01,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'cs01LocalCurrent',
    label: 'CS01 Local',
    attrName: 'cs01LocalCurrentInK',
    underlineAttrName: 'cs01LocalCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cs01,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'cs01CadFirm',
    label: 'Firm CS01 CAD',
    attrName: 'cs01CadFirmInK',
    underlineAttrName: 'cs01CadFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cs01,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'cs01LocalFirm',
    label: 'Firm CS01 Local',
    attrName: 'cs01LocalFirmInK',
    underlineAttrName: 'cs01LocalFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    groupBelongs: SecurityTableMetricGroups.cs01,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'dodDelta',
    label: 'DoD Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Dod',
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'wowDelta',
    label: 'WoW Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Wow',
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'thirtyDayDelta',
    label: 'MoM Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Mom',
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'yoyDelta',
    label: 'YoY Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Yoy',
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'ytdDelta',
    label: 'YtD Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Ytd',
    isDriverDependent: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'quoteCount',
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
  },{
    key: 'ticker',
    label: 'Ticker',
    attrName: 'ticker',
    underlineAttrName: 'ticker',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'rating',
    label: 'Rating',
    attrName: 'ratingValue',
    underlineAttrName: 'ratingValue',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'currency',
    label: 'Currency',
    attrName: 'currency',
    underlineAttrName: 'currency',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'sector',
    label: 'Sector',
    attrName: 'sector',
    underlineAttrName: 'sector',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'issuer',
    label: 'Issuer',
    attrName: 'obligorName',
    underlineAttrName: 'obligorName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'industry',
    label: 'Industry',
    attrName: 'industry',
    underlineAttrName: 'industry',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'securityType',
    label: 'Security Type',
    attrName: 'securityType',
    underlineAttrName: 'securityType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'seniority',
    label: 'Seniority',
    attrName: 'seniority',
    underlineAttrName: 'seniority',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'country',
    label: 'Country',
    attrName: 'country',
    underlineAttrName: 'country',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'maturityType',
    label: 'Maturity Type',
    attrName: 'maturityType',
    underlineAttrName: 'maturityType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    tableSpecifics: {
      default: {
        active: false
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'primaryPM',
    label: 'Primary',
    attrName: 'primaryPmName',
    underlineAttrName: 'primaryPmName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.ownership,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'backupPM',
    label: 'Backup',
    attrName: 'backupPmName',
    underlineAttrName: 'backupPmName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.ownership,
    tableSpecifics: {
      default: {
        active: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'research',
    label: 'Research',
    attrName: 'researchName',
    underlineAttrName: 'researchName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.ownership,
    tableSpecifics: {
      default: {
        active: true,
        groupShow: true
      },
      tradeAlert: {
        active: false
      }
    }
  },{
    key: 'strategy',
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
  },{
    key: 'hedgeFactor',
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
];

export const QuoteMetricList: Array<SecurityTableQuoteMetric> = [
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
