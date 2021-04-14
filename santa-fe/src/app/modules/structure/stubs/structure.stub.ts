import {
  BEGetPortfolioStructureServerReturn,
  BEStructuringBreakdownMetricBlockWithSubPortfolios,
  BEStructuringSetViewReturn
} from 'BEModels/backend-models.interface';
import { PortfolioShortNames } from 'Core/constants/structureConstants.constants';

// always remove bics lv 2+ to save space

export const PortfolioStructuringSample: BEGetPortfolioStructureServerReturn = {
  "Now": [
    {
      "date": "2021-01-21T00:00:00-05:00",
      "portfolioId": 6,
      "portfolioShortName": PortfolioShortNames.STIP,
      "portfolioNav": 1184004137.819623,
      "currentTotals": {
        "All": {
          "Cs01": 611461.9,
          "CreditDuration": 5.164,
          "CreditLeverage": 0.87
        },
        "ShortCarry": {
          "Cs01": 29397.7,
          "CreditDuration": 0.248,
          "CreditLeverage": 0.219
        },
        "NonShortCarry": {
          "Cs01": 582064.2,
          "CreditDuration": 4.916,
          "CreditLeverage": 0.651
        },
        "NonHedging": {
          "Cs01": 615236.6,
          "CreditDuration": 5.196,
          "CreditLeverage": 0.877
        }
      },
      "indexId": 23,
      "indexShortName": "DEX Corp",
      "isIndexValid": true,
      "indexNav": 526094011787.1118,
      "indexTotals": {
        "Cs01": 367288713.0,
        "CreditDuration": 6.981,
        "CreditLeverage": 1.01
      },
      "target": {
        "portfolioTargetId": "4016b85e-e532-41d5-9a76-763b2d44965e",
        "date": "2021-01-21T00:00:00-05:00",
        "portfolioId": 6,
        "target": {
          "All": {
            "Cs01": null,
            "CreditDuration": null,
            "CreditLeverage": null
          },
          "ShortCarry": {
            "Cs01": null,
            "CreditDuration": null,
            "CreditLeverage": null
          },
          "NonShortCarry": {
            "Cs01": null,
            "CreditDuration": null,
            "CreditLeverage": null
          },
          "NonHedging": {
            "Cs01": null,
            "CreditDuration": null,
            "CreditLeverage": null
          }
        }
      },
      "breakdowns": {
        "Ccy": {
          "portfolioBreakdownId": "8dfcaf95-54b1-4600-9ad8-1108bde7be7b",
          "portfolioId": 6,
          "indexId": 23,
          "groupOption": "Ccy",
          "breakdown": {
            "CAD": {
              "metricBreakdowns": {
                "All": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 239535.8,
                    "currentPct": 0.392,
                    "indexPct": 1.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2.02,
                    "currentPct": 0.391,
                    "indexPct": 1.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.36,
                    "currentPct": 0.414,
                    "indexPct": 1.0
                  }
                },
                "ShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2986.9,
                    "currentPct": 0.102,
                    "indexPct": 1.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.02,
                    "currentPct": 0.081,
                    "indexPct": 1.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.11,
                    "currentPct": 0.502,
                    "indexPct": 1.0
                  }
                },
                "NonShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 236548.9,
                    "currentPct": 0.406,
                    "indexPct": 1.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2.0,
                    "currentPct": 0.407,
                    "indexPct": 1.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.25,
                    "currentPct": 0.384,
                    "indexPct": 1.0
                  }
                },
                "NonHedging": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 239535.8,
                    "currentPct": 0.389,
                    "indexPct": 1.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2.02,
                    "currentPct": 0.389,
                    "indexPct": 1.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.36,
                    "currentPct": 0.41,
                    "indexPct": 1.0
                  }
                }
              },
              "view": "Positive"
            },
            "USD": {
              "metricBreakdowns": {
                "All": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 332013.3,
                    "currentPct": 0.543,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2.8,
                    "currentPct": 0.542,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.44,
                    "currentPct": 0.506,
                    "indexPct": 0.0
                  }
                },
                "ShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 26410.7,
                    "currentPct": 0.898,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.22,
                    "currentPct": 0.887,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.11,
                    "currentPct": 0.502,
                    "indexPct": 0.0
                  }
                },
                "NonShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 305602.5,
                    "currentPct": 0.525,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2.58,
                    "currentPct": 0.525,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.34,
                    "currentPct": 0.522,
                    "indexPct": 0.0
                  }
                },
                "NonHedging": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 335788.0,
                    "currentPct": 0.546,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 2.84,
                    "currentPct": 0.547,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.45,
                    "currentPct": 0.513,
                    "indexPct": 0.0
                  }
                }
              },
              "view": "Deteriorating"
            },
            "EUR": {
              "metricBreakdowns": {
                "All": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 39912.8,
                    "currentPct": 0.065,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.34,
                    "currentPct": 0.066,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.07,
                    "currentPct": 0.08,
                    "indexPct": 0.0
                  }
                },
                "ShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "NonShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 39912.8,
                    "currentPct": 0.069,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.34,
                    "currentPct": 0.069,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.07,
                    "currentPct": 0.108,
                    "indexPct": 0.0
                  }
                },
                "NonHedging": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 39912.8,
                    "currentPct": 0.065,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.34,
                    "currentPct": 0.065,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.07,
                    "currentPct": 0.08,
                    "indexPct": 0.0
                  }
                }
              },
              "view": "Deteriorating"
            },
            "GBP": {
              "metricBreakdowns": {
                "All": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "ShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "NonShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "NonHedging": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                }
              },
              "view": null
            }
          }
        }
      },
      "overrides": {
        "Ccy|CouponType|Tenor": {
          "USD|Float|10Y,20Y,30Y,3Y,5Y,7Y": {
            "portfolioOverrideId": "0e397867-d9d3-4b42-abfb-e07ef58a7b39",
            "portfolioId": 6,
            "indexId": 23,
            "bucket": {
              "Ccy": [
                "USD"
              ],
              "Tenor": [
                "10Y",
                "20Y",
                "30Y",
                "3Y",
                "5Y",
                "7Y"
              ],
              "CouponType": [
                "Float"
              ]
            },
            "simpleBucket": {
              "Ccy": [
                "USD"
              ],
              "CouponType": [
                "Float"
              ],
              "Tenor": [
                "10Y",
                "20Y",
                "30Y",
                "3Y",
                "5Y",
                "7Y"
              ]
            },
            "simpleBucketOptions": "Ccy|CouponType|Tenor",
            "simpleBucketValues": "USD|Float|10Y,20Y,30Y,3Y,5Y,7Y",
            "title": "USD FRNs Beyond Libor Cessation",
            "breakdown": {
              "metricBreakdowns": {
                "All": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 1149.1,
                    "currentPct": 0.002,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.01,
                    "currentPct": 0.002,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "NonHedging": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 1149.1,
                    "currentPct": 0.002,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.01,
                    "currentPct": 0.002,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "ShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 1149.1,
                    "currentPct": 0.039,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.01,
                    "currentPct": 0.04,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                },
                "NonShortCarry": {
                  "Cs01": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditDuration": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  },
                  "CreditLeverage": {
                    "targetLevel": null,
                    "targetPct": null,
                    "currentLevel": 0.0,
                    "currentPct": 0.0,
                    "indexPct": 0.0
                  }
                }
              },
              "view": "Deteriorating"
            }
          }
        }
      }
    }
  ]
}

