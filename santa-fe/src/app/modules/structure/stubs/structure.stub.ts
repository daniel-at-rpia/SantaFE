import { BEPortfolioStructuringDTO } from 'BEModels/backend-models.interface';
import {PortfolioShortNames} from 'Core/constants/structureConstants.constants';

export const PortfolioStructuringSample: BEPortfolioStructuringDTO = {
  "date":"2020-08-31T00:00:00-04:00",
  "inDb":true,
  "portfolioId":15,
  "portfolioShortName": PortfolioShortNames.SOF,
  "portfolioNav":736829937.9316701,
  "currentTotals":{
    "CreditLeverage":2.0067948600267513,
    "Cs01":311837.65210445516
  },
  "indexId":-1,
  "indexShortName":null,
  "indexNav":0.0,
  "indexTotals":{
    "CreditLeverage":null,
    "Cs01":null
  },
  "target":{
    "portfolioTargetId":"75048327-b6a2-4182-88e2-b10eb8384c49",
    "date":"2020-08-31T00:00:00",
    "portfolioId":15,
    "target":{
      "Cs01":300000.0,
      "CreditLeverage":1.75
    }
  },
  'breakdowns': {
    "Ccy":{
      "portfolioBreakdownId":"f2fabf03-f160-4782-b9c1-c38abf8bcedc",
      "date":"2020-08-31T00:00:00",
      "portfolioId":15,
      "indexId":-1,
      "groupOption": 'Ccy',
      "breakdown":{
        "CAD":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":30000.0,
              "targetPct":0.1,
              "currentLevel":40904.435163882,
              "currentPct":0.13117221377160826,
              "indexLevel":null,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":0.2,
              "targetPct":0.1142857142857143,
              "currentLevel":0.18782971120734382,
              "currentPct":0.09359686679925021,
              "indexLevel":null,
              "indexPct":null
            }
          },
          "view":null,
        },
        "EUR":{
          "metricBreakdowns" :{
            "Cs01":{
              "targetLevel":85000.0,
              "targetPct":0.2833333333333333,
              "currentLevel":81253.84161694397,
              "currentPct":0.26056456322255356,
              "indexLevel":null,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":0.35000000000000003,
              "targetPct":0.2,
              "currentLevel":0.30903883237036706,
              "currentPct":0.15399622478913835,
              "indexLevel":null,
              "indexPct":null
            }
          },
          "view": null
        },
        "GBP":{
          "metricBreakdowns" : {
            "Cs01":{
              "targetLevel":0.0,
              "targetPct":0.0,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":null,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":0.0,
              "targetPct":0.0,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":null,
              "indexPct":null
            }
          },
          "view": null
        },
        "USD":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":211000.0,
              "targetPct":0.7033333333333334,
              "currentLevel":189679.37532362936,
              "currentPct":0.6082632230058387,
              "indexLevel":null,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":1.33,
              "targetPct":0.76,
              "currentLevel":1.5099263164490406,
              "currentPct":0.7524069084116115,
              "indexLevel":null,
              "indexPct":null
            }
          },
          "view": null
        }
      }
    },
    "BicsLevel1":{
      "portfolioBreakdownId":"886af56a-c0ef-4a70-a7a4-0e5feee4e0f3",
      "date":"2020-08-31T00:00:00",
      "portfolioId":15,
      "indexId":-1,
      "groupOption": 'BicsLevel1',
      "breakdown":{
        
      }
    },
    "BicsLevel2":{
      "portfolioBreakdownId":"e2ef7671-e758-4f85-a95e-cc93de6cbed9",
      "date":"2020-08-31T00:00:00",
      "portfolioId":15,
      "indexId":-1,
      "groupOption": 'BicsLevel2',
      "breakdown":{
        
      }
    },
    "BicsLevel3":{
      "portfolioBreakdownId":"9a5d94fe-150e-4508-87dd-d1a42696ace8",
      "date":"2020-08-31T00:00:00",
      "portfolioId":15,
      "indexId":-1,
      "groupOption": 'BicsLevel3',
      "breakdown":{
        
      }
    },
    "RatingNoNotch":{
      "portfolioBreakdownId":"bdee3b54-569a-4986-980e-097bdd25d775",
      "date":"2020-08-31T00:00:00",
      "portfolioId":15,
      "indexId":-1,
      "groupOption": 'RatingNoNotch',
      "breakdown":{
        "A":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":8638.400372886,
              "currentPct":0.02770159509151392,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.04279461842968872,
              "currentPct":0.0213248594971577,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "B":{
          "metricBreakdowns" : {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":38425.38154028537,
              "currentPct":0.12322239242429313,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.20134647176807569,
              "currentPct":0.10033236370028956,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "D":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.9812618240000001,
              "currentPct":3.1467073247181524E-06,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":6.603095978506766E-05,
              "currentPct":3.290369190211472E-05,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "AA":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":-2877.36,
              "currentPct":-0.009227108979887332,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":-0.009150604888641565,
              "currentPct":-0.0045598108062323735,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "BB":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":110197.013510963,
              "currentPct":0.35337943563675467,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.577637960695684,
              "currentPct":0.28784106048985186,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "NR":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":null,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":null,
              "indexPct":null
            }
          },
          "view": null
        },
        "AAA":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "BBB":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":151442.73544492494,
              "currentPct":0.48564608674707666,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.6352991240060555,
              "currentPct":0.31657402391273154,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "CCC":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":6010.499973572,
              "currentPct":0.019274452372924755,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.5588012590561043,
              "currentPct":0.2784545995142998,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        }
      }
    },
    "Tenor":{
      "portfolioBreakdownId":"9f8bd973-288c-4743-a26c-31a0ee7e40d4",
      "date":"2020-08-31T00:00:00",
      "portfolioId":15,
      "indexId":-1,
      "groupOption": 'Tenor',
      "breakdown":{
        "2Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":85114.44546042301,
              "currentPct":0.272944735460978,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.762997397823872,
              "currentPct":0.38020697233283773,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "3Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":103013.4393964336,
              "currentPct":0.3303431728055968,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.4655051596600113,
              "currentPct":0.23196449668692393,
              "indexLevel":0.0,
              "indexPct":null
            },
          },
          "view": null
        },
        "5Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":69163.35648253582,
              "currentPct":0.22179283359717067,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.24167782408344604,
              "currentPct":0.12042976035937444,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "7Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":44874.968165486,
              "currentPct":0.1439049064878618,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.09907837674761077,
              "currentPct":0.04937145231988985,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "10Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":21512.021907665996,
              "currentPct":0.06898468405752423,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.03649658126794331,
              "currentPct":0.018186503261951145,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "20Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":15239.141575000001,
              "currentPct":0.048868831175958825,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.020216093795587163,
              "currentPct":0.010073821793283682,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        },
        "30Y":{
          "metricBreakdowns": {
            "Cs01":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":0.0,
              "indexPct":null
            },
            "CreditLeverage":{
              "targetLevel":null,
              "targetPct":null,
              "currentLevel":0.0,
              "currentPct":0.0,
              "indexLevel":0.0,
              "indexPct":null
            }
          },
          "view": null
        }
      }
    }
  }
}