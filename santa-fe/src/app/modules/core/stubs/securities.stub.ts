import { BEFetchAllTradeDataReturn } from 'BEModels/backend-models.interface';
import { BESecurityDTO } from 'BEModels/backend-models.interface';

export const PortfolioList: BEFetchAllTradeDataReturn = {
  "numberOfSecurities": 2,
  "securityDtos": {
    "groupIdentifier": {
      "source": "Default",
      "date": "2020-11-25T00:00:00-05:00",
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
            "FO": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "workoutTerm": 1.224658,
              "ratingNoNotch": "BB",
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": "96278",
              "benchmarkName": "T 0.125 10/31/2022 USD",
              "underlyingSecurityId": -1,
              "yieldWorst": 3.839321,
              "amtOutstanding": 500000000.0,
              "marketValue": 513679515.0,
              "ratingDouble": 11.5,
              "isRated": true,
              "rating": "BB",
              "ratingBucket": "HY",
              "price": 101.360903,
              "spread": 355.6769
            },
            "Default": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "workoutTerm": 1.224658,
              "ratingNoNotch": "BB",
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": "96278",
              "benchmarkName": "T 0.125 10/31/2022 USD",
              "underlyingSecurityId": -1,
              "yieldWorst": 3.839321,
              "amtOutstanding": 500000000.0,
              "marketValue": 513679515.0,
              "ratingDouble": 11.5,
              "isRated": true,
              "rating": "BB",
              "ratingBucket": "HY",
              "price": 101.360903,
              "spread": 355.6769
            }
          },
          "deltaMetrics": {
            "Dod": {
              "yieldWorst": 0.0,
              "ratingDouble": 0.0,
              "price": -0.009268,
              "spread": -11.5454
            },
            "Wow": {
              "yieldWorst": -0.217245,
              "ratingDouble": 0.0,
              "price": 0.235903,
              "spread": -32.2472
            },
            "Mtd": {
              "yieldWorst": -1.750679,
              "ratingDouble": -1.0,
              "price": 2.360903,
              "spread": -188.0396
            },
            "Mom": {
              "yieldWorst": -0.979179,
              "ratingDouble": -1.0,
              "price": 1.235903,
              "spread": -114.6051
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
          "name": "SVC 5 08/15/2022 Callable USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US44106MAQ50",
          "paymentRank": "SR UNSECURED",
          "securitySubType": "Bond",
          "ticker": "SVC",
          "unitPosition": {
            "securityIdentifier": "17163",
            "partitionOptionValues": {
              "PortfolioShortName": [
                "STIP",
                "AGB",
                "DOF",
                "SOF",
                ""
              ],
              "StrategyName": [
                ""
              ]
            },
            "strategyAsOfDate": "2020-11-25T13:59:00-05:00",
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-11-25T11:16:19.709-05:00",
              "user": "DJ",
              "value": 355.6769,
              "spread": 355.6769,
              "price": 101.360903
            },
            "hedgeFactor": 0.375,
            "strategies": [
              ""
            ],
            "owners": [
              "DJ",
              "PM",
              "PD"
            ],
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "PD"
          },
          "securityType": "Bond",
          "maturityType": "Callable"
        },
        "bestQuotes": {
          "bestPriceQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Price",
            "totalActiveAxeBidQuantity": 300000.0,
            "totalActiveAxeAskQuantity": 2000000.0,
            "totalActiveBidQuantity": 300000.0,
            "totalActiveAskQuantity": 2000000.0,
            "axeSkew": 0.8695652173913043,
            "totalSkew": 0.8695652173913043,
            "bestBidQuoteCondition": null,
            "bidQuoteType": "Axe",
            "bidDealer": "FLTR",
            "bidQuoteValue": 101.56999969482422,
            "bidTime": "2020-11-25T13:54:07-05:00",
            "bidIsOld": false,
            "bestAskQuoteCondition": null,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askQuoteValue": 101.5,
            "askTime": "2020-11-25T14:32:45-05:00",
            "askIsOld": false,
            "bidAxeDealer": "FLTR",
            "bidAxeQuoteValue": 101.56999969482422,
            "bidAxeTime": "2020-11-25T13:54:07-05:00",
            "bidAxeIsOld": false,
            "askAxeDealer": "RBC",
            "askAxeQuoteValue": 102.0,
            "askAxeTime": "2020-11-25T14:50:23-05:00",
            "askAxeIsOld": false,
            "globalIdentifier": "US44106MAQ50"
          },
          "bestSpreadQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Spread",
            "totalActiveAxeBidQuantity": 300000.0,
            "totalActiveAxeAskQuantity": 2000000.0,
            "totalActiveBidQuantity": 300000.0,
            "totalActiveAskQuantity": 2000000.0,
            "axeSkew": 0.8695652173913043,
            "totalSkew": 0.8695652173913043,
            "bestBidQuoteCondition": null,
            "bidQuoteType": "Axe",
            "bidDealer": "FLTR",
            "bidQuoteValue": 349.1629943847656,
            "bidTime": "2020-11-25T13:54:07-05:00",
            "bidIsOld": false,
            "bestAskQuoteCondition": null,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askQuoteValue": 355.677001953125,
            "askTime": "2020-11-25T14:32:45-05:00",
            "askIsOld": false,
            "bidAxeDealer": "FLTR",
            "bidAxeQuoteValue": 349.1629943847656,
            "bidAxeTime": "2020-11-25T13:54:07-05:00",
            "bidAxeIsOld": false,
            "askAxeDealer": "RBC",
            "askAxeQuoteValue": 313.63299560546875,
            "askAxeTime": "2020-11-25T14:50:23-05:00",
            "askAxeIsOld": false,
            "globalIdentifier": "US44106MAQ50"
          },
          "bestYieldQuote": {
            "isOffTheRunCds": false,
            "quoteMetric": "Yield",
            "totalActiveAxeBidQuantity": 300000.0,
            "totalActiveAxeAskQuantity": 2000000.0,
            "totalActiveBidQuantity": 300000.0,
            "totalActiveAskQuantity": 2000000.0,
            "axeSkew": 0.8695652173913043,
            "totalSkew": 0.8695652173913043,
            "bestBidQuoteCondition": null,
            "bidQuoteType": "Axe",
            "bidDealer": "FLTR",
            "bidQuoteValue": 3.6579999923706055,
            "bidTime": "2020-11-25T13:54:07-05:00",
            "bidIsOld": false,
            "bestAskQuoteCondition": null,
            "askQuoteType": "Run",
            "askDealer": "CG",
            "askQuoteValue": 3.7100000381469727,
            "askTime": "2020-11-25T14:32:45-05:00",
            "askIsOld": false,
            "bidAxeDealer": "FLTR",
            "bidAxeQuoteValue": 3.6579999923706055,
            "bidAxeTime": "2020-11-25T13:54:07-05:00",
            "bidAxeIsOld": false,
            "askAxeDealer": "RBC",
            "askAxeQuoteValue": 3.2938499450683594,
            "askAxeTime": "2020-11-25T14:50:23-05:00",
            "askAxeIsOld": false,
            "globalIdentifier": "US44106MAQ50"
          }
        },
        "positions": [
          {
            "source": "FO",
            "partitionOptionValues": {
              "PortfolioShortName": "STIP",
              "StrategyName": "Short Carry"
            },
            "trades": [
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5694792",
                "parentTradeId": "5694749",
                "trader": "DJ",
                "quantity": 2000000.0,
                "tradeDateTime": "2020-11-09T13:10:00-05:00",
                "price": 100.75,
                "counterpartyName": "IMPC",
                "spread": 419.5,
                "isCancelled": false,
                "quantityAfterTrade": 2000000.0,
                "wgtAvgSpread": 419.5,
                "wgtAvgPrice": 100.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5701146",
                "parentTradeId": "5701145",
                "trader": "DJ",
                "quantity": 116000.0,
                "tradeDateTime": "2020-11-10T17:17:00-05:00",
                "price": 100.75,
                "counterpartyName": "GS NY",
                "spread": 419.0,
                "isCancelled": false,
                "quantityAfterTrade": 2116000.0,
                "wgtAvgSpread": 419.47,
                "wgtAvgPrice": 100.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708574",
                "parentTradeId": "5708509",
                "trader": "DJ",
                "quantity": 44000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.33,
                "counterpartyName": "MKTX",
                "spread": 455.0,
                "isCancelled": false,
                "quantityAfterTrade": 2160000.0,
                "wgtAvgSpread": 420.19,
                "wgtAvgPrice": 100.7414
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708565",
                "parentTradeId": "5708507",
                "trader": "DJ",
                "quantity": 58000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.35,
                "counterpartyName": "MKTX",
                "spread": 453.0,
                "isCancelled": false,
                "quantityAfterTrade": 2218000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721192",
                "parentTradeId": "5721191",
                "trader": "DJ",
                "quantity": -69000.0,
                "tradeDateTime": "2020-11-17T11:18:00-05:00",
                "price": 101.5,
                "counterpartyName": "CITI NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 2149000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721576",
                "parentTradeId": "5721575",
                "trader": "DJ",
                "quantity": -44000.0,
                "tradeDateTime": "2020-11-17T13:37:00-05:00",
                "price": 101.5,
                "counterpartyName": "JP NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 2105000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5723194",
                "parentTradeId": "5723193",
                "trader": "DJ",
                "quantity": -174000.0,
                "tradeDateTime": "2020-11-17T17:51:54-05:00",
                "price": 101.5,
                "counterpartyName": "GS NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 1931000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5749378",
                "parentTradeId": "5749377",
                "trader": "DJ",
                "quantity": -43000.0,
                "tradeDateTime": "2020-11-24T08:00:00-05:00",
                "price": 101.96,
                "counterpartyName": "MKTX",
                "spread": 444.0,
                "isCancelled": false,
                "quantityAfterTrade": 1888000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "STIP",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5750587",
                "parentTradeId": "5750585",
                "trader": "DJ",
                "quantity": -1160000.0,
                "tradeDateTime": "2020-11-25T13:59:00-05:00",
                "price": 101.625,
                "counterpartyName": "WELLS",
                "spread": 345.0,
                "isCancelled": false,
                "quantityAfterTrade": 728000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              }
            ],
            "quantity": 728000.0,
            "cs01Cad": 122.846786608,
            "cs01Local": 94.4757260693686
          },
          {
            "source": "FO",
            "partitionOptionValues": {
              "PortfolioShortName": "AGB",
              "StrategyName": "Short Carry"
            },
            "trades": [
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5694795",
                "parentTradeId": "5694749",
                "trader": "DJ",
                "quantity": 2000000.0,
                "tradeDateTime": "2020-11-09T13:10:00-05:00",
                "price": 100.75,
                "counterpartyName": "IMPC",
                "spread": 419.5,
                "isCancelled": false,
                "quantityAfterTrade": 2000000.0,
                "wgtAvgSpread": 419.5,
                "wgtAvgPrice": 100.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5701149",
                "parentTradeId": "5701145",
                "trader": "DJ",
                "quantity": 116000.0,
                "tradeDateTime": "2020-11-10T17:17:00-05:00",
                "price": 100.75,
                "counterpartyName": "GS NY",
                "spread": 419.0,
                "isCancelled": false,
                "quantityAfterTrade": 2116000.0,
                "wgtAvgSpread": 419.47,
                "wgtAvgPrice": 100.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708568",
                "parentTradeId": "5708507",
                "trader": "DJ",
                "quantity": 58000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.35,
                "counterpartyName": "MKTX",
                "spread": 453.0,
                "isCancelled": false,
                "quantityAfterTrade": 2174000.0,
                "wgtAvgSpread": 420.36,
                "wgtAvgPrice": 100.7393
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708577",
                "parentTradeId": "5708509",
                "trader": "DJ",
                "quantity": 44000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.33,
                "counterpartyName": "MKTX",
                "spread": 455.0,
                "isCancelled": false,
                "quantityAfterTrade": 2218000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721195",
                "parentTradeId": "5721191",
                "trader": "DJ",
                "quantity": -70000.0,
                "tradeDateTime": "2020-11-17T11:18:00-05:00",
                "price": 101.5,
                "counterpartyName": "CITI NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 2148000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721579",
                "parentTradeId": "5721575",
                "trader": "DJ",
                "quantity": -43000.0,
                "tradeDateTime": "2020-11-17T13:37:00-05:00",
                "price": 101.5,
                "counterpartyName": "JP NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 2105000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5723197",
                "parentTradeId": "5723193",
                "trader": "DJ",
                "quantity": -175000.0,
                "tradeDateTime": "2020-11-17T17:51:54-05:00",
                "price": 101.5,
                "counterpartyName": "GS NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 1930000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5749381",
                "parentTradeId": "5749377",
                "trader": "DJ",
                "quantity": -43000.0,
                "tradeDateTime": "2020-11-24T08:00:00-05:00",
                "price": 101.96,
                "counterpartyName": "MKTX",
                "spread": 444.0,
                "isCancelled": false,
                "quantityAfterTrade": 1887000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "AGB",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5750590",
                "parentTradeId": "5750585",
                "trader": "DJ",
                "quantity": -1160000.0,
                "tradeDateTime": "2020-11-25T13:59:00-05:00",
                "price": 101.625,
                "counterpartyName": "WELLS",
                "spread": 345.0,
                "isCancelled": false,
                "quantityAfterTrade": 727000.0,
                "wgtAvgSpread": 421.05,
                "wgtAvgPrice": 100.7312
              }
            ],
            "quantity": 727000.0,
            "cs01Cad": 122.678041022,
            "cs01Local": 94.34595172037223
          },
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
                "tradeId": "5694794",
                "parentTradeId": "5694749",
                "trader": "DJ",
                "quantity": 10000000.0,
                "tradeDateTime": "2020-11-09T13:10:00-05:00",
                "price": 100.75,
                "counterpartyName": "IMPC",
                "spread": 419.5,
                "isCancelled": false,
                "quantityAfterTrade": 10000000.0,
                "wgtAvgSpread": 419.5,
                "wgtAvgPrice": 100.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5701148",
                "parentTradeId": "5701145",
                "trader": "DJ",
                "quantity": 580000.0,
                "tradeDateTime": "2020-11-10T17:17:00-05:00",
                "price": 100.75,
                "counterpartyName": "GS NY",
                "spread": 419.0,
                "isCancelled": false,
                "quantityAfterTrade": 10580000.0,
                "wgtAvgSpread": 419.47,
                "wgtAvgPrice": 100.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708576",
                "parentTradeId": "5708509",
                "trader": "DJ",
                "quantity": 222000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.33,
                "counterpartyName": "MKTX",
                "spread": 455.0,
                "isCancelled": false,
                "quantityAfterTrade": 10802000.0,
                "wgtAvgSpread": 420.2,
                "wgtAvgPrice": 100.7414
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708567",
                "parentTradeId": "5708507",
                "trader": "DJ",
                "quantity": 290000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.35,
                "counterpartyName": "MKTX",
                "spread": 453.0,
                "isCancelled": false,
                "quantityAfterTrade": 11092000.0,
                "wgtAvgSpread": 421.06,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721194",
                "parentTradeId": "5721191",
                "trader": "DJ",
                "quantity": -346000.0,
                "tradeDateTime": "2020-11-17T11:18:00-05:00",
                "price": 101.5,
                "counterpartyName": "CITI NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 10746000.0,
                "wgtAvgSpread": 421.06,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721578",
                "parentTradeId": "5721575",
                "trader": "DJ",
                "quantity": -218000.0,
                "tradeDateTime": "2020-11-17T13:37:00-05:00",
                "price": 101.5,
                "counterpartyName": "JP NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 10528000.0,
                "wgtAvgSpread": 421.06,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5723196",
                "parentTradeId": "5723193",
                "trader": "DJ",
                "quantity": -870000.0,
                "tradeDateTime": "2020-11-17T17:51:54-05:00",
                "price": 101.5,
                "counterpartyName": "GS NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 9658000.0,
                "wgtAvgSpread": 421.06,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5749380",
                "parentTradeId": "5749377",
                "trader": "DJ",
                "quantity": -219000.0,
                "tradeDateTime": "2020-11-24T08:00:00-05:00",
                "price": 101.96,
                "counterpartyName": "MKTX",
                "spread": 444.0,
                "isCancelled": false,
                "quantityAfterTrade": 9439000.0,
                "wgtAvgSpread": 421.06,
                "wgtAvgPrice": 100.7312
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "DOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5750589",
                "parentTradeId": "5750585",
                "trader": "DJ",
                "quantity": -5800000.0,
                "tradeDateTime": "2020-11-25T13:59:00-05:00",
                "price": 101.625,
                "counterpartyName": "WELLS",
                "spread": 345.0,
                "isCancelled": false,
                "quantityAfterTrade": 3639000.0,
                "wgtAvgSpread": 421.06,
                "wgtAvgPrice": 100.7312
              }
            ],
            "quantity": 3639000.0,
            "cs01Cad": 614.065187454,
            "cs01Local": 472.24885599784665
          },
          {
            "source": "FO",
            "partitionOptionValues": {
              "PortfolioShortName": "SOF",
              "StrategyName": "Short Carry"
            },
            "trades": [
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5210407",
                "parentTradeId": "5210394",
                "trader": "DJ",
                "quantity": 1000000.0,
                "tradeDateTime": "2020-06-03T15:33:00-04:00",
                "price": 97.75,
                "counterpartyName": "WELLS",
                "spread": 592.0,
                "isCancelled": false,
                "quantityAfterTrade": 1000000.0,
                "wgtAvgSpread": 592.0,
                "wgtAvgPrice": 97.75
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5219937",
                "parentTradeId": "5219935",
                "trader": "DJ",
                "quantity": 7000000.0,
                "tradeDateTime": "2020-06-05T10:10:00-04:00",
                "price": 99.5,
                "counterpartyName": "WELLS",
                "spread": 504.0,
                "isCancelled": false,
                "quantityAfterTrade": 8000000.0,
                "wgtAvgSpread": 515.0,
                "wgtAvgPrice": 99.2812
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5230700",
                "parentTradeId": "5230697",
                "trader": "DJ",
                "quantity": 1362000.0,
                "tradeDateTime": "2020-06-08T16:39:00-04:00",
                "price": 99.5,
                "counterpartyName": "JP NY",
                "spread": 503.0,
                "isCancelled": false,
                "quantityAfterTrade": 9362000.0,
                "wgtAvgSpread": 513.25,
                "wgtAvgPrice": 99.313
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5231282",
                "parentTradeId": "5231277",
                "trader": "DJ",
                "quantity": 2000000.0,
                "tradeDateTime": "2020-06-08T17:30:59-04:00",
                "price": 99.375,
                "counterpartyName": "BAML NY",
                "spread": 508.0,
                "isCancelled": false,
                "quantityAfterTrade": 11362000.0,
                "wgtAvgSpread": 512.33,
                "wgtAvgPrice": 99.3239
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5271597",
                "parentTradeId": "5271595",
                "trader": "DJ",
                "quantity": 730000.0,
                "tradeDateTime": "2020-06-19T14:19:05-04:00",
                "price": 98.051,
                "counterpartyName": "MKTX",
                "spread": 579.0,
                "isCancelled": false,
                "quantityAfterTrade": 12092000.0,
                "wgtAvgSpread": 516.35,
                "wgtAvgPrice": 99.2471
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5340521",
                "parentTradeId": "5340517",
                "trader": "PM",
                "quantity": 2157000.0,
                "tradeDateTime": "2020-07-14T14:31:00-04:00",
                "price": 97.65,
                "counterpartyName": "SWS",
                "spread": 606.0,
                "isCancelled": false,
                "quantityAfterTrade": 14249000.0,
                "wgtAvgSpread": 529.92,
                "wgtAvgPrice": 99.0053
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5363998",
                "parentTradeId": "5363996",
                "trader": "DJ",
                "quantity": 2000000.0,
                "tradeDateTime": "2020-07-22T09:05:00-04:00",
                "price": 99.125,
                "counterpartyName": "JP NY",
                "spread": 531.0,
                "isCancelled": false,
                "quantityAfterTrade": 16249000.0,
                "wgtAvgSpread": 530.05,
                "wgtAvgPrice": 99.02
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5365568",
                "parentTradeId": "5365563",
                "trader": "DJ",
                "quantity": 2000000.0,
                "tradeDateTime": "2020-07-22T16:47:00-04:00",
                "price": 99.25,
                "counterpartyName": "GS NY",
                "spread": 524.0,
                "isCancelled": false,
                "quantityAfterTrade": 18249000.0,
                "wgtAvgSpread": 529.39,
                "wgtAvgPrice": 99.0452
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5369752",
                "parentTradeId": "5369749",
                "trader": "PM",
                "quantity": -5000000.0,
                "tradeDateTime": "2020-07-24T09:05:00-04:00",
                "price": 99.5,
                "counterpartyName": "CITI NY",
                "spread": 511.0,
                "isCancelled": false,
                "quantityAfterTrade": 13249000.0,
                "wgtAvgSpread": 529.39,
                "wgtAvgPrice": 99.0452
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5389551",
                "parentTradeId": "5389536",
                "trader": "PM",
                "quantity": -1000000.0,
                "tradeDateTime": "2020-07-30T08:00:00-04:00",
                "price": 99.7,
                "counterpartyName": "MKTX",
                "spread": 503.0,
                "isCancelled": false,
                "quantityAfterTrade": 12249000.0,
                "wgtAvgSpread": 529.39,
                "wgtAvgPrice": 99.0452
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5439202",
                "parentTradeId": "5439186",
                "trader": "PM",
                "quantity": -400000.0,
                "tradeDateTime": "2020-08-17T08:31:46-04:00",
                "price": 100.237,
                "counterpartyName": "MKTX",
                "spread": 469.0,
                "isCancelled": false,
                "quantityAfterTrade": 11849000.0,
                "wgtAvgSpread": 529.39,
                "wgtAvgPrice": 99.0452
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5524915",
                "parentTradeId": "5524914",
                "trader": "DJ",
                "quantity": 1000000.0,
                "tradeDateTime": "2020-09-14T08:00:00-04:00",
                "price": 99.6,
                "counterpartyName": "MKTX",
                "spread": 509.0,
                "isCancelled": false,
                "quantityAfterTrade": 12849000.0,
                "wgtAvgSpread": 527.8,
                "wgtAvgPrice": 99.0884
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5552215",
                "parentTradeId": "5552214",
                "trader": "DJ",
                "quantity": 843000.0,
                "tradeDateTime": "2020-09-22T08:00:00-04:00",
                "price": 99.08,
                "counterpartyName": "MKTX",
                "spread": 531.0,
                "isCancelled": false,
                "quantityAfterTrade": 13692000.0,
                "wgtAvgSpread": 528.0,
                "wgtAvgPrice": 99.0879
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5590385",
                "parentTradeId": "5590356",
                "trader": "DJ",
                "quantity": -500000.0,
                "tradeDateTime": "2020-10-05T08:00:00-04:00",
                "price": 100.68,
                "counterpartyName": "MKTX",
                "spread": 433.0,
                "isCancelled": false,
                "quantityAfterTrade": 13192000.0,
                "wgtAvgSpread": 528.0,
                "wgtAvgPrice": 99.0879
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5589533",
                "parentTradeId": "5589532",
                "trader": "DJ",
                "quantity": -835000.0,
                "tradeDateTime": "2020-10-05T11:17:48-04:00",
                "price": 100.3,
                "counterpartyName": "MKTX",
                "spread": 462.0,
                "isCancelled": false,
                "quantityAfterTrade": 12357000.0,
                "wgtAvgSpread": 528.0,
                "wgtAvgPrice": 99.0879
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5593200",
                "parentTradeId": "5593196",
                "trader": "DJ",
                "quantity": -700000.0,
                "tradeDateTime": "2020-10-06T08:00:00-04:00",
                "price": 100.68,
                "counterpartyName": "MKTX",
                "spread": 433.0,
                "isCancelled": false,
                "quantityAfterTrade": 11657000.0,
                "wgtAvgSpread": 528.0,
                "wgtAvgPrice": 99.0879
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5599323",
                "parentTradeId": "5599304",
                "trader": "DJ",
                "quantity": -459000.0,
                "tradeDateTime": "2020-10-07T08:00:00-04:00",
                "price": 100.9,
                "counterpartyName": "MKTX",
                "spread": 415.0,
                "isCancelled": false,
                "quantityAfterTrade": 11198000.0,
                "wgtAvgSpread": 528.0,
                "wgtAvgPrice": 99.0879
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5599321",
                "parentTradeId": "5599302",
                "trader": "DJ",
                "quantity": -725000.0,
                "tradeDateTime": "2020-10-07T08:00:00-04:00",
                "price": 101.18,
                "counterpartyName": "MKTX",
                "spread": 394.0,
                "isCancelled": false,
                "quantityAfterTrade": 10473000.0,
                "wgtAvgSpread": 528.0,
                "wgtAvgPrice": 99.0879
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5694793",
                "parentTradeId": "5694749",
                "trader": "DJ",
                "quantity": 10000000.0,
                "tradeDateTime": "2020-11-09T13:10:00-05:00",
                "price": 100.75,
                "counterpartyName": "IMPC",
                "spread": 419.5,
                "isCancelled": false,
                "quantityAfterTrade": 20473000.0,
                "wgtAvgSpread": 475.0,
                "wgtAvgPrice": 99.8997
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5701147",
                "parentTradeId": "5701145",
                "trader": "DJ",
                "quantity": 1188000.0,
                "tradeDateTime": "2020-11-10T17:17:00-05:00",
                "price": 100.75,
                "counterpartyName": "GS NY",
                "spread": 419.0,
                "isCancelled": false,
                "quantityAfterTrade": 21661000.0,
                "wgtAvgSpread": 471.93,
                "wgtAvgPrice": 99.9463
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708575",
                "parentTradeId": "5708509",
                "trader": "DJ",
                "quantity": 455000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.33,
                "counterpartyName": "MKTX",
                "spread": 455.0,
                "isCancelled": false,
                "quantityAfterTrade": 22116000.0,
                "wgtAvgSpread": 471.58,
                "wgtAvgPrice": 99.9542
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5708566",
                "parentTradeId": "5708507",
                "trader": "DJ",
                "quantity": 594000.0,
                "tradeDateTime": "2020-11-12T08:00:00-05:00",
                "price": 100.35,
                "counterpartyName": "MKTX",
                "spread": 453.0,
                "isCancelled": false,
                "quantityAfterTrade": 22710000.0,
                "wgtAvgSpread": 471.09,
                "wgtAvgPrice": 99.9646
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721193",
                "parentTradeId": "5721191",
                "trader": "DJ",
                "quantity": -709000.0,
                "tradeDateTime": "2020-11-17T11:18:00-05:00",
                "price": 101.5,
                "counterpartyName": "CITI NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 22001000.0,
                "wgtAvgSpread": 471.09,
                "wgtAvgPrice": 99.9646
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5721577",
                "parentTradeId": "5721575",
                "trader": "DJ",
                "quantity": -445000.0,
                "tradeDateTime": "2020-11-17T13:37:00-05:00",
                "price": 101.5,
                "counterpartyName": "JP NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 21556000.0,
                "wgtAvgSpread": 471.09,
                "wgtAvgPrice": 99.9646
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5723195",
                "parentTradeId": "5723193",
                "trader": "DJ",
                "quantity": -1781000.0,
                "tradeDateTime": "2020-11-17T17:51:54-05:00",
                "price": 101.5,
                "counterpartyName": "GS NY",
                "spread": 357.0,
                "isCancelled": false,
                "quantityAfterTrade": 19775000.0,
                "wgtAvgSpread": 471.09,
                "wgtAvgPrice": 99.9646
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5749379",
                "parentTradeId": "5749377",
                "trader": "DJ",
                "quantity": -445000.0,
                "tradeDateTime": "2020-11-24T08:00:00-05:00",
                "price": 101.96,
                "counterpartyName": "MKTX",
                "spread": 444.0,
                "isCancelled": false,
                "quantityAfterTrade": 19330000.0,
                "wgtAvgSpread": 471.09,
                "wgtAvgPrice": 99.9646
              },
              {
                "partitionOptionValue": {
                  "PortfolioShortName": "SOF",
                  "StrategyName": "Short Carry"
                },
                "tradeId": "5750588",
                "parentTradeId": "5750585",
                "trader": "DJ",
                "quantity": -11880000.0,
                "tradeDateTime": "2020-11-25T13:59:00-05:00",
                "price": 101.625,
                "counterpartyName": "WELLS",
                "spread": 345.0,
                "isCancelled": false,
                "quantityAfterTrade": 7450000.0,
                "wgtAvgSpread": 471.09,
                "wgtAvgPrice": 99.9646
              }
            ],
            "quantity": 7450000.0,
            "cs01Cad": 1257.1546157,
            "cs01Local": 966.8189000230716
          }
        ],
        "lastTracePrice": 101.625,
        "lastTraceSpread": 345.0,
        "lastTraceVolumeEstimated": 3420920.0,
        "lastTraceVolumeReported": 1000000.0
      },
      "338|5Y": {
        "securityIdentifier": "338|5Y",
        "security": {
          "curveSubType": "XR14",
          "securityIdentifier": "338|5Y",
          "metrics": {
            "FO": {
              "workoutTerm": 5.071233,
              "ratingDouble": 13.0,
              "isRated": true,
              "rating": "BB+",
              "ratingNoNotch": "BB",
              "ratingBucket": "HY",
              "price": 100.735,
              "spread": 85.09
            },
            "Default": {
              "workoutTerm": 5.071233,
              "ratingDouble": 13.0,
              "isRated": true,
              "rating": "BB+",
              "ratingNoNotch": "BB",
              "ratingBucket": "HY",
              "price": 100.735,
              "spread": 85.09
            }
          },
          "deltaMetrics": {
            "Dod": {
              "ratingDouble": 0.0,
              "price": 0.0,
              "spread": 0.0
            },
            "Wow": {
              "ratingDouble": 0.0,
              "price": -0.003,
              "spread": 0.0
            },
            "Mtd": {
              "ratingDouble": 0.0,
              "price": -0.01,
              "spread": 0.0
            },
            "Mom": {
              "ratingDouble": 0.0,
              "price": 0.238,
              "spread": -5.0
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
          "bicsCode": "181012101111",
          "bicsLevel1": null,
          "bicsLevel2": null,
          "bicsLevel3": null,
          "bicsLevel4": null,
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
            "strategyAsOfDate": "2020-11-24T00:00:00",
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-11-25T00:00:00-05:00",
              "user": null,
              "value": 85.09,
              "spread": 85.09,
              "price": 100.735
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
                "wgtAvgPrice": 0.0
              }
            ],
            "quantity": -5500000.0,
            "cs01Cad": -3539.159998,
            "cs01Local": -2721.8026593862955
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
                "wgtAvgPrice": 0.0
              }
            ],
            "quantity": -3000000.0,
            "cs01Cad": -1930.450908,
            "cs01Local": -1484.6196323925249
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