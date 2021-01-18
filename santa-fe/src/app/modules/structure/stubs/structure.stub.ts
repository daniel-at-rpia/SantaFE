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
    }
  },
  "overrides": [],
  "isIndexValid": true
}