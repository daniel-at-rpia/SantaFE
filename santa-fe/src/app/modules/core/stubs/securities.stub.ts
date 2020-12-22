import { BEFetchAllTradeDataReturn } from 'BEModels/backend-models.interface';
import { BESecurityDTO } from 'BEModels/backend-models.interface';

export const PortfolioList: BEFetchAllTradeDataReturn = {
    "numberOfSecurities": 2,
    "securityDtos": {
        "groupIdentifier": {
            "source": "Default",
            "date": "2020-12-21T00:00:00-05:00",
            "groupOptionValues": {},
            "groupFilters": {
                "SecurityIdentifier": [
                    "17163",
                    "338|5Y"
                ]
            }
        },
        "securityDtos": {
            "17163": {
                "securityIdentifier": "17163",
                "security": {
                    "securityIdentifier": "17163",
                    "metrics": {
                        "BB": {
                            "isFixedForLife": true,
                            "isFixedToFloatInFixed": false,
                            "isFloat": false,
                            "isNewIssue": false,
                            "benchmarkSecurityIdentifier": null,
                            "benchmarkName": null,
                            "underlyingSecurityId": -1,
                            "yieldWorst": 3.22264,
                            "tenor": "2Y",
                            "amtOutstanding": 500000000.0,
                            "marketValue": 518591110.0,
                            "workoutTerm": 1.161644,
                            "ratingDouble": 11.0,
                            "isRated": true,
                            "rating": "BB-",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": 101.996,
                            "spread": 306.191
                        },
                        "Default": {
                            "isFixedForLife": true,
                            "isFixedToFloatInFixed": false,
                            "isFloat": false,
                            "isNewIssue": false,
                            "benchmarkSecurityIdentifier": "96926",
                            "benchmarkName": "T 0.125 11/30/2022 USD",
                            "underlyingSecurityId": -1,
                            "yieldWorst": 2.900518,
                            "tenor": "2Y",
                            "amtOutstanding": 500000000.0,
                            "marketValue": 518591110.0,
                            "workoutTerm": 1.161644,
                            "ratingDouble": 11.0,
                            "isRated": true,
                            "rating": "BB-",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": 102.34375,
                            "spread": 278.3065
                        }
                    },
                    "deltaMetrics": {
                        "Dod": {
                            "yieldWorst": 0.034538,
                            "ratingDouble": 0.0,
                            "price": -0.046875,
                            "spread": 3.7745
                        },
                        "Wow": {
                            "yieldWorst": -0.349447,
                            "ratingDouble": 0.0,
                            "price": 0.385417,
                            "spread": -36.732
                        },
                        "Mtd": {
                            "yieldWorst": -0.484525,
                            "ratingDouble": -0.5,
                            "price": 0.458036,
                            "spread": -45.3955
                        },
                        "Mom": {
                            "yieldWorst": -1.043516,
                            "ratingDouble": -0.5,
                            "price": 1.09375,
                            "spread": -99.7985
                        },
                        "Ytd": null,
                        "Yoy": null
                    },
                    "ccy": "USD",
                    "obligorId": 6149,
                    "obligorName": "SERVICE PROPERTIES TRUST",
                    "country": "United States America",
                    "sector": "Real Estate",
                    "industry": "REITS",
                    "subIndustry": "REITS-Hotels",
                    "bicsCode": "15101112",
                    "bicsLevel1": "Real Estate",
                    "bicsLevel2": "Real Estate",
                    "bicsLevel3": "REIT",
                    "bicsLevel4": "Hotel REIT",
                    "name": "SVC 5 08/15/2022 USD SENIOR_UNSECURED",
                    "genericSeniority": "SR",
                    "globalIdentifier": "US44106MAQ50",
                    "paymentRank": "SR UNSECURED",
                    "securitySubType": "Bond",
                    "ticker": "SVC",
                    "unitPosition": null,
                    "securityType": "Bond",
                    "maturityType": "Callable"
                },
                "bestQuotes": {
                    "bestPriceQuote": {
                        "isOffTheRunCds": false,
                        "quoteMetric": "Price",
                        "totalActiveAxeBidQuantity": 0.0,
                        "totalActiveAxeAskQuantity": 0.0,
                        "totalActiveBidQuantity": 2000000.0,
                        "totalActiveAskQuantity": 0.0,
                        "axeSkew": null,
                        "totalSkew": 0.0,
                        "bestBidQuoteCondition": null,
                        "bidQuoteType": "Run",
                        "bidDealer": "SEAP",
                        "bidQuoteValue": 102.0,
                        "bidTime": "2020-12-21T14:30:03",
                        "bidIsOld": false,
                        "bestAskQuoteCondition": null,
                        "askQuoteType": "Run",
                        "askDealer": "BARC",
                        "askQuoteValue": 102.5,
                        "askTime": "2020-12-21T13:24:32",
                        "askIsOld": false,
                        "bidAxeDealer": "RWPC",
                        "bidAxeQuoteValue": 101.625,
                        "bidAxeTime": "2020-12-21T07:39:52",
                        "bidAxeIsOld": true,
                        "askAxeDealer": "RWPC",
                        "askAxeQuoteValue": 102.375,
                        "askAxeTime": "2020-12-21T07:39:52",
                        "askAxeIsOld": true,
                        "globalIdentifier": "US44106MAQ50"
                    },
                    "bestSpreadQuote": {
                        "isOffTheRunCds": false,
                        "quoteMetric": "Spread",
                        "totalActiveAxeBidQuantity": 0.0,
                        "totalActiveAxeAskQuantity": 0.0,
                        "totalActiveBidQuantity": 2000000.0,
                        "totalActiveAskQuantity": 0.0,
                        "axeSkew": null,
                        "totalSkew": 0.0,
                        "bestBidQuoteCondition": null,
                        "bidQuoteType": "Run",
                        "bidDealer": "SEAP",
                        "bidQuoteValue": 308.7669982910156,
                        "bidTime": "2020-12-21T14:30:03",
                        "bidIsOld": false,
                        "bestAskQuoteCondition": null,
                        "askQuoteType": "Run",
                        "askDealer": "BARC",
                        "askQuoteValue": 264.1650085449219,
                        "askTime": "2020-12-21T13:24:32",
                        "askIsOld": false,
                        "bidAxeDealer": "RWPC",
                        "bidAxeQuoteValue": 341.7690124511719,
                        "bidAxeTime": "2020-12-21T07:39:52",
                        "bidAxeIsOld": true,
                        "askAxeDealer": "RWPC",
                        "askAxeQuoteValue": 275.739990234375,
                        "askAxeTime": "2020-12-21T07:39:52",
                        "askAxeIsOld": true,
                        "globalIdentifier": "US44106MAQ50"
                    },
                    "bestYieldQuote": {
                        "isOffTheRunCds": false,
                        "quoteMetric": "Yield",
                        "totalActiveAxeBidQuantity": 0.0,
                        "totalActiveAxeAskQuantity": 0.0,
                        "totalActiveBidQuantity": 2000000.0,
                        "totalActiveAskQuantity": 0.0,
                        "axeSkew": null,
                        "totalSkew": 0.0,
                        "bestBidQuoteCondition": null,
                        "bidQuoteType": "Run",
                        "bidDealer": "SEAP",
                        "bidQuoteValue": 3.203000068664551,
                        "bidTime": "2020-12-21T14:30:03",
                        "bidIsOld": false,
                        "bestAskQuoteCondition": null,
                        "askQuoteType": "Run",
                        "askDealer": "BARC",
                        "askQuoteValue": 2.759999990463257,
                        "askTime": "2020-12-21T13:24:32",
                        "askIsOld": false,
                        "bidAxeDealer": "RWPC",
                        "bidAxeQuoteValue": 3.534630060195923,
                        "bidAxeTime": "2020-12-21T07:39:52",
                        "bidAxeIsOld": true,
                        "askAxeDealer": "RWPC",
                        "askAxeQuoteValue": 2.8723199367523193,
                        "askAxeTime": "2020-12-21T07:39:52",
                        "askAxeIsOld": true,
                        "globalIdentifier": "US44106MAQ50"
                    }
                },
                "positions": null,
                "lastTracePrice": null,
                "lastTraceSpread": null,
                "lastTraceVolumeEstimated": null,
                "lastTraceVolumeReported": null
            },
            "338|5Y": {
                "securityIdentifier": "338|5Y",
                "security": {
                    "curveSubType": "XR14",
                    "securityIdentifier": "338|5Y",
                    "metrics": {
                        "FO": {
                            "workoutTerm": 5.0,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": 101.961,
                            "spread": 60.06
                        },
                        "BB": {
                            "workoutTerm": 5.0082,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": null,
                            "spread": null
                        },
                        "Default": {
                            "workoutTerm": 5.0,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": null,
                            "spread": null
                        }
                    },
                    "deltaMetrics": {
                        "Dod": {
                            "ratingDouble": 0.0,
                            "price": null,
                            "spread": null
                        },
                        "Wow": {
                            "ratingDouble": 0.0,
                            "price": null,
                            "spread": null
                        },
                        "Mtd": {
                            "ratingDouble": 0.0,
                            "price": null,
                            "spread": null
                        },
                        "Mom": {
                            "ratingDouble": 0.0,
                            "price": null,
                            "spread": null
                        },
                        "Ytd": null,
                        "Yoy": null
                    },
                    "ccy": "USD",
                    "obligorId": 120,
                    "obligorName": "BALL CORP",
                    "country": "United States America",
                    "sector": "Basic Materials",
                    "industry": "Packaging&Containers",
                    "subIndustry": "Containers-Metal/Glass",
                    "bicsCode": "18101210",
                    "bicsLevel1": "Materials",
                    "bicsLevel2": "Materials",
                    "bicsLevel3": "Containers & Packaging",
                    "bicsLevel4": "Containers & Packaging",
                    "name": "BLL CDS USD SR 5Y",
                    "genericSeniority": "SR",
                    "globalIdentifier": "BLL CDS USD SR 5Y",
                    "paymentRank": "SR UNSECURED",
                    "securitySubType": null,
                    "ticker": "BLL",
                    "unitPosition": {
                        "securityIdentifier": "338|5Y",
                        "partitionOptionValues": {
                            "PortfolioShortName": [
                                "DOF",
                                "SOF",
                                ""
                            ],
                            "StrategyName": [
                                "Portfolio Shorts",
                                ""
                            ]
                        },
                        "strategyAsOfDate": "2020-12-18T00:00:00",
                        "mark": {
                            "driver": "Spread",
                            "enteredTime": "2020-12-21T00:00:00-05:00",
                            "user": null,
                            "value": 60.06,
                            "spread": 60.06,
                            "price": 101.961,
                            "yield": 0.6006
                        },
                        "hedgeFactor": 1.0,
                        "strategies": [
                            "Portfolio Shorts",
                            ""
                        ],
                        "owners": [
                            "DJ",
                            "PM",
                            "TW"
                        ],
                        "primaryPmName": "DJ",
                        "backupPmName": "PM",
                        "researchName": "TW"
                    },
                    "securityType": "Cds",
                    "maturityType": "Bullet"
                },
                "bestQuotes": null,
                "positions": [
                    {
                        "source": "FO",
                        "partitionOptionValues": {
                            "PortfolioShortName": "DOF",
                            "StrategyName": "Portfolio Shorts"
                        },
                        "trades": [
                            {
                                "partitionOptionValue": {
                                    "PortfolioShortName": "DOF",
                                    "StrategyName": "Portfolio Shorts"
                                },
                                "tradeId": "79070-9/14/2020-DOF-Portfolio Shorts-85.500000",
                                "parentTradeId": "79070-9/14/2020-DOF-Portfolio Shorts-85.500000",
                                "trader": null,
                                "quantity": -5500000.0,
                                "tradeDateTime": "2020-09-14T00:00:00",
                                "price": 0.0,
                                "counterpartyName": "GS ISDA",
                                "spread": 85.5,
                                "isCancelled": false,
                                "quantityAfterTrade": -5500000.0,
                                "wgtAvgSpread": 85.5,
                                "wgtAvgPrice": 0.0,
                                "isValid": false
                            }
                        ],
                        "quantity": -5500000.0,
                        "cs01Cad": -3535.5400025,
                        "cs01Local": -2751.8212970890413
                    },
                    {
                        "source": "FO",
                        "partitionOptionValues": {
                            "PortfolioShortName": "SOF",
                            "StrategyName": "Portfolio Shorts"
                        },
                        "trades": [
                            {
                                "partitionOptionValue": {
                                    "PortfolioShortName": "SOF",
                                    "StrategyName": "Portfolio Shorts"
                                },
                                "tradeId": "79070-9/14/2020-SOF-Portfolio Shorts-85.500000",
                                "parentTradeId": "79070-9/14/2020-SOF-Portfolio Shorts-85.500000",
                                "trader": null,
                                "quantity": -3000000.0,
                                "tradeDateTime": "2020-09-14T00:00:00",
                                "price": 0.0,
                                "counterpartyName": "GS ISDA",
                                "spread": 85.5,
                                "isCancelled": false,
                                "quantityAfterTrade": -3000000.0,
                                "wgtAvgSpread": 85.5,
                                "wgtAvgPrice": 0.0,
                                "isValid": false
                            }
                        ],
                        "quantity": -3000000.0,
                        "cs01Cad": -1928.476365,
                        "cs01Local": -1500.9934347758408
                    }
                ],
                "lastTracePrice": null,
                "lastTraceSpread": null,
                "lastTraceVolumeEstimated": null,
                "lastTraceVolumeReported": null
            }
        }
    }
}

export const CompactSecuritySample: BESecurityDTO = PortfolioList.securityDtos.securityDtos['17163'].security;

export const SeniorityLegendList: Array<BESecurityDTO> = [
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"Secured",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"Sr Preferred",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"SLA",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SLA",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"Subordinated",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  }
];

export const RatingLegendList: Array<BESecurityDTO> = [
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"AAA",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"A",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name": "",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"BBB",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SLA",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"BB",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"CCC",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
    "metrics":{
      "Default":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "yieldWorst":null,
        "amtOutstanding":800000000,
        "marketValue":885715240,
        "workoutTerm":4.5644,
        "ratingDouble":16,
        "isRated":true,
        "rating":"BBB+",
        "ratingNoNotch":"NR",
        "ratingBucket":"IG",
        "price":null,
        "spread":null
      }
    },
    "deltaMetrics":{
      "Dod":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Wow":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mtd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Mom":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Ytd":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      },
      "Yoy":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  }
]