import { BEFetchAllTradeDataReturn } from 'BEModels/backend-models.interface';

export const PortfolioList: BEFetchAllTradeDataReturn = {
  numberOfSecurities: 594,
  securityDtos: {
    groupIdentifier: {
      "source": "Default",
      "date": "2020-02-24T00:00:00-05:00",
      "groupOptionValues": {},
      "filters": {
        "PortfolioShortName": [
          "DOF",
          "SOF",
          "AGB"
        ]
      },
      "singleSecurityTenorOptions": [
        "2Y",
        "3Y",
        "5Y",
        "7Y",
        "10Y",
        "20Y",
        "30Y"
      ],
      "groupParameter": {
        "weightField": "AmtOutstanding",
        "metricContextField": null,
        "metricContextMin": null,
        "metricContextMax": null
      }
    },
    securityDtos: {
      "128": {
        "securityIdentifier": "128",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "128",
          "ccy": "CAD",
          "country": "CA",
          "industry": "Integrated Oils",
          "name": "HSECN 3.6 03/10/2027 Callable CAD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "CA448055AN34",
          "obligorName": "HUSKY ENERGY INC",
          "obligorId": 393,
          "paymentRank": "SR UNSECURED",
          "sector": "Energy",
          "securitySubType": "Bond",
          "subIndustry": "Oil Comp-Integrated",
          "ticker": "HSECN",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "47",
            "benchmarkName": "CAN 1.0 06/01/2027 CAD",
            "underlyingSecurityId": -1,
            "zSpread": 0,
            "gSpread": 152.31,
            "yieldWorst": 2.897155,
            "amtOutstanding": 750000000,
            "marketValue": 795079200,
            "workoutTerm": 7.0712,
            "ratingDouble": 15.67,
            "isRated": true,
            "rating": "BBB+",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 104.462067,
            "spread": 152.1424,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0,
              "gSpread": 0.28,
              "yieldWorst": -0.021239,
              "ratingDouble": 0,
              "price": 0.136747,
              "spread": 0.3481
            },
            "Wow": {
              "zSpread": 0,
              "gSpread": -0.48,
              "yieldWorst": 0.029035,
              "ratingDouble": 0,
              "price": -0.200366,
              "spread": -0.5839
            },
            "Mtd": {
              "zSpread": 0,
              "gSpread": 0.13,
              "yieldWorst": 0.089577,
              "ratingDouble": 0,
              "price": -0.609445,
              "spread": 0.2409
            },
            "Mom": {
              "zSpread": 0,
              "gSpread": 0.85,
              "yieldWorst": -0.212865,
              "ratingDouble": 0,
              "price": 1.343777,
              "spread": 0.5993
            },
            "Ytd": {
              "zSpread": 0,
              "gSpread": -1.04,
              "yieldWorst": -0.348322,
              "ratingDouble": 0,
              "price": 2.207435,
              "spread": -0.6365
            },
            "Yoy": {
              "zSpread": 0,
              "gSpread": -17.68,
              "yieldWorst": -0.657537,
              "ratingDouble": 0,
              "price": 4.148165,
              "spread": -19.1033
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 155
            },
            "primaryPmName": "ST",
            "backupPmName": "IL",
            "researchName": "TW",
            "owners": [
              "ST",
              "IL",
              "TW"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB"
              ],
              "AttributionOwner": [
                "CAD Term Risk"
              ],
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "Portfolio Shorts"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "128",
            "quantity": -9000000,
            "cs01Cad": -5737.463658,
            "cs01Local": -5737.463658
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "BMO",
            "bidTime": "2020-02-18T12:06:18",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "RBC",
            "askTime": "2020-02-18T13:30:20",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 5000000,
            "totalRunBidQuantity": 2000,
            "totalRunAskQuantity": 2000,
            "axeSkew": 1,
            "totalSkew": 0.9996003197442046,
            "bidQuantity": 2000,
            "bidQuoteValue": 104.20899963378906,
            "askQuantity": 5000000,
            "askQuoteValue": 104.70099639892578,
            "globalIdentifier": "CA448055AN34"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "BMO",
            "bidTime": "2020-02-18T12:06:18",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "MULT",
            "askTime": "2020-02-18T13:30:20",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 5000000,
            "totalRunBidQuantity": 2000,
            "totalRunAskQuantity": 2000,
            "axeSkew": 1,
            "totalSkew": 0.9996003197442046,
            "bidQuantity": 2000,
            "bidQuoteValue": 155,
            "askQuantity": 5002000,
            "askQuoteValue": 150,
            "globalIdentifier": "CA448055AN34"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "BMO",
            "bidTime": "2020-02-18T12:06:18",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "RBC",
            "askTime": "2020-02-18T13:30:20",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 5000000,
            "totalRunBidQuantity": 2000,
            "totalRunAskQuantity": 2000,
            "axeSkew": 1,
            "totalSkew": 0.9996003197442046,
            "bidQuantity": 2000,
            "bidQuoteValue": 2.91375994682312,
            "askQuantity": 5000000,
            "askQuoteValue": 2.8356099128723145,
            "globalIdentifier": "CA448055AN34"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "128",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": -9000000,
            "cs01Cad": -5737.463658,
            "cs01Local": -5737.463658
          }
        ]
      },
      "135": {
        "securityIdentifier": "135",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "135",
          "ccy": "USD",
          "country": "US",
          "industry": "Banks",
          "name": "CIT 5.0 08/15/2022 Bullet USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US125581GQ55",
          "obligorName": "CIT GROUP INC",
          "obligorId": 180,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Commer Banks-Eastern US",
          "ticker": "CIT",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65014",
            "benchmarkName": "T 1.375 01/31/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 83.2299,
            "gSpread": 83.442,
            "yieldWorst": 2.25425,
            "amtOutstanding": 1147000000,
            "marketValue": 1222805230,
            "workoutTerm": 2.5014,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 106.609,
            "spread": 81.21689999999998,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.1225,
              "gSpread": -1.3882,
              "yieldWorst": -0.02596,
              "ratingDouble": 0,
              "price": 0.058,
              "spread": -1.0165
            },
            "Wow": {
              "zSpread": -6.3872,
              "gSpread": -8.2302,
              "yieldWorst": -0.06515,
              "ratingDouble": 0,
              "price": 0.107,
              "spread": -9.4906
            },
            "Mtd": {
              "zSpread": -25.6141,
              "gSpread": -30.2532,
              "yieldWorst": -0.18923,
              "ratingDouble": 0,
              "price": 0.373,
              "spread": -29.7696
            },
            "Mom": {
              "zSpread": 2.7333,
              "gSpread": -0.3246,
              "yieldWorst": -0.16701,
              "ratingDouble": 0,
              "price": 0.198,
              "spread": -3.3877
            },
            "Ytd": {
              "zSpread": -1.059,
              "gSpread": -8.4763,
              "yieldWorst": -0.25864,
              "ratingDouble": 0,
              "price": 0.351,
              "spread": -8.7108
            },
            "Yoy": {
              "zSpread": -59.3241,
              "gSpread": -68.948,
              "yieldWorst": -1.73649,
              "ratingDouble": 0,
              "price": 3.353,
              "spread": -70.5751
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 85
            },
            "primaryPmName": "PM",
            "backupPmName": "DJ",
            "researchName": "LP",
            "owners": [
              "PM",
              "DJ",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "135",
            "quantity": 6667000,
            "cs01Cad": 2214.603631312,
            "cs01Local": 2214.603631312
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:36:22",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "MULT",
            "askTime": "2020-02-18T13:14:02",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 8465000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 5000000,
            "bidQuoteValue": 106.625,
            "askQuantity": 0,
            "askQuoteValue": 106.875,
            "globalIdentifier": "US125581GQ55"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:36:22",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "MULT",
            "askTime": "2020-02-18T13:14:02",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 8465000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 5000000,
            "bidQuoteValue": 83.95709991455078,
            "askQuantity": 0,
            "askQuoteValue": 74.1843032836914,
            "globalIdentifier": "US125581GQ55"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:36:22",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BARC",
            "askTime": "2020-02-18T13:14:02",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 8465000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 2.244999885559082,
            "askQuantity": null,
            "askQuoteValue": 2.1500000953674316,
            "globalIdentifier": "US125581GQ55"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "135",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 2403000,
            "cs01Cad": 798.213968208,
            "cs01Local": 798.213968208
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "135",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 4264000,
            "cs01Cad": 1416.389663104,
            "cs01Local": 1416.389663104
          }
        ]
      },
      "1870": {
        "securityIdentifier": "1870",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "1870",
          "ccy": "USD",
          "country": "US",
          "industry": "Banks",
          "name": "FHN 3.5 12/15/2020 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US320517AB13",
          "obligorName": "FIRST HORIZON NATIONAL CORP",
          "obligorId": 1251,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Commer Banks-Southern US",
          "ticker": "FHN",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65014",
            "benchmarkName": "T 1.375 01/31/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 28.8218,
            "gSpread": 37.0197,
            "yieldWorst": 1.90641,
            "amtOutstanding": 500000000,
            "marketValue": 505815000,
            "workoutTerm": 0.7534,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 101.163,
            "spread": 45.17309999999998,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -0.0015,
              "gSpread": -4.4874,
              "yieldWorst": -0.01395,
              "ratingDouble": 0,
              "price": 0.006,
              "spread": 0.1622
            },
            "Wow": {
              "zSpread": -0.682,
              "gSpread": 0.0975,
              "yieldWorst": -0.02322,
              "ratingDouble": 0,
              "price": -0.017,
              "spread": -5.5473
            },
            "Mtd": {
              "zSpread": -0.8714,
              "gSpread": -2.5962,
              "yieldWorst": 0.00216,
              "ratingDouble": 0,
              "price": -0.067,
              "spread": -11.1055
            },
            "Mom": {
              "zSpread": -11.4635,
              "gSpread": -26.4249,
              "yieldWorst": -0.25605,
              "ratingDouble": 0,
              "price": 0.068,
              "spread": -13.1975
            },
            "Ytd": {
              "zSpread": -10.0926,
              "gSpread": -25.3688,
              "yieldWorst": -0.27388,
              "ratingDouble": 0,
              "price": 0.036,
              "spread": -15.1069
            },
            "Yoy": {
              "zSpread": -40.5029,
              "gSpread": -48.3203,
              "yieldWorst": -1.44435,
              "ratingDouble": -0.33,
              "price": 0.914,
              "spread": -40.5507
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 60
            },
            "primaryPmName": "SP",
            "backupPmName": "DA",
            "researchName": "LP",
            "owners": [
              "SP",
              "DA",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "CIBC DOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "1870",
            "quantity": 27634000,
            "cs01Cad": 2742.762293218,
            "cs01Local": 2742.762293218
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Axe",
            "bidDealer": "UBS",
            "bidTime": "2020-02-18T07:41:51",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T08:19:28",
            "askVenue": "MSG1",
            "askIsOld": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 101.16999816894531,
            "askQuantity": null,
            "askQuoteValue": 101.13999938964844,
            "globalIdentifier": "US320517AB13"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "JPM",
            "bidTime": "2020-02-18T08:05:29",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T08:19:28",
            "askVenue": "MSG1",
            "askIsOld": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 2000000,
            "bidQuoteValue": 42,
            "askQuantity": null,
            "askQuoteValue": 47.31890106201172,
            "globalIdentifier": "US320517AB13"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Axe",
            "bidDealer": "UBS",
            "bidTime": "2020-02-18T07:41:51",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T08:19:28",
            "askVenue": "MSG1",
            "askIsOld": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 1.897320032119751,
            "askQuantity": null,
            "askQuoteValue": 1.9375499486923218,
            "globalIdentifier": "US320517AB13"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "1870",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 27634000,
            "cs01Cad": 2742.762293218,
            "cs01Local": 2742.762293218
          }
        ]
      },
      "5179": {
        "securityIdentifier": "5179",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "5179",
          "ccy": "USD",
          "country": "US",
          "industry": "Life Insurance",
          "name": "VOYA 5.65 05/15/2023 Callable USD SUBORDINATE",
          "genericSeniority": "SUB",
          "globalIdentifier": "US45685EAG17",
          "obligorName": "VOYA FINANCIAL INC",
          "obligorId": 1283,
          "paymentRank": "JR SUBORDINATED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Multi-line Insurance",
          "ticker": "VOYA",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": true,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "64723",
            "benchmarkName": "T 1.5 01/15/2023 USD",
            "underlyingSecurityId": -1,
            "zSpread": 180.799,
            "gSpread": 182.2812,
            "yieldWorst": 3.21149,
            "amtOutstanding": 749250000,
            "marketValue": 804986708,
            "workoutTerm": 3.2493,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 107.439,
            "spread": 180.37290000000002,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 4.121,
              "gSpread": 3.7008,
              "yieldWorst": 0.01186,
              "ratingDouble": 0,
              "price": -0.044,
              "spread": 3.4089
            },
            "Wow": {
              "zSpread": -21.103,
              "gSpread": -22.0089,
              "yieldWorst": -0.21139,
              "ratingDouble": 0,
              "price": 0.628,
              "spread": 0
            },
            "Mtd": {
              "zSpread": -35.11,
              "gSpread": -37.7991,
              "yieldWorst": -0.27749,
              "ratingDouble": 0,
              "price": 0.801,
              "spread": 0
            },
            "Mom": {
              "zSpread": -6.459,
              "gSpread": -8.1193,
              "yieldWorst": -0.26834,
              "ratingDouble": 0,
              "price": 0.675,
              "spread": 0
            },
            "Ytd": {
              "zSpread": -19.19,
              "gSpread": -22.5743,
              "yieldWorst": -0.46179,
              "ratingDouble": 0,
              "price": 1.237,
              "spread": 0
            },
            "Yoy": {
              "zSpread": -197.321,
              "gSpread": -205.6788,
              "yieldWorst": -3.13216,
              "ratingDouble": 0,
              "price": 10.0411,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Price",
              "enteredTime": null,
              "user": null,
              "value": 107.63
            },
            "primaryPmName": "IL",
            "backupPmName": "PM",
            "researchName": null,
            "owners": [
              "IL",
              "PM"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "NT AGB CUSTODY",
                "TD BBB PB",
                "TD DOF PB",
                "TD SOF PB",
                "NT STIP CUSTODY"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "AGB",
                "BBB",
                "DOF",
                "SOF",
                "STIP"
              ],
              "StrategyName": [
                "LTOV - Yield"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "5179",
            "quantity": 10000000,
            "cs01Cad": 4236.79576,
            "cs01Local": 4236.79576
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "MULT",
            "bidTime": "2020-02-18T13:09:23",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T13:09:23",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 3000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 3000000,
            "bidQuoteValue": 107.25,
            "askQuantity": null,
            "askQuoteValue": 108,
            "globalIdentifier": "US45685EAG17"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "GS",
            "bidTime": "2020-02-18T13:09:23",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T13:09:23",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 3000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 189.6649932861328,
            "askQuantity": null,
            "askQuoteValue": 166.44900512695312,
            "globalIdentifier": "US45685EAG17"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "MULT",
            "bidTime": "2020-02-18T13:09:23",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T13:09:23",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 3000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 3000000,
            "bidQuoteValue": 3.2689499855041504,
            "askQuantity": null,
            "askQuoteValue": 3.0361599922180176,
            "globalIdentifier": "US45685EAG17"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "5179",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "AGB",
              "StrategyName": ""
            },
            "quantity": 1000000,
            "cs01Cad": 423.679576,
            "cs01Local": 423.679576
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "5179",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "BBB",
              "StrategyName": ""
            },
            "quantity": 1000000,
            "cs01Cad": 423.679576,
            "cs01Local": 423.679576
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "5179",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 3500000,
            "cs01Cad": 1482.878516,
            "cs01Local": 1482.878516
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "5179",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 2000000,
            "cs01Cad": 847.359152,
            "cs01Local": 847.359152
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "5179",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "STIP",
              "StrategyName": ""
            },
            "quantity": 2500000,
            "cs01Cad": 1059.19894,
            "cs01Local": 1059.19894
          }
        ]
      },
      "7329": {
        "securityIdentifier": "7329",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": true,
          "securityIdentifier": "7329",
          "ccy": "USD",
          "country": "CH",
          "industry": "Financial Services",
          "name": "CS 3.8 09/15/2022 Bullet USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US225433AH43",
          "obligorName": "CREDIT SUISSE GROUP AG",
          "obligorId": 219,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Diversified Banking Inst",
          "ticker": "CS",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65014",
            "benchmarkName": "T 1.375 01/31/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 58,
            "gSpread": 58.2381,
            "yieldWorst": 1.99842,
            "amtOutstanding": 1988525000,
            "marketValue": 2077889314,
            "workoutTerm": 2.5863,
            "ratingDouble": 16,
            "isRated": true,
            "rating": "BBB+",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 104.494,
            "spread": 56.13370000000003,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.2921,
              "gSpread": -1.1297,
              "yieldWorst": -0.0246,
              "ratingDouble": 0,
              "price": 0.058,
              "spread": -0.8889
            },
            "Wow": {
              "zSpread": -0.4426,
              "gSpread": -2.1144,
              "yieldWorst": -0.00516,
              "ratingDouble": 0,
              "price": -0.024,
              "spread": -3.381
            },
            "Mtd": {
              "zSpread": -3.2639,
              "gSpread": -7.5946,
              "yieldWorst": 0.03597,
              "ratingDouble": 0,
              "price": -0.164,
              "spread": -7.0462
            },
            "Mom": {
              "zSpread": -4.9018,
              "gSpread": -7.8107,
              "yieldWorst": -0.24467,
              "ratingDouble": 0,
              "price": 0.492,
              "spread": -10.8607
            },
            "Ytd": {
              "zSpread": -1.8473,
              "gSpread": -8.7947,
              "yieldWorst": -0.26947,
              "ratingDouble": 0,
              "price": 0.506,
              "spread": -9.4937
            },
            "Yoy": {
              "zSpread": -63.425,
              "gSpread": -72.8919,
              "yieldWorst": -1.77895,
              "ratingDouble": 0,
              "price": 4.421,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 55
            },
            "primaryPmName": "DM",
            "backupPmName": "DA",
            "researchName": "LP",
            "owners": [
              "DM",
              "DA",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "BMO DOF PB",
                "TD DOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "7329",
            "quantity": 41177000,
            "cs01Cad": 14027.554510777001,
            "cs01Local": 14027.554510777001
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "BSNT",
            "bidTime": "2020-02-18T12:27:38",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BSNT",
            "askTime": "2020-02-18T12:27:38",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 104.55999755859375,
            "askQuantity": null,
            "askQuoteValue": 104.69000244140625,
            "globalIdentifier": "US225433AH43"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "BSNT",
            "bidTime": "2020-02-18T12:27:38",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BSNT",
            "askTime": "2020-02-18T12:27:38",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 57,
            "askQuantity": null,
            "askQuoteValue": 52,
            "globalIdentifier": "US225433AH43"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "BSNT",
            "bidTime": "2020-02-18T12:27:38",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BSNT",
            "askTime": "2020-02-18T12:27:38",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 1.968999981880188,
            "askQuantity": null,
            "askQuoteValue": 1.9190000295639038,
            "globalIdentifier": "US225433AH43"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "7329",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 41177000,
            "cs01Cad": 14027.554510777001,
            "cs01Local": 14027.554510777001
          }
        ]
      },
      "13456": {
        "securityIdentifier": "13456",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "13456",
          "ccy": "USD",
          "country": "US",
          "industry": "Hardware",
          "name": "PBI 5.2 04/01/2023 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US724479AN00",
          "obligorName": "PITNEY BOWES INC",
          "obligorId": 609,
          "paymentRank": "SR UNSECURED",
          "sector": "Technology",
          "securitySubType": "Bond",
          "subIndustry": "Office Automation&Equip",
          "ticker": "PBI",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "64723",
            "benchmarkName": "T 1.5 01/15/2023 USD",
            "underlyingSecurityId": -1,
            "zSpread": 363.374,
            "gSpread": 364.5576,
            "yieldWorst": 5.04049,
            "amtOutstanding": 400000000,
            "marketValue": 407100000,
            "workoutTerm": 3.0438,
            "ratingDouble": 12,
            "isRated": true,
            "rating": "BB",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 101.775,
            "spread": 364.146,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 3.777,
              "gSpread": 3.1021,
              "yieldWorst": 0.00892,
              "ratingDouble": 0,
              "price": -0.025,
              "spread": 3.1121
            },
            "Wow": {
              "zSpread": -26.063,
              "gSpread": -27.3463,
              "yieldWorst": -0.26098,
              "ratingDouble": 0,
              "price": 0.735,
              "spread": -27.2451
            },
            "Mtd": {
              "zSpread": -71.574,
              "gSpread": -74.8987,
              "yieldWorst": -0.64414,
              "ratingDouble": 0,
              "price": 1.8167,
              "spread": -74.9946
            },
            "Mom": {
              "zSpread": -88.902,
              "gSpread": -91.2101,
              "yieldWorst": -1.09317,
              "ratingDouble": 0,
              "price": 3.1323,
              "spread": -91.6086
            },
            "Ytd": {
              "zSpread": -89.824,
              "gSpread": -94.117,
              "yieldWorst": -1.16654,
              "ratingDouble": 0,
              "price": 3.3739,
              "spread": -87.6241
            },
            "Yoy": {
              "zSpread": -73.541,
              "gSpread": -81.9124,
              "yieldWorst": -1.88804,
              "ratingDouble": 0,
              "price": 8.765,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-02-18T15:31:22.118",
              "user": "PM",
              "value": 350
            },
            "primaryPmName": "PM",
            "backupPmName": "DJ",
            "researchName": "LC",
            "owners": [
              "PM",
              "DJ",
              "LC"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Basis"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Basis"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "13456",
            "quantity": 27250000,
            "cs01Cad": 10315.255875,
            "cs01Local": 10315.255875
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:36:29",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "FLTR",
            "askTime": "2020-02-18T13:06:57",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 500000,
            "totalRunBidQuantity": 2000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": 1,
            "totalSkew": 0.5555555555555556,
            "bidQuantity": null,
            "bidQuoteValue": 101.75,
            "askQuantity": 500000,
            "askQuoteValue": 102.18000030517578,
            "globalIdentifier": "US724479AN00"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:36:29",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "FLTR",
            "askTime": "2020-02-18T13:06:57",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 500000,
            "totalRunBidQuantity": 2000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": 1,
            "totalSkew": 0.5555555555555556,
            "bidQuantity": null,
            "bidQuoteValue": 367.697998046875,
            "askQuantity": 500000,
            "askQuoteValue": 352.6940002441406,
            "globalIdentifier": "US724479AN00"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:36:29",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "FLTR",
            "askTime": "2020-02-18T13:06:57",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 500000,
            "totalRunBidQuantity": 2000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": 1,
            "totalSkew": 0.5555555555555556,
            "bidQuantity": null,
            "bidQuoteValue": 5.050000190734863,
            "askQuantity": 500000,
            "askQuoteValue": 4.895999908447266,
            "globalIdentifier": "US724479AN00"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "13456",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 9859000,
            "cs01Cad": 3732.0406485,
            "cs01Local": 3732.0406485
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "13456",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 17391000,
            "cs01Cad": 6583.2152265,
            "cs01Local": 6583.2152265
          }
        ]
      },
      "13545": {
        "securityIdentifier": "13545",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "13545",
          "ccy": "USD",
          "country": "US",
          "industry": "Property & Casualty Insurance",
          "name": "RDN 4.5 10/01/2024 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US750236AU59",
          "obligorName": "RADIAN GROUP INC",
          "obligorId": 657,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Financial Guarantee Ins",
          "ticker": "RDN",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65015",
            "benchmarkName": "T 1.375 01/31/2025 USD",
            "underlyingSecurityId": -1,
            "zSpread": 151.257,
            "gSpread": 151.8717,
            "yieldWorst": 2.91358,
            "amtOutstanding": 450000000,
            "marketValue": 479074500,
            "workoutTerm": 4.3808,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 106.461,
            "spread": 148.42680000000001,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 2.498,
              "gSpread": 2.5532,
              "yieldWorst": -0.0036,
              "ratingDouble": 0,
              "price": 0.011,
              "spread": 2.3956
            },
            "Wow": {
              "zSpread": -4.584,
              "gSpread": -5.6958,
              "yieldWorst": -0.04722,
              "ratingDouble": 0,
              "price": 0.169,
              "spread": -5.8763
            },
            "Mtd": {
              "zSpread": -13.553,
              "gSpread": -15.6597,
              "yieldWorst": -0.05615,
              "ratingDouble": 0,
              "price": 0.181,
              "spread": -17.0533
            },
            "Mom": {
              "zSpread": 1.949,
              "gSpread": 0.6183,
              "yieldWorst": -0.19757,
              "ratingDouble": 0,
              "price": 0.721,
              "spread": -0.5933
            },
            "Ytd": {
              "zSpread": 8.406,
              "gSpread": 5.4121,
              "yieldWorst": -0.21726,
              "ratingDouble": 0,
              "price": 0.763,
              "spread": 4.5415
            },
            "Yoy": {
              "zSpread": -81.162,
              "gSpread": -88.0183,
              "yieldWorst": -1.97929,
              "ratingDouble": 0,
              "price": 8.3751,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 140
            },
            "primaryPmName": "PM",
            "backupPmName": "DJ",
            "researchName": "LP",
            "owners": [
              "PM",
              "DJ",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Basis"
              ],
              "PortfolioShortName": [
                "SOF"
              ],
              "StrategyName": [
                "Basis"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "13545",
            "quantity": 2395000,
            "cs01Cad": 1367.6936049600001,
            "cs01Local": 1367.6936049600001
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:30:22",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "MULT",
            "askTime": "2020-02-18T12:41:53",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 2000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 2000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": 0,
            "totalSkew": 0.3333333333333333,
            "bidQuantity": 2000000,
            "bidQuoteValue": 106.625,
            "askQuantity": 0,
            "askQuoteValue": 107.125,
            "globalIdentifier": "US750236AU59"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:30:22",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:27:24",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 2000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 2000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": 0,
            "totalSkew": 0.3333333333333333,
            "bidQuantity": 2000000,
            "bidQuoteValue": 148.7550048828125,
            "askQuantity": null,
            "askQuoteValue": 137.45799255371094,
            "globalIdentifier": "US750236AU59"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T12:41:53",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askTime": "2020-02-18T12:41:53",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 2000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 2000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": 0,
            "totalSkew": 0.3333333333333333,
            "bidQuantity": null,
            "bidQuoteValue": 2.869999885559082,
            "askQuantity": null,
            "askQuoteValue": 2.759999990463257,
            "globalIdentifier": "US750236AU59"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "13545",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 2395000,
            "cs01Cad": 1367.6936049600001,
            "cs01Local": 1367.6936049600001
          }
        ]
      },
      "18249": {
        "securityIdentifier": "18249",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "18249",
          "ccy": "CAD",
          "country": "CA",
          "industry": "Transportation & Logistics",
          "name": "PENSKE 2.85 12/07/2022 Callable CAD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "CA70960AAC23",
          "obligorName": "PENSKE TRUCK LEASING CO LP",
          "obligorId": 1220,
          "paymentRank": "SR UNSECURED",
          "sector": "Industrials",
          "securitySubType": "Bond",
          "subIndustry": "Rental Auto/Equipment",
          "ticker": "PENSKE",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "1840",
            "benchmarkName": "CAN 1.0 09/01/2022 CAD",
            "underlyingSecurityId": -1,
            "zSpread": 0,
            "gSpread": 85.42,
            "yieldWorst": 2.300014,
            "amtOutstanding": 375000000,
            "marketValue": 382597301,
            "workoutTerm": 2.8137,
            "ratingDouble": 15.33,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 101.48718,
            "spread": 83.8815,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0,
              "gSpread": 0.54,
              "yieldWorst": -0.022213,
              "ratingDouble": 0,
              "price": 0.059318,
              "spread": 0.0982
            },
            "Wow": {
              "zSpread": 0,
              "gSpread": -1.08,
              "yieldWorst": 0.009815,
              "ratingDouble": 0,
              "price": -0.036896,
              "spread": -0.8607
            },
            "Mtd": {
              "zSpread": 0,
              "gSpread": -1.08,
              "yieldWorst": 0.055715,
              "ratingDouble": 0,
              "price": -0.174201,
              "spread": -0.618
            },
            "Mom": {
              "zSpread": 0,
              "gSpread": -2.68,
              "yieldWorst": -0.224535,
              "ratingDouble": 0,
              "price": 0.585175,
              "spread": -3.5869
            },
            "Ytd": {
              "zSpread": 0,
              "gSpread": -6.72,
              "yieldWorst": -0.305822,
              "ratingDouble": 0,
              "price": 0.802715,
              "spread": -8.3782
            },
            "Yoy": {
              "zSpread": 0,
              "gSpread": -49.31,
              "yieldWorst": -0.82842,
              "ratingDouble": 0,
              "price": 2.482548,
              "spread": -51.155
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 67
            },
            "primaryPmName": "IL",
            "backupPmName": "ST",
            "researchName": "TW",
            "owners": [
              "IL",
              "ST",
              "TW"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "18249",
            "quantity": 18198000,
            "cs01Cad": 4890.723036642,
            "cs01Local": 4890.723036642
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "RBC",
            "bidTime": "2020-02-18T08:52:06",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "CIBC",
            "askTime": "2020-02-18T08:33:04",
            "askVenue": "MSG1",
            "askIsOld": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 5000,
            "bidQuoteValue": 101.86599731445312,
            "askQuantity": 1000,
            "askQuoteValue": 101.8499984741211,
            "globalIdentifier": "CA70960AAC23"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "RBC",
            "bidTime": "2020-02-18T08:52:06",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "CIBC",
            "askTime": "2020-02-18T08:33:04",
            "askVenue": "MSG1",
            "askIsOld": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 5000,
            "bidQuoteValue": 71,
            "askQuantity": 1000,
            "askQuoteValue": 72,
            "globalIdentifier": "CA70960AAC23"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "RBC",
            "bidTime": "2020-02-18T08:52:06",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": "Run",
            "askDealer": "CIBC",
            "askTime": "2020-02-18T08:33:04",
            "askVenue": "MSG1",
            "askIsOld": true,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 5000,
            "bidQuoteValue": 2.138000011444092,
            "askQuantity": 1000,
            "askQuoteValue": 2.1440000534057617,
            "globalIdentifier": "CA70960AAC23"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "18249",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 18198000,
            "cs01Cad": 4890.723036642,
            "cs01Local": 4890.723036642
          }
        ]
      },
      "20299": {
        "securityIdentifier": "20299",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "20299",
          "ccy": "USD",
          "country": "US",
          "industry": "Property & Casualty Insurance",
          "name": "LIBMUT 4.95 05/01/2022 Bullet USD 144A SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US53079EAW49",
          "obligorName": "LIBERTY MUTUAL HOLDING CO INC",
          "obligorId": 2006,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Mutual Insurance",
          "ticker": "LIBMUT",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65014",
            "benchmarkName": "T 1.375 01/31/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 60.9343,
            "gSpread": 61.7237,
            "yieldWorst": 2.04588,
            "amtOutstanding": 473309000,
            "marketValue": 502715688,
            "workoutTerm": 2.211,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 106.213,
            "spread": 60.07899999999998,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -0.6063,
              "gSpread": -2.1118,
              "yieldWorst": -0.0322,
              "ratingDouble": 0,
              "price": 0.064,
              "spread": -1.636
            },
            "Wow": {
              "zSpread": -4.5064,
              "gSpread": -6.8985,
              "yieldWorst": -0.04727,
              "ratingDouble": 0,
              "price": 0.045,
              "spread": -7.7449
            },
            "Mtd": {
              "zSpread": -4.7662,
              "gSpread": -10.1106,
              "yieldWorst": 0.01481,
              "ratingDouble": 0,
              "price": -0.149,
              "spread": -9.4719
            },
            "Mom": {
              "zSpread": -2.0955,
              "gSpread": -5.5356,
              "yieldWorst": -0.20992,
              "ratingDouble": 0,
              "price": 0.232,
              "spread": -7.8923
            },
            "Ytd": {
              "zSpread": -0.2809,
              "gSpread": -8.8072,
              "yieldWorst": -0.24044,
              "ratingDouble": 0,
              "price": 0.211,
              "spread": -7.1036
            },
            "Yoy": {
              "zSpread": -41.0967,
              "gSpread": -50.5963,
              "yieldWorst": -1.54734,
              "ratingDouble": 0,
              "price": 2.151,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 60
            },
            "primaryPmName": "DA",
            "backupPmName": "DM",
            "researchName": "LP",
            "owners": [
              "DA",
              "DM",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "20299",
            "quantity": 1480000,
            "cs01Cad": 436.98437227999995,
            "cs01Local": 436.98437227999995
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:30:18",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": null,
            "askDealer": null,
            "askTime": null,
            "askVenue": null,
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 15000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 15000000,
            "bidQuoteValue": 106.20899963378906,
            "askQuantity": null,
            "askQuoteValue": null,
            "globalIdentifier": "US53079EAW49"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:30:18",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": null,
            "askDealer": null,
            "askTime": null,
            "askVenue": null,
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 15000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 15000000,
            "bidQuoteValue": 64,
            "askQuantity": null,
            "askQuoteValue": null,
            "globalIdentifier": "US53079EAW49"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Axe",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:30:18",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": null,
            "askDealer": null,
            "askTime": null,
            "askVenue": null,
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 15000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": 15000000,
            "bidQuoteValue": 2.0444600582122803,
            "askQuantity": null,
            "askQuoteValue": null,
            "globalIdentifier": "US53079EAW49"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "20299",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 1480000,
            "cs01Cad": 436.98437227999995,
            "cs01Local": 436.98437227999995
          }
        ]
      },
      "28481": {
        "securityIdentifier": "28481",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "28481",
          "ccy": "USD",
          "country": "US",
          "industry": "Airlines",
          "name": "UAL 4.875 01/15/2025 Bullet USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US910047AK50",
          "obligorName": "UNITED AIRLINES HOLDINGS INC",
          "obligorId": 803,
          "paymentRank": "SR UNSECURED",
          "sector": "Consumers",
          "securitySubType": "Bond",
          "subIndustry": "Airlines",
          "ticker": "UAL",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65015",
            "benchmarkName": "T 1.375 01/31/2025 USD",
            "underlyingSecurityId": -1,
            "zSpread": 201.404,
            "gSpread": 200.7195,
            "yieldWorst": 3.42126,
            "amtOutstanding": 350000000,
            "marketValue": 372788500,
            "workoutTerm": 4.9233,
            "ratingDouble": 12,
            "isRated": true,
            "rating": "BB",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 106.511,
            "spread": 200.15450000000007,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 2.949,
              "gSpread": 2.8932,
              "yieldWorst": 0.00103,
              "ratingDouble": 0,
              "price": -0.008,
              "spread": 2.8784
            },
            "Wow": {
              "zSpread": 1.337,
              "gSpread": -0.0001,
              "yieldWorst": 0.0115,
              "ratingDouble": 0,
              "price": -0.081,
              "spread": -0.0838
            },
            "Mtd": {
              "zSpread": -28.575,
              "gSpread": -30.8177,
              "yieldWorst": -0.2058,
              "ratingDouble": 0,
              "price": 0.908,
              "spread": 0
            },
            "Mom": {
              "zSpread": 18.638,
              "gSpread": 17.2716,
              "yieldWorst": -0.03519,
              "ratingDouble": 0,
              "price": 0.052,
              "spread": 0
            },
            "Ytd": {
              "zSpread": 17.844,
              "gSpread": 14.4989,
              "yieldWorst": -0.13443,
              "ratingDouble": 0,
              "price": 0.482,
              "spread": 0
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Price",
              "enteredTime": null,
              "user": null,
              "value": 106.625
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "TW",
            "owners": [
              "DJ",
              "PM",
              "TW"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28481",
            "quantity": 2000000,
            "cs01Cad": 1235.767894,
            "cs01Local": 1235.767894
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "MS",
            "bidTime": "2020-02-18T13:19:01",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:52:08",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 5000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 106.75,
            "askQuantity": null,
            "askQuoteValue": 107.125,
            "globalIdentifier": "US910047AK50"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "MS",
            "bidTime": "2020-02-18T13:19:01",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:52:08",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 5000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 198.27200317382812,
            "askQuantity": null,
            "askQuoteValue": 190.73399353027344,
            "globalIdentifier": "US910047AK50"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "MS",
            "bidTime": "2020-02-18T13:19:01",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:52:08",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 5000000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 3.3691000938415527,
            "askQuantity": null,
            "askQuoteValue": 3.2888500690460205,
            "globalIdentifier": "US910047AK50"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28481",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 1000000,
            "cs01Cad": 617.883947,
            "cs01Local": 617.883947
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28481",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 1000000,
            "cs01Cad": 617.883947,
            "cs01Local": 617.883947
          }
        ]
      },
      "28544": {
        "securityIdentifier": "28544",
        "security": {
          "securityIdentifier": "28544",
          "ccy": "CAD",
          "country": "US",
          "industry": "Real Estate",
          "name": "BPOCN 6 PFD 06/30/2021 CAD CC",
          "genericSeniority": "SUB",
          "globalIdentifier": "CA1129006674",
          "obligorName": "BROOKFIELD OFFICE PROPERTIES INC",
          "obligorId": 2351,
          "paymentRank": "PREFERRED",
          "sector": "Financials",
          "securitySubType": "Preferred",
          "subIndustry": "Real Estate Oper/Develop",
          "ticker": "BPOCN",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": true,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 0,
            "gSpread": 0,
            "yieldWorst": 8.679148,
            "amtOutstanding": 8000000,
            "marketValue": 209600000,
            "workoutTerm": 1.3753,
            "ratingDouble": 14.5,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "Xover",
            "price": 26.2,
            "spread": 0,
            "isIndex": false
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": 0.02015,
              "ratingDouble": 0,
              "price": 0,
              "spread": 0
            },
            "Wow": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": 0.012042,
              "ratingDouble": 0,
              "price": -0.04,
              "spread": 0
            },
            "Mtd": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": -0.11945,
              "ratingDouble": 0,
              "price": 0.11,
              "spread": 0
            },
            "Mom": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": 0.132774,
              "ratingDouble": 0,
              "price": 0.06,
              "spread": 0
            },
            "Ytd": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": 0.17952,
              "ratingDouble": 0,
              "price": 0.1,
              "spread": 0
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Price",
              "enteredTime": null,
              "user": null,
              "value": 26.18
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "PD",
            "owners": [
              "DJ",
              "PM",
              "PD"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "NT STIP CUSTODY"
              ],
              "AttributionOwner": [
                "CAD Term Risk"
              ],
              "PortfolioShortName": [
                "STIP"
              ],
              "StrategyName": [
                "LTOV - Yield"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28544",
            "quantity": 990000,
            "cs01Cad": 134.0566021872,
            "cs01Local": 134.0566021872
          },
          "securityType": "Preferred"
        },
        "bestQuotes": null,
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28544",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "STIP",
              "StrategyName": ""
            },
            "quantity": 990000,
            "cs01Cad": 134.0566021872,
            "cs01Local": 134.0566021872
          }
        ]
      },
      "28551": {
        "securityIdentifier": "28551",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "28551",
          "ccy": "USD",
          "country": "US",
          "industry": "Exploration & Production",
          "name": "EGN 7.35 07/28/2027 Bullet USD MTNA SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US29265AAR77",
          "obligorName": "ENERGEN CORP",
          "obligorId": 2189,
          "paymentRank": "SR UNSECURED",
          "sector": "Energy",
          "securitySubType": "Bond",
          "subIndustry": "Oil Comp-Explor&Prodtn",
          "ticker": "EGN",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "63070",
            "benchmarkName": "T 1.75 11/15/2029 USD",
            "underlyingSecurityId": -1,
            "zSpread": 0,
            "gSpread": 282.07,
            "yieldWorst": 4.345918,
            "amtOutstanding": 10000000,
            "marketValue": 12167125,
            "workoutTerm": 7.4548,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 118.955834,
            "spread": 275,
            "isIndex": false
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0,
              "gSpread": 0.21,
              "yieldWorst": -0.029453,
              "ratingDouble": 0,
              "price": 0.200502,
              "spread": 0
            },
            "Wow": {
              "zSpread": 0,
              "gSpread": 0.87,
              "yieldWorst": 0.009105,
              "ratingDouble": 0,
              "price": -0.105273,
              "spread": 0
            },
            "Mtd": {
              "zSpread": 0,
              "gSpread": 0.32,
              "yieldWorst": 0.086529,
              "ratingDouble": 0,
              "price": -0.68813,
              "spread": 0
            },
            "Mom": {
              "zSpread": 0,
              "gSpread": 1.08,
              "yieldWorst": -0.216506,
              "ratingDouble": 0,
              "price": 1.344863,
              "spread": 0
            },
            "Ytd": {
              "zSpread": 0,
              "gSpread": 1.26,
              "yieldWorst": -0.323047,
              "ratingDouble": 0,
              "price": 2.017913,
              "spread": 0
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 275
            },
            "primaryPmName": "DJ",
            "backupPmName": "DM",
            "researchName": "TW",
            "owners": [
              "DJ",
              "DM",
              "TW"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "BARC DOF PB",
                "BMO DOF PB",
                "TD DOF PB",
                "CIBC DOF PB",
                "BNS SOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "LTOV - Yield"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28551",
            "quantity": 10000000,
            "cs01Cad": 9324.022799999999,
            "cs01Local": 9324.022799999999
          },
          "securityType": "Bond"
        },
        "bestQuotes": null,
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28551",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 5000000,
            "cs01Cad": 4662.011399999999,
            "cs01Local": 4662.011399999999
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "28551",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 5000000,
            "cs01Cad": 4662.0114,
            "cs01Local": 4662.0114
          }
        ]
      },
      "33693": {
        "securityIdentifier": "33693",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "33693",
          "ccy": "USD",
          "country": "US",
          "industry": "Financial Services",
          "name": "STT FRN 06/15/2047 Callable USD SUBORDINATE",
          "genericSeniority": "SUB",
          "globalIdentifier": "US857477AY98",
          "obligorName": "STATE STREET CORP",
          "obligorId": 1906,
          "paymentRank": "JR SUBORDINATED",
          "sector": "Financials",
          "securitySubType": "FRN",
          "subIndustry": "Fiduciary Banks",
          "ticker": "STT",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": false,
            "isFloat": true,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 151.196,
            "gSpread": 123.9283,
            "yieldWorst": 3.21416,
            "amtOutstanding": 502584000,
            "marketValue": 456462871,
            "workoutTerm": 27.3507,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 90.8232,
            "spread": 151.196,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.569,
              "gSpread": 0.8766,
              "yieldWorst": -0.02765,
              "ratingDouble": 0,
              "price": -0.1299,
              "spread": 0.569
            },
            "Wow": {
              "zSpread": -2.017,
              "gSpread": -1.8088,
              "yieldWorst": -0.03031,
              "ratingDouble": 0,
              "price": 0.3576,
              "spread": -2.017
            },
            "Mtd": {
              "zSpread": -11.949,
              "gSpread": -11.7698,
              "yieldWorst": -0.08118,
              "ratingDouble": 0,
              "price": 2.1337,
              "spread": -11.949
            },
            "Mom": {
              "zSpread": -33.915,
              "gSpread": -34.95,
              "yieldWorst": -0.58567,
              "ratingDouble": 0,
              "price": 5.2721,
              "spread": -33.915
            },
            "Ytd": {
              "zSpread": -23.108,
              "gSpread": -24.062,
              "yieldWorst": -0.58995,
              "ratingDouble": 0,
              "price": 3.4482,
              "spread": -23.108
            },
            "Yoy": {
              "zSpread": -98.684,
              "gSpread": -109.1817,
              "yieldWorst": -2.09481,
              "ratingDouble": 0,
              "price": 12.7359,
              "spread": -98.684
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 146.1767
            },
            "primaryPmName": "IL",
            "backupPmName": "PM",
            "researchName": null,
            "owners": [
              "IL",
              "PM"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "NT AGB CUSTODY",
                "TD DOF PB",
                "NT STIP CUSTODY"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "AGB",
                "DOF",
                "STIP"
              ],
              "StrategyName": [
                "LTOV - Yield"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "33693",
            "quantity": 23000000,
            "cs01Cad": 52918.142951999995,
            "cs01Local": 52918.142951999995
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "MS",
            "bidTime": "2020-02-18T12:42:51",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "MS",
            "askTime": "2020-02-18T12:43:21",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3500000,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 1,
            "totalSkew": 1,
            "bidQuantity": null,
            "bidQuoteValue": 90.5,
            "askQuantity": 3500000,
            "askQuoteValue": 92,
            "globalIdentifier": "US857477AY98"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "MS",
            "bidTime": "2020-02-18T09:59:06",
            "bidVenue": "MSG1",
            "bidIsOld": true,
            "askQuoteType": null,
            "askDealer": null,
            "askTime": null,
            "askVenue": null,
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": 5000000,
            "bidQuoteValue": 90,
            "askQuantity": null,
            "askQuoteValue": null,
            "globalIdentifier": "US857477AY98"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "MS",
            "bidTime": "2020-02-18T12:42:51",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "MS",
            "askTime": "2020-02-18T12:43:21",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3500000,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 1,
            "totalSkew": 1,
            "bidQuantity": null,
            "bidQuoteValue": 3.2128000259399414,
            "askQuantity": 3500000,
            "askQuoteValue": 3.12637996673584,
            "globalIdentifier": "US857477AY98"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "33693",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "AGB",
              "StrategyName": ""
            },
            "quantity": 2800000,
            "cs01Cad": 6442.2087071999995,
            "cs01Local": 6442.2087071999995
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "33693",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 9335000,
            "cs01Cad": 21477.86367204,
            "cs01Local": 21477.86367204
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "33693",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "STIP",
              "StrategyName": ""
            },
            "quantity": 10865000,
            "cs01Cad": 24998.07057276,
            "cs01Local": 24998.07057276
          }
        ]
      },
      "34321": {
        "securityIdentifier": "34321",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "34321",
          "ccy": "USD",
          "country": "US",
          "industry": "Homebuilders",
          "name": "TOL 5.875 02/15/2022 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US88947EAK64",
          "obligorName": "TOLL BROTHERS INC",
          "obligorId": 784,
          "paymentRank": "SR UNSECURED",
          "sector": "Consumer Discretionary",
          "securitySubType": "Bond",
          "subIndustry": "Bldg-Residential/Commer",
          "ticker": "TOL",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65014",
            "benchmarkName": "T 1.375 01/31/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 71.8581,
            "gSpread": 77.1334,
            "yieldWorst": 2.19074,
            "amtOutstanding": 419876000,
            "marketValue": 446143443,
            "workoutTerm": 1.7534,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 106.256,
            "spread": 73.5078,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -0.8298,
              "gSpread": -0.6665,
              "yieldWorst": -0.03193,
              "ratingDouble": 0,
              "price": 0.047,
              "spread": -1.6236
            },
            "Wow": {
              "zSpread": -13.6847,
              "gSpread": -17.1992,
              "yieldWorst": -0.14088,
              "ratingDouble": 0,
              "price": 0.173,
              "spread": -17.4474
            },
            "Mtd": {
              "zSpread": -30.8689,
              "gSpread": -36.2847,
              "yieldWorst": -0.25422,
              "ratingDouble": 0,
              "price": 0.312,
              "spread": -36.8951
            },
            "Mom": {
              "zSpread": -10.5692,
              "gSpread": -14.1078,
              "yieldWorst": -0.28186,
              "ratingDouble": 0,
              "price": 0.201,
              "spread": 0
            },
            "Ytd": {
              "zSpread": -14.2747,
              "gSpread": -21.4708,
              "yieldWorst": -0.36131,
              "ratingDouble": 0,
              "price": 0.235,
              "spread": 0
            },
            "Yoy": {
              "zSpread": -90.7669,
              "gSpread": -96.9766,
              "yieldWorst": -2.02696,
              "ratingDouble": 0,
              "price": 2.005,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 75
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "PD",
            "owners": [
              "DJ",
              "PM",
              "PD"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "SOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "34321",
            "quantity": 7946000,
            "cs01Cad": 1867.627037454,
            "cs01Local": 1867.627037454
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T12:53:57",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "CITZ",
            "askTime": "2020-02-18T13:17:47",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3575000,
            "totalRunBidQuantity": 3000000,
            "totalRunAskQuantity": 3000000,
            "axeSkew": 1,
            "totalSkew": 0.6866840731070496,
            "bidQuantity": null,
            "bidQuoteValue": 106.25,
            "askQuantity": 1000000,
            "askQuoteValue": 106.375,
            "globalIdentifier": "US88947EAK64"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T12:53:57",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "CITZ",
            "askTime": "2020-02-18T13:17:47",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3575000,
            "totalRunBidQuantity": 3000000,
            "totalRunAskQuantity": 3000000,
            "axeSkew": 1,
            "totalSkew": 0.6866840731070496,
            "bidQuantity": null,
            "bidQuoteValue": 78.50900268554688,
            "askQuantity": 1000000,
            "askQuoteValue": 71.62329864501953,
            "globalIdentifier": "US88947EAK64"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T12:53:57",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "CG",
            "askTime": "2020-02-18T12:02:05",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3575000,
            "totalRunBidQuantity": 3000000,
            "totalRunAskQuantity": 3000000,
            "axeSkew": 1,
            "totalSkew": 0.6866840731070496,
            "bidQuantity": null,
            "bidQuoteValue": 2.190000057220459,
            "askQuantity": 2575000,
            "askQuoteValue": 2.0526599884033203,
            "globalIdentifier": "US88947EAK64"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "34321",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 7946000,
            "cs01Cad": 1867.627037454,
            "cs01Local": 1867.627037454
          }
        ]
      },
      "34323": {
        "securityIdentifier": "34323",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "34323",
          "ccy": "USD",
          "country": "US",
          "industry": "Homebuilders",
          "name": "TOL 4.375 04/15/2023 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US88947EAN04",
          "obligorName": "TOLL BROTHERS INC",
          "obligorId": 784,
          "paymentRank": "SR UNSECURED",
          "sector": "Consumer Discretionary",
          "securitySubType": "Bond",
          "subIndustry": "Bldg-Residential/Commer",
          "ticker": "TOL",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "64723",
            "benchmarkName": "T 1.5 01/15/2023 USD",
            "underlyingSecurityId": -1,
            "zSpread": 106.86,
            "gSpread": 108.1247,
            "yieldWorst": 2.48124,
            "amtOutstanding": 400000000,
            "marketValue": 421112000,
            "workoutTerm": 2.9205,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 105.278,
            "spread": 107.42410000000001,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 12.5762,
              "gSpread": 11.6998,
              "yieldWorst": 0.09721,
              "ratingDouble": 0,
              "price": -0.285,
              "spread": 11.9397
            },
            "Wow": {
              "zSpread": -4.975,
              "gSpread": -6.1737,
              "yieldWorst": -0.04996,
              "ratingDouble": 0,
              "price": 0.106,
              "spread": -6.2421
            },
            "Mtd": {
              "zSpread": -20.165,
              "gSpread": -23.4897,
              "yieldWorst": -0.12946,
              "ratingDouble": 0,
              "price": 0.304,
              "spread": -23.7272
            },
            "Mom": {
              "zSpread": -0.683,
              "gSpread": -2.9933,
              "yieldWorst": -0.20756,
              "ratingDouble": 0,
              "price": 0.454,
              "spread": 0
            },
            "Ytd": {
              "zSpread": 1.201,
              "gSpread": -3.7007,
              "yieldWorst": -0.24916,
              "ratingDouble": 0,
              "price": 0.522,
              "spread": 0
            },
            "Yoy": {
              "zSpread": -94.893,
              "gSpread": -103.0853,
              "yieldWorst": -2.09466,
              "ratingDouble": 0,
              "price": 6.0358,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 95.0274
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "PD",
            "owners": [
              "DJ",
              "PM",
              "PD"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "SOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "34323",
            "quantity": 0,
            "cs01Cad": 0,
            "cs01Local": 0
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "DB",
            "bidTime": "2020-02-18T12:17:23",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "WFS",
            "askTime": "2020-02-18T12:38:26",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 3000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": null,
            "totalSkew": 0.4,
            "bidQuantity": 1000000,
            "bidQuoteValue": 105.375,
            "askQuantity": 1000000,
            "askQuoteValue": 105.875,
            "globalIdentifier": "US88947EAN04"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "DB",
            "bidTime": "2020-02-18T12:17:23",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "WFS",
            "askTime": "2020-02-18T12:38:26",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 3000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": null,
            "totalSkew": 0.4,
            "bidQuantity": 1000000,
            "bidQuoteValue": 107.5999984741211,
            "askQuantity": 1000000,
            "askQuoteValue": 90.52680206298828,
            "globalIdentifier": "US88947EAN04"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "DB",
            "bidTime": "2020-02-18T12:17:23",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "WFS",
            "askTime": "2020-02-18T12:38:26",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 3000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": null,
            "totalSkew": 0.4,
            "bidQuantity": 1000000,
            "bidQuoteValue": 2.450000047683716,
            "askQuantity": 1000000,
            "askQuoteValue": 2.2699999809265137,
            "globalIdentifier": "US88947EAN04"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "34323",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 0,
            "cs01Cad": 0,
            "cs01Local": 0
          }
        ]
      },
      "34329": {
        "securityIdentifier": "34329",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "34329",
          "ccy": "USD",
          "country": "US",
          "industry": "Homebuilders",
          "name": "TOL 4.35 02/15/2028 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US88947EAT73",
          "obligorName": "TOLL BROTHERS INC",
          "obligorId": 784,
          "paymentRank": "SR UNSECURED",
          "sector": "Consumer Discretionary",
          "securitySubType": "Bond",
          "subIndustry": "Bldg-Residential/Commer",
          "ticker": "TOL",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "63070",
            "benchmarkName": "T 1.75 11/15/2029 USD",
            "underlyingSecurityId": -1,
            "zSpread": 182.939,
            "gSpread": 175.8722,
            "yieldWorst": 3.29367,
            "amtOutstanding": 400000000,
            "marketValue": 428672000,
            "workoutTerm": 7.7562,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 107.168,
            "spread": 170.02660000000003,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.62,
              "gSpread": 0.6167,
              "yieldWorst": -0.02568,
              "ratingDouble": 0,
              "price": 0.179,
              "spread": 0.3774
            },
            "Wow": {
              "zSpread": -13.295,
              "gSpread": -13.1342,
              "yieldWorst": -0.13179,
              "ratingDouble": 0,
              "price": 0.911,
              "spread": -14.0577
            },
            "Mtd": {
              "zSpread": -35.814,
              "gSpread": -36.355,
              "yieldWorst": -0.28205,
              "ratingDouble": 0,
              "price": 1.947,
              "spread": -36.7936
            },
            "Mom": {
              "zSpread": -13.135,
              "gSpread": -14.0237,
              "yieldWorst": -0.36839,
              "ratingDouble": 0,
              "price": 2.52,
              "spread": 0
            },
            "Ytd": {
              "zSpread": -6.897,
              "gSpread": -7.5074,
              "yieldWorst": -0.41302,
              "ratingDouble": 0,
              "price": 2.813,
              "spread": 0
            },
            "Yoy": {
              "zSpread": -93.451,
              "gSpread": -103.2678,
              "yieldWorst": -2.12377,
              "ratingDouble": 0,
              "price": 14.686,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-02-18T15:31:22.118",
              "user": "PM",
              "value": 170
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "PD",
            "owners": [
              "DJ",
              "PM",
              "PD"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "SOF"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "34329",
            "quantity": 13470000,
            "cs01Cad": 12830.03303967,
            "cs01Local": 12830.03303967
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Axe",
            "bidDealer": "MULT",
            "bidTime": "2020-02-18T13:17:47",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:05:37",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 2050000,
            "totalAxeAskQuantity": 1000000,
            "totalRunBidQuantity": 1000000,
            "totalRunAskQuantity": 1000000,
            "axeSkew": 0.32786885245901637,
            "totalSkew": 0.39603960396039606,
            "bidQuantity": 2000000,
            "bidQuoteValue": 107.25,
            "askQuantity": null,
            "askQuoteValue": 107.625,
            "globalIdentifier": "US88947EAT73"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "CITZ",
            "bidTime": "2020-02-18T13:17:47",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:05:37",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 2050000,
            "totalAxeAskQuantity": 1000000,
            "totalRunBidQuantity": 1000000,
            "totalRunAskQuantity": 1000000,
            "axeSkew": 0.32786885245901637,
            "totalSkew": 0.39603960396039606,
            "bidQuantity": 2000000,
            "bidQuoteValue": 172.91299438476562,
            "askQuantity": null,
            "askQuoteValue": 168.46499633789062,
            "globalIdentifier": "US88947EAT73"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T12:53:57",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:05:37",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 2050000,
            "totalAxeAskQuantity": 1000000,
            "totalRunBidQuantity": 1000000,
            "totalRunAskQuantity": 1000000,
            "axeSkew": 0.32786885245901637,
            "totalSkew": 0.39603960396039606,
            "bidQuantity": null,
            "bidQuoteValue": 3.2799999713897705,
            "askQuantity": null,
            "askQuoteValue": 3.2286899089813232,
            "globalIdentifier": "US88947EAT73"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "34329",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 13470000,
            "cs01Cad": 12830.03303967,
            "cs01Local": 12830.03303967
          }
        ]
      },
      "44632": {
        "securityIdentifier": "44632",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "44632",
          "ccy": "USD",
          "country": "CA",
          "industry": "Aerospace & Defense",
          "name": "BBDBCN 6.0 10/15/2022 Callable USD 144A SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US097751BJ96",
          "obligorName": "BOMBARDIER INC",
          "obligorId": 126,
          "paymentRank": "SR UNSECURED",
          "sector": "Industrials",
          "securitySubType": "Bond",
          "subIndustry": "Aerospace/Defense",
          "ticker": "BBDBCN",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65014",
            "benchmarkName": "T 1.375 01/31/2022 USD",
            "underlyingSecurityId": -1,
            "zSpread": 459.966,
            "gSpread": 460.6897,
            "yieldWorst": 6.01901,
            "amtOutstanding": 1200000000,
            "marketValue": 1199332800,
            "workoutTerm": 2.6685,
            "ratingDouble": 8,
            "isRated": true,
            "rating": "B-",
            "ratingNoNotch": "B",
            "ratingBucket": "HY",
            "price": 99.9444,
            "spread": 458.6295999999999,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -0.813,
              "gSpread": -2.1043,
              "yieldWorst": -0.03578,
              "ratingDouble": 0,
              "price": 0.0868,
              "spread": -1.9818
            },
            "Wow": {
              "zSpread": -3.023,
              "gSpread": -4.5774,
              "yieldWorst": -0.03087,
              "ratingDouble": 0,
              "price": 0.0763,
              "spread": -5.8486
            },
            "Mtd": {
              "zSpread": -84.203,
              "gSpread": -88.3195,
              "yieldWorst": -0.77278,
              "ratingDouble": 0,
              "price": 1.8782,
              "spread": -88.2096
            },
            "Mom": {
              "zSpread": 128.342,
              "gSpread": 97.2305,
              "yieldWorst": 0.83373,
              "ratingDouble": 0,
              "price": -0.2436,
              "spread": 0
            },
            "Ytd": {
              "zSpread": 132.263,
              "gSpread": 97.5642,
              "yieldWorst": 0.82772,
              "ratingDouble": 0,
              "price": -0.2706,
              "spread": 0
            },
            "Yoy": {
              "zSpread": 48.492,
              "gSpread": 39.1497,
              "yieldWorst": -0.66176,
              "ratingDouble": 0,
              "price": 2.1311,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Price",
              "enteredTime": "2020-02-18T13:09:20.694",
              "user": "DJ",
              "value": 100.625
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "TW",
            "owners": [
              "DJ",
              "PM",
              "TW"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Basis"
              ],
              "PortfolioShortName": [
                "SOF"
              ],
              "StrategyName": [
                "Basis"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "44632",
            "quantity": 5000000,
            "cs01Cad": 380.72829,
            "cs01Local": 380.72829
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Axe",
            "bidDealer": "MULT",
            "bidTime": "2020-02-18T13:26:20",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "MULT",
            "askTime": "2020-02-18T13:19:04",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 7000000,
            "totalAxeAskQuantity": 2000000,
            "totalRunBidQuantity": 12000000,
            "totalRunAskQuantity": 12000000,
            "axeSkew": 0.2222222222222222,
            "totalSkew": 0.42424242424242425,
            "bidQuantity": 5000000,
            "bidQuoteValue": 100.5,
            "askQuantity": 7000000,
            "askQuoteValue": 100.75,
            "globalIdentifier": "US097751BJ96"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Axe",
            "bidDealer": "MULT",
            "bidTime": "2020-02-18T13:26:20",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "RBC",
            "askTime": "2020-02-18T13:19:04",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 7000000,
            "totalAxeAskQuantity": 2000000,
            "totalRunBidQuantity": 12000000,
            "totalRunAskQuantity": 12000000,
            "axeSkew": 0.2222222222222222,
            "totalSkew": 0.42424242424242425,
            "bidQuantity": 5000000,
            "bidQuoteValue": 110.94300079345703,
            "askQuantity": 5000000,
            "askQuoteValue": -47.799400329589844,
            "globalIdentifier": "US097751BJ96"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Axe",
            "bidDealer": "CS",
            "bidTime": "2020-02-18T13:26:20",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T12:42:18",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 7000000,
            "totalAxeAskQuantity": 2000000,
            "totalRunBidQuantity": 12000000,
            "totalRunAskQuantity": 12000000,
            "axeSkew": 0.2222222222222222,
            "totalSkew": 0.42424242424242425,
            "bidQuantity": 5000000,
            "bidQuoteValue": 2.6600000858306885,
            "askQuantity": null,
            "askQuoteValue": 1.0608500242233276,
            "globalIdentifier": "US097751BJ96"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "44632",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 5000000,
            "cs01Cad": 380.72829,
            "cs01Local": 380.72829
          }
        ]
      },
      "45119": {
        "securityIdentifier": "45119",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": true,
          "securityIdentifier": "45119",
          "ccy": "EUR",
          "country": "ES",
          "industry": "Industrial Other",
          "name": "ABESM 1.375 05/20/2026 Bullet EUR SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "ES0211845302",
          "obligorName": "ABERTIS INFRAESTRUCTURAS SA",
          "obligorId": 5,
          "paymentRank": "SR UNSECURED",
          "sector": "Industrials",
          "securitySubType": "Bond",
          "subIndustry": "Public Thoroughfares",
          "ticker": "ABESM",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "1975",
            "benchmarkName": "DBR 0.5 02/15/2026 EUR",
            "underlyingSecurityId": -1,
            "zSpread": 120.542,
            "gSpread": 154.8437,
            "yieldWorst": 0.952105,
            "amtOutstanding": 1150000000,
            "marketValue": 1179348000,
            "workoutTerm": 6.2575,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 102.552,
            "spread": 155.6064,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -2.586,
              "gSpread": -3.0835,
              "yieldWorst": -0.029991,
              "ratingDouble": 0,
              "price": 0.182,
              "spread": -3.1185
            },
            "Wow": {
              "zSpread": -3.668,
              "gSpread": -5.5506,
              "yieldWorst": -0.052485,
              "ratingDouble": 0,
              "price": 0.314,
              "spread": 0
            },
            "Mtd": {
              "zSpread": -4.256,
              "gSpread": -6.7778,
              "yieldWorst": -0.041674,
              "ratingDouble": 0,
              "price": 0.24,
              "spread": 0
            },
            "Mom": {
              "zSpread": -25.247,
              "gSpread": -27.1504,
              "yieldWorst": -0.421605,
              "ratingDouble": 0,
              "price": 2.546,
              "spread": 0
            },
            "Ytd": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": 0,
              "ratingDouble": -1,
              "price": 0.365,
              "spread": 0
            },
            "Yoy": {
              "zSpread": -55.643,
              "gSpread": -76.4463,
              "yieldWorst": -1.173255,
              "ratingDouble": 0,
              "price": 7.5453,
              "spread": 0
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 151
            },
            "primaryPmName": "RS",
            "backupPmName": "DA",
            "researchName": "TW",
            "owners": [
              "RS",
              "DA",
              "TW"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "BARC DOF PB",
                "BARC SOF PB"
              ],
              "AttributionOwner": [
                "European Term Risk"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "45119",
            "quantity": 3500000,
            "cs01Cad": 3107.8086585,
            "cs01Local": 3107.8086585
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "NATX",
            "bidTime": "2020-02-18T12:32:45",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "BAML",
            "askTime": "2020-02-18T11:44:07",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3700000,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 1,
            "totalSkew": 1,
            "bidQuantity": null,
            "bidQuoteValue": 102.44999694824219,
            "askQuantity": 3700000,
            "askQuoteValue": 102.94999694824219,
            "globalIdentifier": "ES0211845302"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "NATX",
            "bidTime": "2020-02-18T12:32:45",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "BAML",
            "askTime": "2020-02-18T11:44:07",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3700000,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 1,
            "totalSkew": 1,
            "bidQuantity": null,
            "bidQuoteValue": 158,
            "askQuantity": 3700000,
            "askQuoteValue": 150,
            "globalIdentifier": "ES0211845302"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "NATX",
            "bidTime": "2020-02-18T12:32:45",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Axe",
            "askDealer": "BAML",
            "askTime": "2020-02-18T11:44:07",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 3700000,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 1,
            "totalSkew": 1,
            "bidQuantity": null,
            "bidQuoteValue": 0.9700000286102295,
            "askQuantity": 3700000,
            "askQuoteValue": 0.8899999856948853,
            "globalIdentifier": "ES0211845302"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "45119",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 2000000,
            "cs01Cad": 1775.890662,
            "cs01Local": 1775.890662
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "45119",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 1500000,
            "cs01Cad": 1331.9179965,
            "cs01Local": 1331.9179965
          }
        ]
      },
      "59595": {
        "securityIdentifier": "59595",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "59595",
          "ccy": "USD",
          "country": "US",
          "industry": "Financial Services",
          "name": "CITADL 4.875 01/15/2027 Callable USD REGS SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "USU1569XAB11",
          "obligorName": "CITADEL LP",
          "obligorId": 1807,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Invest Mgmnt/Advis Serv",
          "ticker": "CITADL",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65247",
            "benchmarkName": "T 1.5 01/31/2027 USD",
            "underlyingSecurityId": -1,
            "zSpread": 209.008,
            "gSpread": 203.3234,
            "yieldWorst": 3.53148,
            "amtOutstanding": 500000000,
            "marketValue": 540110000,
            "workoutTerm": 6.7562,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 108.022,
            "spread": 202.15000000000003,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -0.484,
              "gSpread": -0.5313,
              "yieldWorst": -0.03573,
              "ratingDouble": 0,
              "price": 0.219,
              "spread": -0.4952
            },
            "Wow": {
              "zSpread": -15.825,
              "gSpread": -16.0541,
              "yieldWorst": -0.157,
              "ratingDouble": 0,
              "price": 0.951,
              "spread": -15.9947
            },
            "Mtd": {
              "zSpread": -12.081,
              "gSpread": -13.0623,
              "yieldWorst": -0.04154,
              "ratingDouble": 0,
              "price": 0.214,
              "spread": -13.5548
            },
            "Mom": {
              "zSpread": -14.344,
              "gSpread": -15.2024,
              "yieldWorst": -0.37608,
              "ratingDouble": 0,
              "price": 2.267,
              "spread": -15.6526
            },
            "Ytd": {
              "zSpread": -14.498,
              "gSpread": -15.6795,
              "yieldWorst": -0.48191,
              "ratingDouble": 0,
              "price": 2.892,
              "spread": -15.9228
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 201
            },
            "primaryPmName": "DM",
            "backupPmName": "DA",
            "researchName": "LP",
            "owners": [
              "DM",
              "DA",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "NT AGB CUSTODY",
                "TD DOF PB",
                "TD SOF PB",
                "NT STIP CUSTODY"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "AGB",
                "DOF",
                "SOF",
                "STIP"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59595",
            "quantity": 16081000,
            "cs01Cad": 13448.910870564,
            "cs01Local": 13448.910870564
          },
          "securityType": "Bond"
        },
        "bestQuotes": null,
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59595",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "AGB",
              "StrategyName": ""
            },
            "quantity": 480000,
            "cs01Cad": 401.43506112,
            "cs01Local": 401.43506112
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59595",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 8396000,
            "cs01Cad": 7021.768277423999,
            "cs01Local": 7021.768277423999
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59595",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 3865000,
            "cs01Cad": 3232.38856506,
            "cs01Local": 3232.38856506
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59595",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "STIP",
              "StrategyName": ""
            },
            "quantity": 3340000,
            "cs01Cad": 2793.31896696,
            "cs01Local": 2793.31896696
          }
        ]
      },
      "59596": {
        "securityIdentifier": "59596",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "59596",
          "ccy": "USD",
          "country": "US",
          "industry": "Financial Services",
          "name": "CITADL 4.875 01/15/2027 Callable USD 144A SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US17288XAB01",
          "obligorName": "CITADEL LP",
          "obligorId": 1807,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Invest Mgmnt/Advis Serv",
          "ticker": "CITADL",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "65247",
            "benchmarkName": "T 1.5 01/31/2027 USD",
            "underlyingSecurityId": -1,
            "zSpread": 211.898,
            "gSpread": 206.2134,
            "yieldWorst": 3.56038,
            "amtOutstanding": 500000000,
            "marketValue": 539215000,
            "workoutTerm": 6.7562,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 107.843,
            "spread": 205.04000000000002,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 1.013,
              "gSpread": 0.9647,
              "yieldWorst": -0.02077,
              "ratingDouble": 0,
              "price": 0.126,
              "spread": 1.0008
            },
            "Wow": {
              "zSpread": -12.435,
              "gSpread": -12.6631,
              "yieldWorst": -0.12309,
              "ratingDouble": 0,
              "price": 0.741,
              "spread": -12.6102
            },
            "Mtd": {
              "zSpread": -10.938,
              "gSpread": -11.9183,
              "yieldWorst": -0.0301,
              "ratingDouble": 0,
              "price": 0.144,
              "spread": -12.4174
            },
            "Mom": {
              "zSpread": -15.116,
              "gSpread": -15.9744,
              "yieldWorst": -0.3838,
              "ratingDouble": 0,
              "price": 2.313,
              "spread": -16.4246
            },
            "Ytd": {
              "zSpread": -15.931,
              "gSpread": -17.1125,
              "yieldWorst": -0.49624,
              "ratingDouble": 0,
              "price": 2.977,
              "spread": -17.3558
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 201
            },
            "primaryPmName": "DM",
            "backupPmName": "DA",
            "researchName": "LP",
            "owners": [
              "DM",
              "DA",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB",
                "NT STIP CUSTODY"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF",
                "STIP"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59596",
            "quantity": 5426000,
            "cs01Cad": 4538.048437108,
            "cs01Local": 4538.048437108
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "GS",
            "bidTime": "2020-02-18T13:02:10",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T13:02:10",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 107.40599822998047,
            "askQuantity": null,
            "askQuoteValue": 107.83699798583984,
            "globalIdentifier": "US17288XAB01"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "GS",
            "bidTime": "2020-02-18T13:02:10",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T13:02:10",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 215,
            "askQuantity": null,
            "askQuoteValue": 205,
            "globalIdentifier": "US17288XAB01"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "GS",
            "bidTime": "2020-02-18T13:02:10",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "GS",
            "askTime": "2020-02-18T13:02:10",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 3.6264500617980957,
            "askQuantity": null,
            "askQuoteValue": 3.556529998779297,
            "globalIdentifier": "US17288XAB01"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59596",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 2501000,
            "cs01Cad": 2091.7174974580003,
            "cs01Local": 2091.7174974580003
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59596",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 2025000,
            "cs01Cad": 1693.61372745,
            "cs01Local": 1693.61372745
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "59596",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "STIP",
              "StrategyName": ""
            },
            "quantity": 900000,
            "cs01Cad": 752.7172122000001,
            "cs01Local": 752.7172122000001
          }
        ]
      },
      "60069": {
        "securityIdentifier": "60069",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "60069",
          "ccy": "USD",
          "country": "US",
          "industry": "Real Estate",
          "name": "HST 3.375 12/15/2029 Callable USD H SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US44107TAY29",
          "obligorName": "HOST HOTELS & RESORTS LP",
          "obligorId": 386,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "REITS-Hotels",
          "ticker": "HST",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "63070",
            "benchmarkName": "T 1.75 11/15/2029 USD",
            "underlyingSecurityId": -1,
            "zSpread": 145.395,
            "gSpread": 138.5072,
            "yieldWorst": 2.96835,
            "amtOutstanding": 650000000,
            "marketValue": 671879000,
            "workoutTerm": 9.8411,
            "ratingDouble": 14,
            "isRated": true,
            "rating": "BBB-",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 103.366,
            "spread": 137.4853,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -0.77,
              "gSpread": -1.0012,
              "yieldWorst": -0.0409,
              "ratingDouble": 0,
              "price": 0.343,
              "spread": -1.1806
            },
            "Wow": {
              "zSpread": -2.955,
              "gSpread": -2.7428,
              "yieldWorst": -0.02936,
              "ratingDouble": 0,
              "price": 0.241,
              "spread": -3.7774
            },
            "Mtd": {
              "zSpread": -3.704,
              "gSpread": -4.2114,
              "yieldWorst": 0.03235,
              "ratingDouble": 0,
              "price": -0.288,
              "spread": -5.2848
            },
            "Mom": {
              "zSpread": 4.1,
              "gSpread": 2.6462,
              "yieldWorst": -0.20273,
              "ratingDouble": 0,
              "price": 1.679,
              "spread": 1.5468
            },
            "Ytd": {
              "zSpread": 5.147,
              "gSpread": 3.4273,
              "yieldWorst": -0.30113,
              "ratingDouble": 0,
              "price": 2.494,
              "spread": 2.3271
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 139
            },
            "primaryPmName": "DA",
            "backupPmName": "IL",
            "researchName": "PD",
            "owners": [
              "DA",
              "IL",
              "PD"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Basis"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Basis"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "60069",
            "quantity": 13393000,
            "cs01Cad": 15247.93746436,
            "cs01Local": 15247.93746436
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "SUMR",
            "bidTime": "2020-02-18T13:30:41",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askTime": "2020-02-18T13:23:32",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 6000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": null,
            "totalSkew": 0.25,
            "bidQuantity": 2000000,
            "bidQuoteValue": 103.73999786376953,
            "askQuantity": null,
            "askQuoteValue": 103.69999694824219,
            "globalIdentifier": "US44107TAY29"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "SUMR",
            "bidTime": "2020-02-18T13:30:41",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askTime": "2020-02-18T13:23:32",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 6000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": null,
            "totalSkew": 0.25,
            "bidQuantity": 2000000,
            "bidQuoteValue": 137,
            "askQuantity": null,
            "askQuoteValue": 138,
            "globalIdentifier": "US44107TAY29"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "SUMR",
            "bidTime": "2020-02-18T13:30:41",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askTime": "2020-02-18T13:23:32",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 6000000,
            "totalRunAskQuantity": 2000000,
            "axeSkew": null,
            "totalSkew": 0.25,
            "bidQuantity": 2000000,
            "bidQuoteValue": 2.9240000247955322,
            "askQuantity": null,
            "askQuoteValue": 2.9287800788879395,
            "globalIdentifier": "US44107TAY29"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "60069",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 11965000,
            "cs01Cad": 13622.1587218,
            "cs01Local": 13622.1587218
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "60069",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": 1428000,
            "cs01Cad": 1625.77874256,
            "cs01Local": 1625.77874256
          }
        ]
      },
      "60101": {
        "securityIdentifier": "60101",
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": true,
          "securityIdentifier": "60101",
          "ccy": "USD",
          "country": "IT",
          "industry": "Banks",
          "name": "ISPIM 4.0 09/23/2029 Bullet USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US46115HBL06",
          "obligorName": "INTESA SANPAOLO SPA",
          "obligorId": 685,
          "paymentRank": "SR PREFERRED",
          "sector": "Financials",
          "securitySubType": "Bond",
          "subIndustry": "Commer Banks Non-US",
          "ticker": "ISPIM",
          "metrics": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isOnTheRun": true,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": "63070",
            "benchmarkName": "T 1.75 11/15/2029 USD",
            "underlyingSecurityId": -1,
            "zSpread": 156.184,
            "gSpread": 149.5905,
            "yieldWorst": 3.07478,
            "amtOutstanding": 750000000,
            "marketValue": 807262500,
            "workoutTerm": 9.6137,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 107.635,
            "spread": 148.08370000000002,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -5.32,
              "gSpread": -5.523,
              "yieldWorst": -0.08633,
              "ratingDouble": 0,
              "price": 0.74,
              "spread": -5.7432
            },
            "Wow": {
              "zSpread": -8.885,
              "gSpread": -8.688,
              "yieldWorst": -0.08869,
              "ratingDouble": 0,
              "price": 0.748,
              "spread": -9.7801
            },
            "Mtd": {
              "zSpread": -33.533,
              "gSpread": -34.1042,
              "yieldWorst": -0.26592,
              "ratingDouble": 0,
              "price": 2.244,
              "spread": -35.211
            },
            "Mom": {
              "zSpread": -43.37,
              "gSpread": -44.7866,
              "yieldWorst": -0.677,
              "ratingDouble": 0,
              "price": 5.639,
              "spread": -45.9574
            },
            "Ytd": {
              "zSpread": -38.387,
              "gSpread": -39.9469,
              "yieldWorst": -0.73572,
              "ratingDouble": 0,
              "price": 6.112,
              "spread": 0
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 145
            },
            "primaryPmName": "DM",
            "backupPmName": "RS",
            "researchName": "LP",
            "owners": [
              "DM",
              "RS",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "DOF"
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "60101",
            "quantity": 10000000,
            "cs01Cad": 11543.39826,
            "cs01Local": 11543.39826
          },
          "securityType": "Bond"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isValid": true,
            "quoteMetric": "Price",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:01:44",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CS",
            "askTime": "2020-02-18T13:34:41",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 4890000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 108.11000061035156,
            "askQuantity": null,
            "askQuoteValue": 107.9000015258789,
            "globalIdentifier": "US46115HBL06"
          },
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:01:44",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CS",
            "askTime": "2020-02-18T13:34:41",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 4890000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 147,
            "askQuantity": null,
            "askQuoteValue": 149,
            "globalIdentifier": "US46115HBL06"
          },
          "bestYieldQuote": {
            "isValid": true,
            "quoteMetric": "Yield",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T13:01:44",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CS",
            "askTime": "2020-02-18T13:34:41",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 4890000,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": 0,
            "totalSkew": 0,
            "bidQuantity": null,
            "bidQuoteValue": 3.0195400714874268,
            "askQuantity": null,
            "askQuoteValue": 3.04082989692688,
            "globalIdentifier": "US46115HBL06"
          }
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "60101",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": 10000000,
            "cs01Cad": 11543.39826,
            "cs01Local": 11543.39826
          }
        ]
      },
      "773|5Y": {
        "securityIdentifier": "773|5Y",
        "security": {
          "curveSubType": "XR14",
          "securityIdentifier": "773|5Y",
          "ccy": "USD",
          "country": "US",
          "industry": "Homebuilders",
          "name": "MDC CDS USD SR 5Y",
          "genericSeniority": "SR",
          "globalIdentifier": "MDC CDS USD SR 5Y",
          "obligorName": "MDC HOLDINGS INC",
          "obligorId": 511,
          "paymentRank": "SR UNSECURED",
          "sector": "Consumer Discretionary",
          "securitySubType": null,
          "subIndustry": "Bldg-Residential/Commer",
          "ticker": "MDC",
          "metrics": {
            "isOnTheRun": true,
            "workoutTerm": 4.8411,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 0,
            "spread": 52,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "ratingDouble": 0,
              "price": 0,
              "spread": -2
            },
            "Wow": {
              "ratingDouble": 0,
              "price": 0,
              "spread": -1
            },
            "Mtd": {
              "ratingDouble": 0,
              "price": 0,
              "spread": -3
            },
            "Mom": {
              "ratingDouble": 0,
              "price": 0,
              "spread": -8
            },
            "Ytd": {
              "ratingDouble": 0,
              "price": 0,
              "spread": -18
            },
            "Yoy": {
              "ratingDouble": 0,
              "price": 0,
              "spread": -109.5
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 55
            },
            "primaryPmName": "DA",
            "backupPmName": "IL",
            "researchName": "PD",
            "owners": [
              "DA",
              "IL",
              "PD"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "Basis"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Basis"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "773|5Y",
            "quantity": -39000000,
            "cs01Cad": -24351.238335000002,
            "cs01Local": -24351.238335000002
          },
          "securityType": "Cds"
        },
        "bestQuotes": {
          "bestPriceQuote": null,
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "BNP",
            "bidTime": "2020-02-18T13:29:24",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "BNP",
            "askTime": "2020-02-18T13:29:24",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 49,
            "askQuantity": null,
            "askQuoteValue": 56,
            "globalIdentifier": "MDC CDS USD SR 5Y D14"
          },
          "bestYieldQuote": null
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "773|5Y",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": -15500000,
            "cs01Cad": -9678.113335,
            "cs01Local": -9678.113335
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "773|5Y",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": -23500000,
            "cs01Cad": -14673.124999999996,
            "cs01Local": -14673.124999999996
          }
        ]
      },
      "784|4.3Y": {
        "securityIdentifier": "784|4.3Y",
        "security": {
          "curveSubType": "XR14",
          "securityIdentifier": "784|4.3Y",
          "ccy": "USD",
          "country": "US",
          "industry": "Consumer Finance",
          "name": "MGIC CDS USD SR 06/20/2024",
          "genericSeniority": "SR",
          "globalIdentifier": "MGIC CDS USD SR 4Y",
          "obligorName": "MGIC INVESTMENT CORP",
          "obligorId": 522,
          "paymentRank": "SR UNSECURED",
          "sector": "Financials",
          "securitySubType": null,
          "subIndustry": "Financial Guarantee Ins",
          "ticker": "MGIC",
          "metrics": {
            "isOnTheRun": false,
            "workoutTerm": 4.3507,
            "ratingDouble": 13,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 119.161,
            "spread": 43.84,
            "isIndex": false
          },
          "deltaMetrics": {
            "Dod": {
              "ratingDouble": 0,
              "price": -0.011,
              "spread": 0
            },
            "Wow": {
              "ratingDouble": 0,
              "price": -0.09,
              "spread": 0
            },
            "Mtd": {
              "ratingDouble": 0,
              "price": -0.106,
              "spread": -2.02
            },
            "Mom": {
              "ratingDouble": 0,
              "price": -0.375,
              "spread": 2.01
            },
            "Ytd": {
              "ratingDouble": 0,
              "price": -0.506,
              "spread": 2.01
            },
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 43.84
            },
            "primaryPmName": "PM",
            "backupPmName": "DJ",
            "researchName": "LP",
            "owners": [
              "PM",
              "DJ",
              "LP"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "USD Term Risk",
                "Basis"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Portfolio Shorts",
                "Basis"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "784|4.3Y",
            "quantity": -28000000,
            "cs01Cad": -18100.17,
            "cs01Local": -18100.17
          },
          "securityType": "Cds"
        },
        "bestQuotes": null,
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "784|4.3Y",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": -12500000,
            "cs01Cad": -8080.38,
            "cs01Local": -8080.38
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "784|4.3Y",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": -15500000,
            "cs01Cad": -10019.79,
            "cs01Local": -10019.79
          }
        ]
      },
      "1228|5Y": {
        "securityIdentifier": "1228|5Y",
        "security": {
          "curveSubType": "XR14",
          "securityIdentifier": "1228|5Y",
          "ccy": "USD",
          "country": "US",
          "industry": "Wireless Telecommunications Services",
          "name": "TMUS A CDS USD SR 5Y",
          "genericSeniority": "SR",
          "globalIdentifier": "TMUS A CDS USD SR 5Y",
          "obligorName": "T-MOBILE US INC",
          "obligorId": 1924,
          "paymentRank": "SR UNSECURED",
          "sector": "Communications",
          "securitySubType": null,
          "subIndustry": "Cellular Telecom",
          "ticker": "TMUS A",
          "metrics": {
            "isOnTheRun": true,
            "workoutTerm": 4.8521,
            "ratingDouble": 12.67,
            "isRated": true,
            "rating": "BB+",
            "ratingNoNotch": "BB",
            "ratingBucket": "HY",
            "price": 119.478,
            "spread": 76.5,
            "isIndex": false
          },
          "deltaMetrics": {
            "Dod": {
              "ratingDouble": 0,
              "price": -0.01,
              "spread": 0
            },
            "Wow": {
              "ratingDouble": 0,
              "price": -0.245,
              "spread": 3
            },
            "Mtd": {
              "ratingDouble": 0,
              "price": -0.142,
              "spread": -1
            },
            "Mom": null,
            "Ytd": null,
            "Yoy": null
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-02-18T18:05:29",
              "user": "PM",
              "value": 74.50000000000001
            },
            "primaryPmName": "PM",
            "backupPmName": "DJ",
            "researchName": "LC",
            "owners": [
              "PM",
              "DJ",
              "LC"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "TD DOF PB",
                "TD SOF PB"
              ],
              "AttributionOwner": [
                "USD Term Risk"
              ],
              "PortfolioShortName": [
                "DOF",
                "SOF"
              ],
              "StrategyName": [
                "Portfolio Shorts"
              ]
            },
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "1228|5Y",
            "quantity": -24000000,
            "cs01Cad": -17062.665289,
            "cs01Local": -17062.665289
          },
          "securityType": "Cds"
        },
        "bestQuotes": {
          "bestPriceQuote": null,
          "bestSpreadQuote": {
            "isValid": true,
            "quoteMetric": "Spread",
            "bidQuoteType": "Run",
            "bidDealer": "CG",
            "bidTime": "2020-02-18T12:50:07",
            "bidVenue": "MSG1",
            "bidIsOld": false,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askTime": "2020-02-18T12:50:07",
            "askVenue": "MSG1",
            "askIsOld": false,
            "isOffTheRunCds": false,
            "totalAxeBidQuantity": 0,
            "totalAxeAskQuantity": 0,
            "totalRunBidQuantity": 0,
            "totalRunAskQuantity": 0,
            "axeSkew": null,
            "totalSkew": null,
            "bidQuantity": null,
            "bidQuoteValue": 65,
            "askQuantity": null,
            "askQuoteValue": 75,
            "globalIdentifier": "TMUS A CDS USD SR 5Y D14"
          },
          "bestYieldQuote": null
        },
        "positions": [
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "1228|5Y",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "DOF",
              "StrategyName": ""
            },
            "quantity": -11430000,
            "cs01Cad": -8126.108995070001,
            "cs01Local": -8126.108995070001
          },
          {
            "date": "2020-02-18T00:00:00-05:00",
            "securityIdentifier": "1228|5Y",
            "partitionOptionValue": {
              "AccountName": "",
              "AttributionOwner": "",
              "PortfolioShortName": "SOF",
              "StrategyName": ""
            },
            "quantity": -12570000,
            "cs01Cad": -8936.55629393,
            "cs01Local": -8936.55629393
          }
        ]
      }
    }
  }
}