import { BEFetchAllTradeDataReturn } from 'BEModels/backend-models.interface';

export const PortfolioList: BEFetchAllTradeDataReturn = {
  "numberOfSecurities": 319,
  "securityDtos": {
    "groupIdentifier": {
      "source": "Default",
      "date": "2020-03-13T00:00:00-04:00",
      "groupOptionValues": {},
      "groupFilters": {
        "PortfolioShortName": [
          "SOF"
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
            "zSpread": 534.396,
            "gSpread": 524.3218,
            "yieldWorst": 6.3103,
            "amtOutstanding": 500000000,
            "marketValue": 577075000,
            "workoutTerm": 17.7699,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 115.415,
            "spread": 475.65229999999997,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -2.559,
              "gSpread": -2.6336,
              "yieldWorst": 0.10601,
              "ratingDouble": 0,
              "price": -1.252,
              "spread": 0.2295
            },
            "Wow": {
              "zSpread": 106.676,
              "gSpread": 103.0038,
              "yieldWorst": 1.19817,
              "ratingDouble": 0,
              "price": -15.333,
              "spread": 93.2445
            },
            "Mtd": {
              "zSpread": 153.942,
              "gSpread": 155.2574,
              "yieldWorst": 1.30349,
              "ratingDouble": 0,
              "price": -16.834,
              "spread": 142.3298
            },
            "Mom": {
              "zSpread": 206.551,
              "gSpread": 207.3356,
              "yieldWorst": 1.36024,
              "ratingDouble": 0,
              "price": -17.69,
              "spread": 188.1401
            },
            "Ytd": {
              "zSpread": 202.593,
              "gSpread": 200.5209,
              "yieldWorst": 0.99432,
              "ratingDouble": 0,
              "price": -12.72,
              "spread": 182.9833
            },
            "Yoy": {
              "zSpread": 202.926,
              "gSpread": 200.1578,
              "yieldWorst": 0.24859,
              "ratingDouble": 0,
              "price": -3.532,
              "spread": 170.3311
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
              "enteredTime": "2020-03-16T06:42:25.164-04:00",
              "user": "IL",
              "value": 740
            },
            "primaryPmName": "IL",
            "backupPmName": "DM",
            "researchName": "AG",
            "owners": [
              "IL",
              "DM",
              "AG"
            ],
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 24391000,
            "cs01Cad": 28236.507450938,
            "cs01Local": 20284.847306708336,
            "hedgeFactor": 1
          },
          "securityType": "Bond",
          "maturityType": "Bullet"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "BARC",
            "bidTime": "2020-03-16T11:03:34-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askTime": "2020-03-16T11:03:34-04:00",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 0,
            "bidQuoteValue": 92.23100280761719,
            "askQuantity": 0,
            "askQuoteValue": 93.94999694824219,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": "JPM",
            "askAxeQuantity": 2085000,
            "askAxeQuoteValue": 107.06199645996094,
            "askAxeTime": "2020-03-16T08:31:22",
            "askAxeIsOld": true,
            "globalIdentifier": "US62912XAC83"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "BARC",
            "bidTime": "2020-03-16T11:03:34-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askTime": "2020-03-16T11:03:34-04:00",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 0,
            "bidQuoteValue": 720,
            "askQuantity": 0,
            "askQuoteValue": 700,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": "JPM",
            "askAxeQuantity": 2085000,
            "askAxeQuoteValue": 568,
            "askAxeTime": "2020-03-16T08:31:22",
            "askAxeIsOld": true,
            "globalIdentifier": "US62912XAC83"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "BARC",
            "bidTime": "2020-03-16T11:03:34-04:00",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askTime": "2020-03-16T11:03:34-04:00",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 0,
            "bidQuoteValue": 8.628999710083008,
            "askQuantity": 0,
            "askQuoteValue": 8.428999900817871,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": "JPM",
            "askAxeQuantity": 2085000,
            "askAxeQuoteValue": 7.062049865722656,
            "askAxeTime": "2020-03-16T08:31:22",
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
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 256000,
            "cs01Cad": 296.36119500800004,
            "cs01Local": 212.90315733333338
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "CIP",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 1458000,
            "cs01Cad": 1687.869618444,
            "cs01Local": 1212.5500132500001
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 9157000,
            "cs01Cad": 10600.701026126,
            "cs01Local": 7615.446139458334
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "SOF",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 8635000,
            "cs01Cad": 9996.40202693,
            "cs01Local": 7181.323295208334
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "STIP",
              "StrategyName": "LTOV - Spread"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "146",
            "quantity": 4885000,
            "cs01Cad": 5655.17358443,
            "cs01Local": 4062.6247014583337
          }
        ]
      },
      "21282": {
        "securityIdentifier": "21282",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "21282",
          "ccy": "USD",
          "country": "US",
          "industry": "Transportation & Logistics",
          "name": "NAV 6.625 11/01/2025 Callable USD 144A SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US63934EAT55",
          "obligorName": "NAVISTAR INTERNATIONAL CORP",
          "obligorId": 550,
          "paymentRank": "SR UNSECURED",
          "sector": "Industrials",
          "securitySubType": "Bond",
          "subIndustry": "Auto-Med&Heavy Duty Trks",
          "ticker": "NAV",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "67120",
            "benchmarkName": "T 1.125 02/28/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 652.152,
            "gSpread": 653.5047,
            "yieldWorst": 7.31809,
            "amtOutstanding": 1100000000,
            "marketValue": 1065247700,
            "workoutTerm": 5.6411,
            "ratingDouble": 8,
            "isRated": true,
            "rating": "B-",
            "ratingNoNotch": "B",
            "ratingBucket": "HY",
            "price": 96.8407,
            "spread": 1361.2365,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 12.969,
              "gSpread": 9.5974,
              "yieldWorst": 0.23232,
              "ratingDouble": 0,
              "price": -1.0411,
              "spread": 172.6811
            },
            "Wow": {
              "zSpread": 164.144,
              "gSpread": 160.3494,
              "yieldWorst": 1.8251,
              "ratingDouble": 0,
              "price": -5.8993,
              "spread": 815.7362
            },
            "Mtd": {
              "zSpread": 232.912,
              "gSpread": null,
              "yieldWorst": 2.19288,
              "ratingDouble": 0,
              "price": -6.8373,
              "spread": 903.2664
            },
            "Mom": {
              "zSpread": 412.411,
              "gSpread": 400.9298,
              "yieldWorst": 3.2807,
              "ratingDouble": 0,
              "price": -8.1483,
              "spread": 1106.687
            },
            "Ytd": {
              "zSpread": 243.283,
              "gSpread": 237.9483,
              "yieldWorst": 1.55839,
              "ratingDouble": 0,
              "price": -5.3773,
              "spread": null
            },
            "Yoy": {
              "zSpread": 301.684,
              "gSpread": 295.2547,
              "yieldWorst": 1.31946,
              "ratingDouble": null,
              "price": -5.1653,
              "spread": null
            }
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "AGB",
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "LTOV - Special Situations"
              ]
            },
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-03-16T07:47:20.436-04:00",
              "user": "PM",
              "value": 1463.0743000000002
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "TW",
            "owners": [
              "DJ",
              "PM",
              "TW"
            ],
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "21282",
            "quantity": 46554000,
            "cs01Cad": 21503.966655366,
            "cs01Local": 15448.251907590518,
            "hedgeFactor": 0.375
          },
          "securityType": "Bond",
          "maturityType": "Callable"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": null,
            "bidDealer": null,
            "bidTime": null,
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "TFIN",
            "askTime": "2020-03-16T09:23:52",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": null,
            "askQuantity": 0,
            "askQuoteValue": 93.52200317382812,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": "TFIN",
            "askAxeQuantity": 0,
            "askAxeQuoteValue": 93.52200317382812,
            "askAxeTime": "2020-03-16T09:23:52",
            "askAxeIsOld": false,
            "globalIdentifier": "US63934EAT55"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": null,
            "bidDealer": null,
            "bidTime": null,
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "TFIN",
            "askTime": "2020-03-16T09:23:52",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": null,
            "askQuantity": 0,
            "askQuoteValue": 756.5189819335938,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": "TFIN",
            "askAxeQuantity": 0,
            "askAxeQuoteValue": 756.5189819335938,
            "askAxeTime": "2020-03-16T09:23:52",
            "askAxeIsOld": false,
            "globalIdentifier": "US63934EAT55"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "SEAP",
            "bidTime": "2020-03-16T07:15:08",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askTime": "2020-03-16T09:09:51",
            "askIsOld": true,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 0,
            "bidQuoteValue": 7.059999942779541,
            "askQuantity": 0,
            "askQuoteValue": 7.510000228881836,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": "BAML",
            "askAxeQuantity": 1000000,
            "askAxeQuoteValue": 7.059999942779541,
            "askAxeTime": "2020-03-16T07:05:41",
            "askAxeIsOld": true,
            "globalIdentifier": "US63934EAT55"
          }
        },
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "AGB",
              "StrategyName": "LTOV - Special Situations"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "21282",
            "quantity": 1149000,
            "cs01Cad": 530.739736371,
            "cs01Local": 381.27854624353455
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "LTOV - Special Situations"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "21282",
            "quantity": 19195000,
            "cs01Cad": 8866.448424405,
            "cs01Local": 6369.575017532328
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "SOF",
              "StrategyName": "LTOV - Special Situations"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "21282",
            "quantity": 26210000,
            "cs01Cad": 12106.77849459,
            "cs01Local": 8697.398343814655
          }
        ]
      },
      "65436": {
        "securityIdentifier": "65436",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "65436",
          "ccy": "USD",
          "country": "US",
          "industry": "Retail - Consumer Discretionary",
          "name": "QVCN 4.75 02/15/2027 Bullet USD SENIOR_SECURED",
          "genericSeniority": "SECURED",
          "globalIdentifier": "US747262AY90",
          "obligorName": "QVC INC",
          "obligorId": 4559,
          "paymentRank": "SECURED",
          "sector": "Consumers",
          "securitySubType": "Bond",
          "subIndustry": "Retail-Mail Order",
          "ticker": "QVCN",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "67196",
            "benchmarkName": "T 1.125 02/28/2027 USD",
            "underlyingSecurityId": -1,
            "zSpread": 504.244,
            "gSpread": 499.1328,
            "yieldWorst": 5.89343,
            "amtOutstanding": 575000000,
            "marketValue": 538066600,
            "workoutTerm": 6.9315,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 93.5768,
            "spread": 499.09830000000005,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -9.139,
              "gSpread": -14.2577,
              "yieldWorst": 0.01263,
              "ratingDouble": 0,
              "price": -0.0662,
              "spread": -14.2836
            },
            "Wow": {
              "zSpread": 80.343,
              "gSpread": 75.2842,
              "yieldWorst": 0.94492,
              "ratingDouble": 0,
              "price": -5.264,
              "spread": 75.3241
            },
            "Mtd": {
              "zSpread": 103.103,
              "gSpread": 104.5621,
              "yieldWorst": 0.88513,
              "ratingDouble": 0,
              "price": -4.917,
              "spread": 103.8343
            },
            "Mom": {
              "zSpread": 197.597,
              "gSpread": 199.2053,
              "yieldWorst": 1.35446,
              "ratingDouble": 0,
              "price": -7.6382,
              "spread": 198.3669
            },
            "Ytd": null,
            "Yoy": null
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "AGB",
                "BBB",
                "CIP",
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "STOV"
              ]
            },
            "mark": {
              "driver": "Price",
              "enteredTime": "2020-03-16T00:00:00-04:00",
              "user": null,
              "value": 94.5
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "PD",
            "owners": [
              "DJ",
              "PM",
              "PD"
            ],
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "65436",
            "quantity": 2500000,
            "cs01Cad": 1897.1000749999998,
            "cs01Local": 1362.8592492816092,
            "hedgeFactor": 1
          },
          "securityType": "Bond",
          "maturityType": "Callable"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-03-16T11:05:11-04:00",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "TFIN",
            "askTime": "2020-03-16T11:02:14-04:00",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 3000000,
            "totalAxeAskQuantity": 200000,
            "totalBidQuantity": 3000000,
            "totalAskQuantity": 200000,
            "axeSkew": 0.0625,
            "totalSkew": 0.0625,
            "bidQuantity": 3000000,
            "bidQuoteValue": 88.75,
            "askQuantity": 0,
            "askQuoteValue": 92.5,
            "bidAxeDealer": "CG",
            "bidAxeQuantity": 3000000,
            "bidAxeQuoteValue": 88.75,
            "bidAxeTime": "2020-03-16T11:05:11-04:00",
            "bidAxeIsOld": false,
            "askAxeDealer": "TFIN",
            "askAxeQuantity": 0,
            "askAxeQuoteValue": 92.5,
            "askAxeTime": "2020-03-16T11:02:14-04:00",
            "askAxeIsOld": false,
            "globalIdentifier": "US747262AY90"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-03-16T11:05:11-04:00",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "TFIN",
            "askTime": "2020-03-16T11:02:14-04:00",
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 3000000,
            "totalAxeAskQuantity": 200000,
            "totalBidQuantity": 3000000,
            "totalAskQuantity": 200000,
            "axeSkew": 0.0625,
            "totalSkew": 0.0625,
            "bidQuantity": 3000000,
            "bidQuoteValue": 605.510009765625,
            "askQuantity": 0,
            "askQuoteValue": 533.72802734375,
            "bidAxeDealer": "CG",
            "bidAxeQuantity": 3000000,
            "bidAxeQuoteValue": 605.510009765625,
            "bidAxeTime": "2020-03-16T11:05:11-04:00",
            "bidAxeIsOld": false,
            "askAxeDealer": "TFIN",
            "askAxeQuantity": 0,
            "askAxeQuoteValue": 533.72802734375,
            "askAxeTime": "2020-03-16T11:02:14-04:00",
            "askAxeIsOld": false,
            "globalIdentifier": "US747262AY90"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-03-16T11:05:11-04:00",
            "bidIsOld": false,
            "askQuoteType": null,
            "askDealer": null,
            "askTime": null,
            "askIsOld": false,
            "isAxeValid": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 3000000,
            "totalAxeAskQuantity": 200000,
            "totalBidQuantity": 3000000,
            "totalAskQuantity": 200000,
            "axeSkew": 0.0625,
            "totalSkew": 0.0625,
            "bidQuantity": 3000000,
            "bidQuoteValue": 6.816539764404297,
            "askQuantity": null,
            "askQuoteValue": null,
            "bidAxeDealer": "CG",
            "bidAxeQuantity": 3000000,
            "bidAxeQuoteValue": 6.816539764404297,
            "bidAxeTime": "2020-03-16T11:05:11-04:00",
            "bidAxeIsOld": false,
            "askAxeDealer": null,
            "askAxeQuantity": null,
            "askAxeQuoteValue": null,
            "askAxeTime": null,
            "askAxeIsOld": false,
            "globalIdentifier": "US747262AY90"
          }
        },
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "AGB",
              "StrategyName": "STOV"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "65436",
            "quantity": 30000,
            "cs01Cad": 22.7652009,
            "cs01Local": 16.35431099137931
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "BBB",
              "StrategyName": "STOV"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "65436",
            "quantity": 10000,
            "cs01Cad": 7.5884003,
            "cs01Local": 5.451436997126438
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "CIP",
              "StrategyName": "STOV"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "65436",
            "quantity": 47000,
            "cs01Cad": 35.66548141,
            "cs01Local": 25.621753886494254
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "DOF",
              "StrategyName": "STOV"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "65436",
            "quantity": 638000,
            "cs01Cad": 484.13993914,
            "cs01Local": 347.8016804166667
          },
          {
            "partitionOptionValue": {
              "PortfolioShortName": "SOF",
              "StrategyName": "STOV"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "65436",
            "quantity": 1775000,
            "cs01Cad": 1346.9410532499999,
            "cs01Local": 967.6300669899425
          }
        ]
      },
      "413|2Y": {
        "securityIdentifier": "413|2Y",
        "security": {
          "curveSubType": "XR14",
          "securityIdentifier": "413|2Y",
          "ccy": "USD",
          "country": "US",
          "industry": "Wireline Telecommunications Services",
          "name": "CENTLINK CDS USD SR 2Y",
          "genericSeniority": "SR",
          "globalIdentifier": "CENTLINK CDS USD SR 2Y",
          "obligorName": "CENTURYLINK INC",
          "obligorId": 184,
          "paymentRank": "SR UNSECURED",
          "sector": "Communications",
          "securitySubType": null,
          "subIndustry": "Telephone-Integrated",
          "ticker": "CENTLINK",
          "metrics": {
            "isOnTheRun": true,
            "workoutTerm": 1.7644,
            "ratingDouble": 10,
            "isRated": true,
            "rating": "B+",
            "ratingNoNotch": "B",
            "ratingBucket": "HY",
            "price": null,
            "spread": 121.154,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "ratingDouble": 0,
              "price": null,
              "spread": 8.077
            },
            "Wow": {
              "ratingDouble": 0,
              "price": null,
              "spread": 53.7577
            },
            "Mtd": {
              "ratingDouble": 0,
              "price": null,
              "spread": 53.7577
            },
            "Mom": {
              "ratingDouble": 0,
              "price": null,
              "spread": 68.7346
            },
            "Ytd": {
              "ratingDouble": 0,
              "price": null,
              "spread": 56.154
            },
            "Yoy": {
              "ratingDouble": null,
              "price": null,
              "spread": 5.281
            }
          },
          "firmPosition": {
            "partitionOptionValues": {
              "PortfolioShortName": [
                "SOF"
              ],
              "StrategyName": [
                "Basis"
              ]
            },
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-03-16T00:00:00-04:00",
              "user": null,
              "value": 155
            },
            "primaryPmName": "PM",
            "backupPmName": "DJ",
            "researchName": "LC",
            "owners": [
              "PM",
              "DJ",
              "LC"
            ],
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "413|2Y",
            "quantity": -2000000,
            "cs01Cad": -479.37,
            "cs01Local": -344.375,
            "hedgeFactor": 1
          },
          "securityType": "Cds",
          "maturityType": "Bullet"
        },
        "bestQuotes": {
          "bestPriceQuote": null,
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-03-16T07:14:32",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askTime": "2020-03-16T07:14:32",
            "askIsOld": true,
            "isAxeValid": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalBidQuantity": 0,
            "totalAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 0,
            "bidQuoteValue": 137,
            "askQuantity": 0,
            "askQuoteValue": 237,
            "bidAxeDealer": null,
            "bidAxeQuantity": null,
            "bidAxeQuoteValue": null,
            "bidAxeTime": null,
            "bidAxeIsOld": false,
            "askAxeDealer": null,
            "askAxeQuantity": null,
            "askAxeQuoteValue": null,
            "askAxeTime": null,
            "askAxeIsOld": false,
            "globalIdentifier": "CENTLINK CDS USD SR 2Y D14"
          },
          "bestYieldQuote": null
        },
        "positions": [
          {
            "partitionOptionValue": {
              "PortfolioShortName": "SOF",
              "StrategyName": "Basis"
            },
            "date": "2020-03-16T00:00:00-04:00",
            "securityIdentifier": "413|2Y",
            "quantity": -2000000,
            "cs01Cad": -479.37,
            "cs01Local": -344.375
          }
        ]
      }
    }
  }
}