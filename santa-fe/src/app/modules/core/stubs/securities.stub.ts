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
            "17163":  {
                "securityIdentifier": "17861",
                "security": {
                    "securityIdentifier": "17861",
                    "metrics": {
                        "FO": {
                            "isFixedForLife": true,
                            "isFixedToFloatInFixed": false,
                            "isFloat": false,
                            "isNewIssue": false,
                            "benchmarkSecurityIdentifier": "1843",
                            "benchmarkName": "OBL 0 04/09/2021 EUR 173",
                            "underlyingSecurityId": -1,
                            "yieldWorst": 0.053075,
                            "tenor": "2Y",
                            "amtOutstanding": 579012000.0,
                            "marketValue": 614289690.0,
                            "workoutTerm": 0.263014,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "Xover",
                            "price": 101.595479,
                            "spread": 56.3
                        },
                        "Default": {
                            "isFixedForLife": true,
                            "isFixedToFloatInFixed": false,
                            "isFloat": false,
                            "isNewIssue": false,
                            "benchmarkSecurityIdentifier": "1843",
                            "benchmarkName": "OBL 0 04/09/2021 EUR 173",
                            "underlyingSecurityId": -1,
                            "yieldWorst": 0.053075,
                            "tenor": "2Y",
                            "amtOutstanding": 579012000.0,
                            "marketValue": 614389824.0,
                            "workoutTerm": 0.263014,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "Xover",
                            "price": 101.612773,
                            "spread": 56.3
                        }
                    },
                    "deltaMetrics": {
                        "Dod": {
                            "yieldWorst": 0.0,
                            "ratingDouble": 0.0,
                            "price": 0.0,
                            "spread": 0.0
                        },
                        "Wow": {
                            "yieldWorst": -0.108697,
                            "ratingDouble": 0.0,
                            "price": -0.067227,
                            "spread": 0.0
                        },
                        "Mtd": null,
                        "Mom": null,
                        "Ytd": null,
                        "Yoy": null
                    },
                    "ccy": "EUR",
                    "obligorId": 828,
                    "obligorName": "UNICREDIT SPA",
                    "country": "Italy",
                    "sector": "Financials",
                    "industry": "Banks",
                    "subIndustry": "Diversified Banking Inst",
                    "bicsCode": "14101011",
                    "bicsLevel1": "Financials",
                    "bicsLevel2": "Banking",
                    "bicsLevel3": "Banking",
                    "bicsLevel4": "Banks",
                    "name": "UCGIM 6.125 04/19/2021 EUR EMTN SUBORDINATE",
                    "genericSeniority": "SUB",
                    "globalIdentifier": "XS0618847775",
                    "paymentRank": "SUBORDINATED",
                    "securitySubType": "Bond",
                    "ticker": "UCGIM",
                    "unitPosition": {
                        "securityIdentifier": "17861",
                        "partitionOptionValues": {
                            "PortfolioShortName": [
                                "DOF"
                            ],
                            "StrategyName": [
                                "Short Carry"
                            ]
                        },
                        "strategyAsOfDate": "2021-01-12T00:00:00",
                        "mark": {
                            "driver": "Spread",
                            "enteredTime": "2021-01-13T00:00:00-05:00",
                            "user": null,
                            "value": 56.3,
                            "spread": 56.3,
                            "price": 101.595479,
                            "yield": 0.053075
                        },
                        "hedgeFactor": 1.0,
                        "strategies": [
                            "Short Carry"
                        ],
                        "owners": [
                            "TW",
                            "DJ",
                            "LP"
                        ],
                        "primaryPmName": "TW",
                        "backupPmName": "DJ",
                        "researchName": "LP"
                    },
                    "securityType": "Bond",
                    "maturityType": "Bullet"
                },
                "bestQuotes": {
                    "bestPriceQuote": {
                        "isOffTheRunCds": false,
                        "quoteMetric": "Price",
                        "totalActiveAxeBidQuantity": 0.0,
                        "totalActiveAxeAskQuantity": 0.0,
                        "totalActiveBidQuantity": 0.0,
                        "totalActiveAskQuantity": 0.0,
                        "axeSkew": null,
                        "totalSkew": null,
                        "isBestBidExecutable": null,
                        "bidQuoteType": "Run",
                        "bidDealer": "BAML",
                        "bidQuoteValue": 101.8219985961914,
                        "bidTime": "2021-01-13T09:16:56-05:00",
                        "bidIsOld": true,
                        "isBestAskExecutable": null,
                        "askQuoteType": "Run",
                        "askDealer": "BAML",
                        "askQuoteValue": 100.93800354003906,
                        "askTime": "2021-01-13T09:16:56-05:00",
                        "askIsOld": true,
                        "bidAxeDealer": "DB",
                        "bidAxeQuoteValue": 101.52400207519531,
                        "bidAxeTime": "2021-01-13T07:30:05-05:00",
                        "bidAxeIsOld": true,
                        "askAxeDealer": "HSBC",
                        "askAxeQuoteValue": 101.5999984741211,
                        "askAxeTime": "2021-01-13T03:50:02-05:00",
                        "askAxeIsOld": true,
                        "globalIdentifier": "XS0618847775"
                    },
                    "bestSpreadQuote": {
                        "isOffTheRunCds": false,
                        "quoteMetric": "Spread",
                        "totalActiveAxeBidQuantity": 0.0,
                        "totalActiveAxeAskQuantity": 0.0,
                        "totalActiveBidQuantity": 0.0,
                        "totalActiveAskQuantity": 0.0,
                        "axeSkew": null,
                        "totalSkew": null,
                        "isBestBidExecutable": null,
                        "bidQuoteType": "Run",
                        "bidDealer": "SUMI",
                        "bidQuoteValue": 80.86060333251953,
                        "bidTime": "2021-01-13T02:26:00-05:00",
                        "bidIsOld": true,
                        "isBestAskExecutable": null,
                        "askQuoteType": "Run",
                        "askDealer": "MS",
                        "askQuoteValue": 114.58000183105469,
                        "askTime": "2021-01-13T08:39:32-05:00",
                        "askIsOld": true,
                        "bidAxeDealer": "DB",
                        "bidAxeQuoteValue": 82.0,
                        "bidAxeTime": "2021-01-13T07:30:05-05:00",
                        "bidAxeIsOld": true,
                        "askAxeDealer": "HSBC",
                        "askAxeQuoteValue": -17.0,
                        "askAxeTime": "2021-01-13T03:50:02-05:00",
                        "askAxeIsOld": true,
                        "globalIdentifier": "XS0618847775"
                    },
                    "bestYieldQuote": {
                        "isOffTheRunCds": false,
                        "quoteMetric": "Yield",
                        "totalActiveAxeBidQuantity": 0.0,
                        "totalActiveAxeAskQuantity": 0.0,
                        "totalActiveBidQuantity": 0.0,
                        "totalActiveAskQuantity": 0.0,
                        "axeSkew": null,
                        "totalSkew": null,
                        "isBestBidExecutable": null,
                        "bidQuoteType": "Run",
                        "bidDealer": "BAML",
                        "bidQuoteValue": -0.8999999761581421,
                        "bidTime": "2021-01-13T09:16:56-05:00",
                        "bidIsOld": true,
                        "isBestAskExecutable": null,
                        "askQuoteType": "Run",
                        "askDealer": "BAML",
                        "askQuoteValue": 2.4000000953674316,
                        "askTime": "2021-01-13T09:16:56-05:00",
                        "askIsOld": true,
                        "bidAxeDealer": "DB",
                        "bidAxeQuoteValue": 0.20000000298023224,
                        "bidAxeTime": "2021-01-13T07:30:05-05:00",
                        "bidAxeIsOld": true,
                        "askAxeDealer": "HSBC",
                        "askAxeQuoteValue": -0.021076299250125885,
                        "askAxeTime": "2021-01-13T03:50:02-05:00",
                        "askAxeIsOld": true,
                        "globalIdentifier": "XS0618847775"
                    }
                },
                "positions": [
                    {
                        "source": "FO",
                        "partitionOptionValues": {
                            "PortfolioShortName": "DOF",
                            "StrategyName": "Short Carry"
                        },
                        "trades": [
                            {
                                "partitionOptionValue": {
                                    "PortfolioShortName": "DOF",
                                    "StrategyName": "Short Carry"
                                },
                                "tradeId": "5861644",
                                "parentTradeId": "5861639",
                                "trader": "DA",
                                "quantity": 6413000.0,
                                "tradeDateTime": "2021-01-06T11:39:01-05:00",
                                "price": 101.68,
                                "counterpartyName": "DB LDN",
                                "spread": 73.0,
                                "isCancelled": false,
                                "quantityAfterTrade": 6413000.0,
                                "wgtAvgSpread": 73.0,
                                "wgtAvgPrice": 101.68,
                                "isValid": true
                            }
                        ],
                        "quantity": 6413000.0,
                        "bondEquivalentValueCad": 10535163.581041835,
                        "bondEquivalentValueCadWeightFund": 0.005678873974177238,
                        "cs01Cad": 279.709645281,
                        "cs01CadWeightFund": 0.00024731627179343517,
                        "cs01Local": 180.63964072292111
                    }
                ],
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
                            "workoutTerm": 4.936986,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": 101.934,
                            "spread": 60.06
                        },
                        "BB": {
                            "workoutTerm": 4.9397,
                            "ratingDouble": 13.0,
                            "isRated": true,
                            "rating": "BB+",
                            "ratingNoNotch": "BB",
                            "ratingBucket": "HY",
                            "price": null,
                            "spread": null
                        },
                        "Default": {
                            "workoutTerm": 4.936986,
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
                        "Ytd": {
                            "ratingDouble": 0.0,
                            "price": null,
                            "spread": null
                        },
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
                                "SOF"
                            ],
                            "StrategyName": [
                                "Portfolio Shorts"
                            ]
                        },
                        "strategyAsOfDate": "2021-01-12T00:00:00",
                        "mark": {
                            "driver": "Spread",
                            "enteredTime": "2021-01-13T00:00:00-05:00",
                            "user": null,
                            "value": 60.06,
                            "spread": 60.06,
                            "price": 101.934,
                            "yield": 0.6006
                        },
                        "hedgeFactor": 1.0,
                        "strategies": [
                            "Portfolio Shorts"
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
                                "isValid": true
                            }
                        ],
                        "quantity": -5500000.0,
                        "bondEquivalentValueCad": -7141352.560001,
                        "bondEquivalentValueCadWeightFund": -0.0038494742755008225,
                        "cs01Cad": -3438.719999,
                        "cs01CadWeightFund": -0.0030404793836831417,
                        "cs01Local": -2701.2725836606446
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
                                "isValid": true
                            }
                        ],
                        "quantity": -3000000.0,
                        "bondEquivalentValueCad": -3895283.214546,
                        "bondEquivalentValueCadWeightFund": -0.005443416631491312,
                        "cs01Cad": -1875.665454,
                        "cs01CadWeightFund": -0.007239218923143322,
                        "cs01Local": -1473.4214092694424
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