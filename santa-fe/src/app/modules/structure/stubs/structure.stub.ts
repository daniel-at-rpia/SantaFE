import { BEStructuringFundBlock } from 'BEModels/backend-models.interface';
import { PortfolioShortNames } from 'Core/constants/structureConstants.constants';

// always remove bics lv 2+ to save space

export const PortfolioStructuringSample: BEStructuringFundBlock = 
{
  "date": "2020-12-07T00:00:00-05:00",
  "portfolioId": 5,
  "portfolioShortName": PortfolioShortNames.FIP,
  "portfolioNav": 837001170.5624204,
  "currentTotals": {
    "Cs01": 140816.58623445002,
    "CreditDuration": 1.6823941373920512,
    "CreditLeverage": 0.7849391613657498
  },
  "indexId": 25,
  "indexShortName": "DEX Short Universe",
  "indexNav": 810244059723.7443,
  "indexTotals": {
    "Cs01": 160144783.74157196,
    "CreditDuration": 1.9765005595495997,
    "CreditLeverage": 0.3379507054299231
  },
  "target": {
    "portfolioTargetId": "afa4bc54-f3f2-44b7-81cf-2ba180526592",
    "date": "2020-12-07T00:00:00",
    "portfolioId": 5,
    "target": {
      "Cs01": 167382.31477197527,
      "CreditDuration": 2.0,
      "CreditLeverage": null
    }
  },
  "breakdowns": {
    "Ccy": {
      "portfolioBreakdownId": "f1836cbc-4759-4990-a9cd-9494f467fa10",
      "date": "2020-12-07T00:00:00-05:00",
      "portfolioId": 5,
      "indexId": 25,
      "groupOption": "Ccy",
      "breakdown": {
        "CAD": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 95894.783147659,
              "currentPct": 0.6809906823618116,
              "indexLevel": 160144783.74157196,
              "indexPct": 1.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 1.1456947316241242,
              "currentPct": 0.6809906823618115,
              "indexLevel": 1.9765005595495997,
              "indexPct": 1.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5002538288817171,
              "currentPct": 0.637315416918814,
              "indexLevel": 0.3379507054299231,
              "indexPct": 1.0
            }
          },
          "view": "Neutral"
        },
        "USD": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 44921.803086791,
              "currentPct": 0.3190093176381883,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5366994057679265,
              "currentPct": 0.3190093176381882,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.2846853324840323,
              "currentPct": 0.36268458308118545,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "EUR": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "GBP": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        }
      }
    },
    "RatingNoNotch": {
      "portfolioBreakdownId": "aa8390a0-63a7-4d79-bf1b-e4e3b1400b20",
      "date": "2020-12-07T00:00:00-05:00",
      "portfolioId": 5,
      "indexId": 25,
      "groupOption": "RatingNoNotch",
      "breakdown": {
        "AAA": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 44365679.23511027,
              "indexPct": 0.27703480687016213
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.5475594507935906,
              "indexPct": 0.2770348068701621
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.03026257900948661,
              "indexPct": 0.08954731717748052
            }
          },
          "view": null
        },
        "NR": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "AA": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 7179.737777946,
              "currentPct": 0.050986449607521564,
              "indexLevel": 66622010.3079309,
              "indexPct": 0.4160111166370541
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0857793039061295,
              "currentPct": 0.05098644960752155,
              "indexLevel": 0.8222462048119911,
              "indexPct": 0.41601111663705403
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.01934610063628628,
              "currentPct": 0.02464662433534996,
              "indexLevel": 0.10113945392312847,
              "indexPct": 0.2992728001394883
            }
          },
          "view": null
        },
        "BB": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 145224.33185,
              "indexPct": 0.0009068314837175756
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0017923529349849817,
              "indexPct": 0.0009068314837175755
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.000418309413605032,
              "indexPct": 0.001237782335956011
            }
          },
          "view": null
        },
        "A": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 46995.412957342,
              "currentPct": 0.33373492579274605,
              "indexLevel": 25040407.022233497,
              "indexPct": 0.15636105302462788
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5614736825966871,
              "currentPct": 0.33373492579274594,
              "indexLevel": 0.3090477087949416,
              "indexPct": 0.15636105302462786
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.235266201966623,
              "currentPct": 0.2997253972617102,
              "indexLevel": 0.10070917857278561,
              "indexPct": 0.2979996104599595
            }
          },
          "view": null
        },
        "BBB": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 86641.43549916199,
              "currentPct": 0.6152786245997321,
              "indexLevel": 23971462.844447363,
              "indexPct": 0.14968619198443872
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 1.035141150889234,
              "currentPct": 0.6152786245997321,
              "indexLevel": 0.2958548422140919,
              "indexPct": 0.14968619198443872
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.5303268587628402,
              "currentPct": 0.6756279784029395,
              "indexLevel": 0.1054211845109174,
              "indexPct": 0.3119424898871157
            }
          },
          "view": null
        },
        "CCC": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "B": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "D": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "CC": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        },
        "C": {
          "metricBreakdowns": {
            "Cs01": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditDuration": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            },
            "CreditLeverage": {
              "targetLevel": null,
              "targetPct": null,
              "currentLevel": 0.0,
              "currentPct": 0.0,
              "indexLevel": 0.0,
              "indexPct": 0.0
            }
          },
          "view": null
        }
      }
    }
  },
  "overrides": [],
  "isIndexValid": true
}