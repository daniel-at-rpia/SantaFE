import {
  BEGetPortfolioStructureServerReturn,
  BEStructuringBreakdownMetricBlock
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

export const PortfolioStructureBreakdownRowEmptySample: BEStructuringBreakdownMetricBlock = {
  "metricBreakdowns": {
    "CreditLeverage": {
      "targetPct": null,
      "targetLevel": null,
      "currentLevel": null,
      "currentPct": null,
      "indexPct": null
    },
    "CreditDuration" : {
      "targetPct": null,
      "targetLevel": null,
      "currentLevel": null,
      "currentPct": null,
      "indexPct": null
    },
    "Cs01": {
      "targetPct": null,
      "targetLevel": null,
      "currentLevel": null,
      "currentPct": null,
      "indexPct": null
    }
  },
  "view": null
}