export const PortfolioStructureBreakdownRowEmptySample: BEStructuringBreakdownMetricBlockWithSubPortfolios = {
  "metricBreakdowns": {
    "All": {
      "CreditLeverage": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "CreditDuration" : {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "Cs01": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      }
    },
    "NonHedging": {
      "CreditLeverage": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "CreditDuration" : {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "Cs01": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      }
    },
    "NonShortCarry": {
      "CreditLeverage": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "CreditDuration" : {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "Cs01": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      }
    },
    "ShortCarry": {
      "CreditLeverage": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "CreditDuration" : {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      },
      "Cs01": {
        "targetPct": null,
        "targetLevel": null,
        "currentLevel": 0.0,
        "currentPct": 0.0,
        "indexPct": 0.0
      }
    }
  },
  "view": null
}

const StructuringSetViewReturnSample: BEStructuringSetViewReturn = {
  "12": {
    "portfolioBreakdown": {
      "Ccy": {
        "portfolioBreakdownId": "59b25d3b-a775-47a3-8954-3e2394ca3a2e",
        "portfolioId": 12,
        "indexId": 35,
        "groupOption": "Ccy",
        "breakdown": {
          "CAD": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 598802.6,
                  "currentPct": 0.461,
                  "indexPct": 0.03
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 3.42,
                  "currentPct": 0.461,
                  "indexPct": 0.03
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.16,
                  "currentPct": 0.437,
                  "indexPct": 0.03
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 406946.9,
                  "currentPct": 0.493,
                  "indexPct": 0.03
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2.32,
                  "currentPct": 0.492,
                  "indexPct": 0.03
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.95,
                  "currentPct": 0.5,
                  "indexPct": 0.03
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 191855.8,
                  "currentPct": 0.405,
                  "indexPct": 0.03
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.1,
                  "currentPct": 0.407,
                  "indexPct": 0.03
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.21,
                  "currentPct": 0.279,
                  "indexPct": 0.03
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 598802.6,
                  "currentPct": 0.339,
                  "indexPct": 0.03
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 3.42,
                  "currentPct": 0.339,
                  "indexPct": 0.03
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.16,
                  "currentPct": 0.358,
                  "indexPct": 0.03
                }
              }
            },
            "view": "Positive"
          },
          "USD": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 633692.5,
                  "currentPct": 0.488,
                  "indexPct": 0.62
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 3.62,
                  "currentPct": 0.488,
                  "indexPct": 0.62
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.37,
                  "currentPct": 0.516,
                  "indexPct": 0.6
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 393650.4,
                  "currentPct": 0.477,
                  "indexPct": 0.62
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2.25,
                  "currentPct": 0.477,
                  "indexPct": 0.62
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.89,
                  "currentPct": 0.469,
                  "indexPct": 0.6
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 240042.1,
                  "currentPct": 0.507,
                  "indexPct": 0.62
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.37,
                  "currentPct": 0.507,
                  "indexPct": 0.62
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.48,
                  "currentPct": 0.637,
                  "indexPct": 0.6
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 962014.2,
                  "currentPct": 0.544,
                  "indexPct": 0.62
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 5.49,
                  "currentPct": 0.544,
                  "indexPct": 0.62
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.81,
                  "currentPct": 0.558,
                  "indexPct": 0.6
                }
              }
            },
            "view": null
          },
          "EUR": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 59299.5,
                  "currentPct": 0.046,
                  "indexPct": 0.27
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.34,
                  "currentPct": 0.046,
                  "indexPct": 0.27
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.09,
                  "currentPct": 0.034,
                  "indexPct": 0.32
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 20054.8,
                  "currentPct": 0.024,
                  "indexPct": 0.27
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.11,
                  "currentPct": 0.023,
                  "indexPct": 0.27
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.04,
                  "currentPct": 0.021,
                  "indexPct": 0.32
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 39244.7,
                  "currentPct": 0.083,
                  "indexPct": 0.27
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.22,
                  "currentPct": 0.081,
                  "indexPct": 0.27
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.05,
                  "currentPct": 0.066,
                  "indexPct": 0.32
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 200068.2,
                  "currentPct": 0.113,
                  "indexPct": 0.27
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.14,
                  "currentPct": 0.113,
                  "indexPct": 0.27
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.25,
                  "currentPct": 0.077,
                  "indexPct": 0.32
                }
              }
            },
            "view": null
          },
          "GBP": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 7455.9,
                  "currentPct": 0.006,
                  "indexPct": 0.08
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.04,
                  "currentPct": 0.005,
                  "indexPct": 0.08
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.03,
                  "currentPct": 0.011,
                  "indexPct": 0.05
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 5188.3,
                  "currentPct": 0.006,
                  "indexPct": 0.08
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.03,
                  "currentPct": 0.006,
                  "indexPct": 0.08
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.02,
                  "currentPct": 0.01,
                  "indexPct": 0.05
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2267.6,
                  "currentPct": 0.005,
                  "indexPct": 0.08
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.01,
                  "currentPct": 0.004,
                  "indexPct": 0.08
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.01,
                  "currentPct": 0.013,
                  "indexPct": 0.05
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 7455.9,
                  "currentPct": 0.004,
                  "indexPct": 0.08
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.04,
                  "currentPct": 0.004,
                  "indexPct": 0.08
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.03,
                  "currentPct": 0.009,
                  "indexPct": 0.05
                }
              }
            },
            "view": null
          }
        }
      }
    },
    "portfolioOverride": {
      "BicsCode|Ccy|Seniority|Tenor": {
        "1410|CAD|SR|2Y,3Y,5Y": {
          "portfolioOverrideId": "e92b59c5-ceca-4ae6-858a-2396292ca42e",
          "portfolioId": 12,
          "indexId": 35,
          "bucket": {
            "Ccy": [
              "CAD"
            ],
            "Tenor": [
              "2Y",
              "3Y",
              "5Y"
            ],
            "BicsCode": [
              "1410",
              "141010",
              "14101010",
              "14101011",
              "1410101110",
              "1410101111",
              "1410101112"
            ],
            "Seniority": [
              "SR"
            ]
          },
          "simpleBucket": {
            "Ccy": [
              "CAD"
            ],
            "Tenor": [
              "2Y",
              "3Y",
              "5Y"
            ],
            "BicsCode": [
              "1410"
            ],
            "Seniority": [
              "SR"
            ]
          },
          "title": "CAD SR Banks Test",
          "breakdown": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 120665.6,
                  "currentPct": 0.093,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.69,
                  "currentPct": 0.093,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.23,
                  "currentPct": 0.087,
                  "indexPct": 0.01
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 120665.6,
                  "currentPct": 0.068,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.69,
                  "currentPct": 0.068,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.23,
                  "currentPct": 0.071,
                  "indexPct": 0.01
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 118858.6,
                  "currentPct": 0.144,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.68,
                  "currentPct": 0.144,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.23,
                  "currentPct": 0.121,
                  "indexPct": 0.01
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1807.0,
                  "currentPct": 0.004,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.01,
                  "currentPct": 0.004,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.01
                }
              }
            },
            "view": "Positive"
          }
        }
      }
    }
  },
  "15": {
    "portfolioBreakdown": {
      "Ccy": {
        "portfolioBreakdownId": "1228f3b3-e7e3-4282-bca9-68ea8829467b",
        "portfolioId": 15,
        "indexId": 30,
        "groupOption": "Ccy",
        "breakdown": {
          "CAD": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 38877.0,
                  "currentPct": 0.13,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.52,
                  "currentPct": 0.13,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.24,
                  "currentPct": 0.12,
                  "indexPct": 0.0
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 6353.4,
                  "currentPct": 0.13,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.09,
                  "currentPct": 0.137,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.09,
                  "currentPct": 0.171,
                  "indexPct": 0.0
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 32523.6,
                  "currentPct": 0.224,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.44,
                  "currentPct": 0.226,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.15,
                  "currentPct": 0.121,
                  "indexPct": 0.0
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 38877.0,
                  "currentPct": 0.096,
                  "indexPct": 0.0
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.52,
                  "currentPct": 0.095,
                  "indexPct": 0.0
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.24,
                  "currentPct": 0.102,
                  "indexPct": 0.0
                }
              }
            },
            "view": "Positive"
          },
          "USD": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 164529.0,
                  "currentPct": 0.551,
                  "indexPct": 0.8
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2.2,
                  "currentPct": 0.55,
                  "indexPct": 0.8
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.51,
                  "currentPct": 0.755,
                  "indexPct": 0.78
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 42559.1,
                  "currentPct": 0.87,
                  "indexPct": 0.8
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.57,
                  "currentPct": 0.87,
                  "indexPct": 0.8
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.44,
                  "currentPct": 0.837,
                  "indexPct": 0.78
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 121969.9,
                  "currentPct": 0.838,
                  "indexPct": 0.8
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.63,
                  "currentPct": 0.836,
                  "indexPct": 0.8
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.07,
                  "currentPct": 0.864,
                  "indexPct": 0.78
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 321971.0,
                  "currentPct": 0.792,
                  "indexPct": 0.8
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 4.31,
                  "currentPct": 0.791,
                  "indexPct": 0.8
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 1.96,
                  "currentPct": 0.832,
                  "indexPct": 0.78
                }
              }
            },
            "view": null
          },
          "EUR": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": -11860.6,
                  "currentPct": -0.04,
                  "indexPct": 0.18
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": -0.16,
                  "currentPct": -0.04,
                  "indexPct": 0.18
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": -0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.19
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.18
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.18
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.19
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": -11860.6,
                  "currentPct": -0.082,
                  "indexPct": 0.18
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": -0.16,
                  "currentPct": -0.082,
                  "indexPct": 0.18
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": -0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.19
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 43015.3,
                  "currentPct": 0.106,
                  "indexPct": 0.18
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.58,
                  "currentPct": 0.106,
                  "indexPct": 0.18
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.14,
                  "currentPct": 0.059,
                  "indexPct": 0.19
                }
              }
            },
            "view": null
          },
          "GBP": {
            "metricBreakdowns": {
              "All": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2834.1,
                  "currentPct": 0.01,
                  "indexPct": 0.02
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.04,
                  "currentPct": 0.01,
                  "indexPct": 0.02
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.02,
                  "currentPct": 0.01,
                  "indexPct": 0.02
                }
              },
              "ShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.02
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.02
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.0,
                  "currentPct": 0.0,
                  "indexPct": 0.02
                }
              },
              "NonShortCarry": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2834.1,
                  "currentPct": 0.02,
                  "indexPct": 0.02
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.04,
                  "currentPct": 0.02,
                  "indexPct": 0.02
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.02,
                  "currentPct": 0.016,
                  "indexPct": 0.02
                }
              },
              "NonHedging": {
                "Cs01": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 2834.1,
                  "currentPct": 0.007,
                  "indexPct": 0.02
                },
                "CreditDuration": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.04,
                  "currentPct": 0.007,
                  "indexPct": 0.02
                },
                "CreditLeverage": {
                  "targetLevel": null,
                  "targetPct": null,
                  "currentLevel": 0.02,
                  "currentPct": 0.008,
                  "indexPct": 0.02
                }
              }
            },
            "view": null
          }
        }
      }
    }
  }
}
