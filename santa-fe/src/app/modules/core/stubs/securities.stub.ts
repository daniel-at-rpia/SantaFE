import { BEFetchAllTradeDataReturn } from 'BEModels/backend-models.interface';

export const PortfolioList: BEFetchAllTradeDataReturn = {
  "numberOfSecurities": 434,
  "securityDtos": {
    "groupIdentifier": {
      "source": "Default",
      "date": "2020-03-19T00:00:00-04:00",
      "groupOptionValues": {},
      "groupFilters": {
        "PortfolioShortName": [
          "DOF"
        ]
      }
    },
    "securityDtos": {
      "146": {
        "securityIdentifier": "146",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "146",
          "ccy": "USD",
          "country": "US",
          "industry": "Pipeline",
          "name": "NGPLCO 7.768 12/15/2037 Bullet USD 144A SENIOR_SECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US62912XAC83",
          "obligorName": "NGPL PIPECO LLC",
          "obligorId": 949,
          "paymentRank": "SR UNSECURED",
          "sector": "Energy",
          "securitySubType": "Bond",
          "subIndustry": "Pipelines",
          "ticker": "NGPLCO",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "63089",
            "benchmarkName": "T 2.375 11/15/2049 USD",
            "underlyingSecurityId": -1,
            "zSpread": 781.984,
            "gSpread": 753.5823,
            "yieldWorst": 8.82447,
            "amtOutstanding": 500000000,
            "marketValue": 452986500,
            "workoutTerm": 17.7534,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 90.5973,
            "spread": 700.8143000000001,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 156.105,
              "gSpread": 142.2255,
              "yieldWorst": 1.41213,
              "ratingDouble": 0,
              "price": -12.8637,
              "spread": 140.1091
            },
            "Wow": {
              "zSpread": 245.029,
              "gSpread": 226.6269,
              "yieldWorst": 2.62018,
              "ratingDouble": 0,
              "price": -26.0697,
              "spread": 225.3915
            },
            "Mtd": {
              "zSpread": 401.53,
              "gSpread": 384.5179,
              "yieldWorst": 3.81766,
              "ratingDouble": 0,
              "price": -41.6517,
              "spread": 367.4918
            },
            "Mom": {
              "zSpread": 457.04,
              "gSpread": 439.8111,
              "yieldWorst": 3.96441,
              "ratingDouble": 0,
              "price": -43.7927,
              "spread": 416.0477
            },
            "Ytd": {
              "zSpread": 450.181,
              "gSpread": 429.7814,
              "yieldWorst": 3.50849,
              "ratingDouble": 0,
              "price": -37.5377,
              "spread": 408.1453
            },
            "Yoy": {
              "zSpread": 454.439,
              "gSpread": 432.7833,
              "yieldWorst": 2.80788,
              "ratingDouble": 0,
              "price": -28.9097,
              "spread": 400.5361
            }
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "AGB",
                "CIP",
                "DOF",
                "SOF",
                "STIP"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-03-20T10:47:30.272-04:00",
              "user": "IL",
              "value": 820,
              "price": 72,
              "spread": 73
            },
            "primaryPmName": "IL",
            "backupPmName": "DM",
            "researchName": "AG",
            "owners": [
              "IL",
              "DM",
              "AG"
            ],
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 24391000,
            "cs01Cad": 26034.508922806996,
            "cs01Local": 18259.57983083672,
            "hedgeFactor": 1
          },
          "securityType": "Bond",
          "maturityType": "Bullet"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Price",
            "totalActiveAxeBidQuantity": 0,
            "totalActiveAxeAskQuantity": 0,
            "totalActiveBidQuantity": 0,
            "totalActiveAskQuantity": 5000000,
            "axeSkew": null,
            "totalSkew": 1,
            "bidQuoteType": "Run",
            "bidDealer": "BARC",
            "bidQuoteValue": 81.96900177001953,
            "bidTime": "2020-03-20T14:09:48-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askQuoteValue": 83.41000366210938,
            "askTime": "2020-03-20T14:09:48-04:00",
            "askIsOld": false,
            "bidAxeDealer": "SUN",
            "bidAxeQuoteValue": 104.73799896240234,
            "bidAxeTime": "2020-03-20T07:52:51",
            "bidAxeIsOld": true,
            "askAxeDealer": "JPM",
            "askAxeQuoteValue": 98.69539642333984,
            "askAxeTime": "2020-03-20T08:03:52",
            "askAxeIsOld": true,
            "globalIdentifier": "US62912XAC83"
          },
          "bestSpreadQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Spread",
            "totalActiveAxeBidQuantity": 0,
            "totalActiveAxeAskQuantity": 0,
            "totalActiveBidQuantity": 0,
            "totalActiveAskQuantity": 5000000,
            "axeSkew": null,
            "totalSkew": 1,
            "bidQuoteType": "Run",
            "bidDealer": "BARC",
            "bidQuoteValue": 840,
            "bidTime": "2020-03-20T14:09:48-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askQuoteValue": 820,
            "askTime": "2020-03-20T14:09:48-04:00",
            "askIsOld": false,
            "bidAxeDealer": "SUN",
            "bidAxeQuoteValue": 565,
            "bidAxeTime": "2020-03-20T07:52:51",
            "bidAxeIsOld": true,
            "askAxeDealer": "JPM",
            "askAxeQuoteValue": 635,
            "askAxeTime": "2020-03-20T08:03:52",
            "askAxeIsOld": true,
            "globalIdentifier": "US62912XAC83"
          },
          "bestYieldQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Yield",
            "totalActiveAxeBidQuantity": 0,
            "totalActiveAxeAskQuantity": 0,
            "totalActiveBidQuantity": 0,
            "totalActiveAskQuantity": 5000000,
            "axeSkew": null,
            "totalSkew": 1,
            "bidQuoteType": "Run",
            "bidDealer": "BARC",
            "bidQuoteValue": 9.949999809265137,
            "bidTime": "2020-03-20T14:09:48-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askQuoteValue": 9.75,
            "askTime": "2020-03-20T14:09:48-04:00",
            "askIsOld": false,
            "bidAxeDealer": "SUN",
            "bidAxeQuoteValue": 7.285999774932861,
            "bidAxeTime": "2020-03-20T07:52:51",
            "bidAxeIsOld": true,
            "askAxeDealer": "JPM",
            "askAxeQuoteValue": 7.904019832611084,
            "askAxeTime": "2020-03-20T08:03:52",
            "askAxeIsOld": true,
            "globalIdentifier": "US62912XAC83"
          }
        },
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "AGB",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 256000,
            "cs01Cad": 273.249734912,
            "cs01Local": 191.64660885958762
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "CIP",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 1458000,
            "cs01Cad": 1556.242630866,
            "cs01Local": 1091.48732702062
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 9157000,
            "cs01Cad": 9774.014931988999,
            "cs01Local": 6855.109364559545
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "SOF",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 8635000,
            "cs01Cad": 9216.841644395,
            "cs01Local": 6464.329951181792
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "STIP",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 4885000,
            "cs01Cad": 5214.159980645,
            "cs01Local": 3657.0065792151777
          }
        ]
      },
      "23856": {
        "securityIdentifier": "23856",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "23856",
          "ccy": "USD",
          "country": "US",
          "industry": "Commercial Finance",
          "name": "AYR 4.4 09/25/2023 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US00928QAR20",
          "obligorName": "AIRCASTLE LTD",
          "obligorId": 1684,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Finance-Leasing Compan",
          "ticker": "AYR",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "69150",
            "benchmarkName": "T 0.5 03/15/2023 USD",
            "underlyingSecurityId": -1,
            "zSpread": 596.588,
            "gSpread": 604.39,
            "yieldWorst": 6.61259,
            "amtOutstanding": 650000000,
            "marketValue": 605645950,
            "workoutTerm": 3.5205,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 93.1763,
            "spread": 606.7836,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 117.414,
              "gSpread": 122.1492,
              "yieldWorst": 1.12159,
              "ratingDouble": 0,
              "price": -3.3791,
              "spread": 122.6315
            },
            "Wow": {
              "zSpread": 398.766,
              "gSpread": 408.4625,
              "yieldWorst": 4.0832,
              "ratingDouble": 0,
              "price": -12.9537,
              "spread": 411.1479
            },
            "Mtd": {
              "zSpread": 453.845,
              "gSpread": 458.171,
              "yieldWorst": 4.25949,
              "ratingDouble": 0,
              "price": -13.6207,
              "spread": 461.9402
            },
            "Mom": {
              "zSpread": 504.9022,
              "gSpread": 511.0735,
              "yieldWorst": 4.29628,
              "ratingDouble": 0,
              "price": -13.8107,
              "spread": 514.5586
            },
            "Ytd": {
              "zSpread": 495.501,
              "gSpread": 498.8214,
              "yieldWorst": 3.92233,
              "ratingDouble": 0,
              "price": -12.7197,
              "spread": null
            },
            "Yoy": {
              "zSpread": 421.692,
              "gSpread": 423.14,
              "yieldWorst": 2.38476,
              "ratingDouble": null,
              "price": -7.5147,
              "spread": 426.5432
            }
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "AGB",
                "DOF"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-03-20T00:00:00-04:00",
              "user": null,
              "value": 650,
              "price": 72,
              "spread": 73
            },
            "primaryPmName": "SP",
            "backupPmName": "DA",
            "researchName": "LP",
            "owners": [
              "SP",
              "DA",
              "LP"
            ],
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "23856",
            "quantity": 15731000,
            "cs01Cad": 6559.686144626,
            "cs01Local": 4600.7056702384625,
            "hedgeFactor": 1
          },
          "securityType": "Bond",
          "maturityType": "Callable"
        },
        "bestQuotes": null,
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "AGB",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "23856",
            "quantity": 3000000,
            "cs01Cad": 1250.973138,
            "cs01Local": 877.3833202412682
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "23856",
            "quantity": 12731000,
            "cs01Cad": 5308.713006626,
            "cs01Local": 3723.3223499971946
          }
        ]
      },
      "67055": {
        "securityIdentifier": "67055",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "67055",
          "ccy": "USD",
          "country": "US",
          "industry": "Pipeline",
          "name": "KMI 2.9 03/01/2030 Callable USD 144A SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US880451AZ24",
          "obligorName": "KINDER MORGAN INC/DE",
          "obligorId": 443,
          "paymentRank": "SR UNSECURED",
          "sector": "Energy",
          "securitySubType": "Bond",
          "subIndustry": "Pipelines",
          "ticker": "KMI",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": true,
            "benchmarkSecurityIdentifier": "66248",
            "benchmarkName": "T 1.5 02/15/2030 USD",
            "underlyingSecurityId": -1,
            "zSpread": 471.868,
            "gSpread": 455.156,
            "yieldWorst": 5.69223,
            "amtOutstanding": 1000000000,
            "marketValue": 790233000,
            "workoutTerm": 9.9562,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 79.0233,
            "spread": 455.53060000000005,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 48.12,
              "gSpread": 39.1958,
              "yieldWorst": 0.34118,
              "ratingDouble": 0,
              "price": -2.257,
              "spread": 39.2952
            },
            "Wow": {
              "zSpread": 72.645,
              "gSpread": 54.2191,
              "yieldWorst": 0.87847,
              "ratingDouble": 0,
              "price": -5.9742,
              "spread": 54.3867
            },
            "Mtd": {
              "zSpread": 297.07,
              "gSpread": 287.343,
              "yieldWorst": 2.86461,
              "ratingDouble": 0,
              "price": -21.5907,
              "spread": null
            },
            "Mom": {
              "zSpread": null,
              "gSpread": null,
              "yieldWorst": null,
              "ratingDouble": 0,
              "price": null,
              "spread": null
            },
            "Ytd": null,
            "Yoy": null
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Portfolio Shorts"
              ]
            },
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-03-20T10:49:30.07-04:00",
              "user": "IL",
              "value": 490,
              "price": 72,
              "spread": 73
            },
            "primaryPmName": "IL",
            "backupPmName": "DM",
            "researchName": "AG",
            "owners": [
              "IL",
              "DM",
              "AG"
            ],
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "67055",
            "quantity": -10000000,
            "cs01Cad": -9404.50161,
            "cs01Local": -6595.9472646935055,
            "hedgeFactor": 1
          },
          "securityType": "Bond",
          "maturityType": "Callable"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Price",
            "totalActiveAxeBidQuantity": 8000,
            "totalActiveAxeAskQuantity": 0,
            "totalActiveBidQuantity": 8000,
            "totalActiveAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuoteType": "Run",
            "bidDealer": "SUN",
            "bidQuoteValue": 76.81999969482422,
            "bidTime": "2020-03-20T13:18:28-04:00",
            "bidIsOld": false,
            "askQuoteType": null,
            "askDealer": null,
            "askQuoteValue": null,
            "askTime": null,
            "askIsOld": false,
            "bidAxeDealer": "BARC",
            "bidAxeQuoteValue": 75.87999725341797,
            "bidAxeTime": "2020-03-20T14:09:48-04:00",
            "bidAxeIsOld": false,
            "askAxeDealer": null,
            "askAxeQuoteValue": null,
            "askAxeTime": null,
            "askAxeIsOld": false,
            "globalIdentifier": "US880451AZ24"
          },
          "bestSpreadQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Spread",
            "totalActiveAxeBidQuantity": 8000,
            "totalActiveAxeAskQuantity": 0,
            "totalActiveBidQuantity": 8000,
            "totalActiveAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuoteType": "Run",
            "bidDealer": "SUN",
            "bidQuoteValue": 510,
            "bidTime": "2020-03-20T13:18:28-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "SUN",
            "askQuoteValue": 500,
            "askTime": "2020-03-20T13:18:28-04:00",
            "askIsOld": false,
            "bidAxeDealer": "BARC",
            "bidAxeQuoteValue": 525,
            "bidAxeTime": "2020-03-20T14:09:48-04:00",
            "bidAxeIsOld": false,
            "askAxeDealer": null,
            "askAxeQuoteValue": null,
            "askAxeTime": null,
            "askAxeIsOld": false,
            "globalIdentifier": "US880451AZ24"
          },
          "bestYieldQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Yield",
            "totalActiveAxeBidQuantity": 8000,
            "totalActiveAxeAskQuantity": 0,
            "totalActiveBidQuantity": 8000,
            "totalActiveAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuoteType": "Run",
            "bidDealer": "SUN",
            "bidQuoteValue": 6.035130023956299,
            "bidTime": "2020-03-20T13:18:28-04:00",
            "bidIsOld": false,
            "askQuoteType": null,
            "askDealer": null,
            "askQuoteValue": null,
            "askTime": null,
            "askIsOld": false,
            "bidAxeDealer": "BARC",
            "bidAxeQuoteValue": 6.184999942779541,
            "bidAxeTime": "2020-03-20T14:09:48-04:00",
            "bidAxeIsOld": false,
            "askAxeDealer": null,
            "askAxeQuoteValue": null,
            "askAxeTime": null,
            "askAxeIsOld": false,
            "globalIdentifier": "US880451AZ24"
          }
        },
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "Portfolio Shorts"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "67055",
            "quantity": -6000000,
            "cs01Cad": -5642.700966,
            "cs01Local": -3957.5683588161037
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "SOF",
              "StrategyName": "Portfolio Shorts"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "67055",
            "quantity": -4000000,
            "cs01Cad": -3761.800644,
            "cs01Local": -2638.3789058774023
          }
        ]
      },
      "1233|4.8Y": {
        "securityIdentifier": "1233|4.8Y",
        "security": {
          "curveSubType": "XR14",
          "securityIdentifier": "1233|4.8Y",
          "ccy": "USD",
          "country": "CA",
          "industry": "Exploration & Production",
          "name": "OVV CDS USD SR 12/20/2024",
          "genericSeniority": "SR",
          "globalIdentifier": "OVV CDS USD SR 5Y",
          "obligorName": "OVINTIV INC",
          "obligorId": 7279,
          "paymentRank": "SR UNSECURED",
          "sector": "Energy",
          "securitySubType": null,
          "subIndustry": "Oil Comp-Explor&Prodtn",
          "ticker": "OVV",
          "metrics": {
            "isOnTheRun": false,
            "workoutTerm": 4.7589,
            "ratingDouble": 14.33,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "Xover",
            "price": 68.428,
            "spread": 1100,
            "isIndex": false
          },
          "deltaMetrics": {
            "Dod": {
              "ratingDouble": 0,
              "price": -0.02,
              "spread": 0
            },
            "Wow": null,
            "Mtd": null,
            "Mom": null,
            "Ytd": null,
            "Yoy": null
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "Portfolio Shorts",
                "STOV"
              ]
            },
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-03-20T00:00:00-04:00",
              "user": null,
              "value": 1500,
              "price": 72,
              "spread": 73
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "TW",
            "owners": [
              "DJ",
              "PM",
              "TW"
            ],
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "1233|4.8Y",
            "quantity": -8500000,
            "cs01Cad": -1844.9175,
            "cs01Local": -1293.9525178846964,
            "hedgeFactor": 1
          },
          "securityType": "Cds",
          "maturityType": "Bullet"
        },
        "bestQuotes": null,
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "Portfolio Shorts"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "1233|4.8Y",
            "quantity": -6500000,
            "cs01Cad": -1410.8075000000001,
            "cs01Local": -989.4848506101839
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "STOV"
            },
            "date": "2020-03-20T00:00:00-04:00",
            "securityIdentifier": "1233|4.8Y",
            "quantity": -2000000,
            "cs01Cad": -434.11,
            "cs01Local": -304.46766727451256
          }
        ]
      }
    }
  }
}
