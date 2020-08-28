import { BEAlertConfigurationReturn, BEAlertDTO } from 'BEModels/backend-models.interface';

const AlertConfigSample: BEAlertConfigurationReturn = {
  "Axe": {
    "2f68f8e6-03b5-4a7b-b041-16aaec774f13": {
      "groupFilters": {
        "Owner": [
          "DM"
        ]
      },
      "alertConfigID": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
      "title": "Owner=[DM]",
      "userName": "AD\\dzhang",
      "type": "Axe",
      "subType": "Both",
      "parameters": {},
      "isEnabled": true,
      "isUrgent": false,
      "sendEmail": false
    }
  }
}

export const AlertSample: Array<BEAlertDTO> = [
  {
    "type":"Axe",
    "subType":"Ask",
    "keyWord":"SYY 50s|260K /283",
    "message":"MKTX BWIC",
    "security":{
      "securityIdentifier":"69458",
      "metrics":{
        "Default":{
          "isFixedForLife":true,
          "isFixedToFloatInFixed":false,
          "isFloat":false,
          "isOnTheRun":false,
          "isNewIssue":false,
          "benchmarkSecurityIdentifier":"66508",
          "benchmarkName":"T 2 02/15/2050 USD",
          "underlyingSecurityId":-1,
          "yieldWorst":null,
          "amtOutstanding":1250000000,
          "marketValue":1796689262,
          "workoutTerm":29.2849,
          "ratingDouble":15,
          "isRated":true,
          "rating":"BBB",
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
          "ratingDouble":1,
          "price":null,
          "spread":null
        },
        "Mom":{
          "yieldWorst":null,
          "ratingDouble":1,
          "price":null,
          "spread":null
        },
        "Ytd":null,
        "Yoy":null
      },
      "ccy":"USD",
      "country":"US",
      "industry":"Food",
      "name":"SYY 6.6 04/01/2050 Callable USD SENIOR_UNSECURED",
      "genericSeniority":"SR",
      "globalIdentifier":"US871829BN62",
      "obligorName":"SYSCO CORP",
      "obligorId":750,
      "paymentRank":"SR UNSECURED",
      "sector":"Consumers",
      "securitySubType":"Bond",
      "subIndustry":"Food-Wholesale/Distrib",
      "ticker":"SYY",
      "unitPosition":{
        "securityIdentifier":"69458",
        "partitionOptionValues":{
          "PortfolioShortName":[
            "STIP"
          ],
          "StrategyName":[
            "LTOV - Spread"
          ]
        },
        "mark":{
          "driver":"Spread",
          "enteredTime":"2020-06-29T00:00:00-04:00",
          "user":null,
          "value":275,
          "spread":275,
          "price":142.194017
        },
        "hedgeFactor":1,
        "primaryPmName":"DA",
        "backupPmName":"DM",
        "researchName":"PD",
        "owners":[
          "DA",
          "DM",
          "PD"
        ],
        "metrics": {
          "FO": {
            "2020-06-29T00:00:00-04:00": {
              "backupPmName":"DM",
              "date": "2020-06-29T00:00:00-04:00",
              "hedgeFactor": 1,
              "mark": {
                "driver":"Spread",
                "enteredTime":"2020-06-29T00:00:00-04:00",
                "user":null,
                "value":275,
                "spread":275,
                "price":142.194017
              },
              "owners":[
                "DA",
                "DM",
                "PD"
              ],
              "partitionOptionValues":{
                "PortfolioShortName":[
                  "STIP"
                ],
                "StrategyName":[
                  "LTOV - Spread"
                ]
              },
              "primaryPmName":"DA",
              "researchName":"PD",
              "source": 1
            }
          }
        }
      },
      "securityType":"Bond",
      "maturityType":"Callable"
    },
    "quote":{
      "partyIds":null,
      "partySubIds":null,
      "allowAddOns":"N",
      "allowPartialFill":"Y",
      "inquiryType":"Holding_Bin",
      "inquiryState":"Dealer Response Required",
      "openTradingLevelMarkup":0.8,
      "partyRank":4,
      "settleDate":20200701,
      "sizeIsMaximum":"N",
      "timersAllowed":"15, 60, 120, 180, 300, 900",
      "tradingProtocol":"Spread",
      "workflowType":"MarketList-Orders",
      "marketListType":"BWIC",
      "marketListDescription":"BWIC started @ 8:16:22 AM and ends @ 8:21:22 AM",
      "fixid":"55835072",
      "fixRefID":null,
      "validUntilTime":"2020-07-08T14:45:22-04:00",
      "priceType":"SPREAD",
      "isNatural":null,
      "ioiQualifier":null,
      "quoteID":"6d363223-a4ad-4255-b088-bd4cb9ed9084",
      "eventDate":"2020-06-29T00:00:00-04:00",
      "creationTime":"2020-06-29T08:16:22.8553597-04:00",
      "lastModifiedTime":"2020-06-29T08:22:42",
      "discriminator":"FixMarketAxessIoi",
      "quoteStatus":null,
      "venue":"MA",
      "eventTime":"2020-06-29T08:16:22-04:00",
      "securityID":69458,
      "globalIdentifierType":"CUSIP",
      "globalIdentifier":"871829BN6",
      "benchmarkSecurityID":66508,
      "globalBenchmarkIdentifierType":null,
      "globalBenchmarkIdentifier":"912810SL3",
      "curveID":null,
      "tenor":null,
      "securityType":"Bond",
      "securityName":null,
      "ticker":null,
      "issuer":null,
      "industrySector":null,
      "currency":"USD",
      "actionFlag":"CT",
      "isActive":false,
      "dealer":"MKTX",
      "side":"Ask",
      "quantity":260000.0,
      "price":null,
      "yieldType":null,
      "yield":null,
      "spread":282.98,
      "rate":null,
      "type":"Axe",
      "isTraded":false,
      "stringQuantity":"260K"
    },
    "marketListAlert":null,
    "isMarketListAlert":true,
    "alertConfigId":"2a2ddbdc-c6a7-4b3a-ba5c-111af04d86cd",
    "alertId":"848ce529-82c5-4058-982f-a37aa2842d67",
    "timeStamp":"2020-06-29T08:22:42.0607573-04:00",
    "isUrgent":true,
    "isActive":true,
    "isDeleted":false,
    "isCancelled":false,
    "sendEmail":false
  },
  {
    "type":"Trade",
    "subType":"Buy",
    "keyWord":"C 31s|8MM 158",
    "message":"DM bought 6MM in CIP, 2MM in BBB",
    "security":{
      "securityIdentifier":"74721",
      "metrics":{
        "Default":{
          "isFixedForLife":false,
          "isFixedToFloatInFixed":true,
          "isFloat":false,
          "isOnTheRun":true,
          "isNewIssue":false,
          "benchmarkSecurityIdentifier":"74094",
          "benchmarkName":"T 0.625 05/15/2030 USD",
          "underlyingSecurityId":-1,
          "yieldWorst":null,
          "amtOutstanding":3500000000.0,
          "marketValue":3609034590.0,
          "workoutTerm":9.9425,
          "ratingDouble":17.0,
          "isRated":true,
          "rating":"A-",
          "ratingNoNotch":"A",
          "ratingBucket":"IG",
          "price":null,
          "spread":null
        }
      },
      "deltaMetrics":{
        "Dod":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Wow":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Mtd":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Mom":{
          "yieldWorst":null,
          "ratingDouble":-1.0,
          "price":null,
          "spread":null
        },
        "Ytd":null,
        "Yoy":null
      },
      "ccy":"USD",
      "country":"US",
      "industry":"Diversified Banks",
      "name":"C 2.572 06/03/2030 06/03/2031 USD SENIOR_UNSECURED",
      "genericSeniority":"SR",
      "globalIdentifier":"US172967MS77",
      "obligorName":"CITIGROUP INC",
      "obligorId":149,
      "paymentRank":"SR UNSECURED",
      "sector":"Financials",
      "securitySubType":"Bond",
      "subIndustry":"Diversified Banking Inst",
      "ticker":"C",
      "unitPosition":{
        "securityIdentifier":"74721",
        "partitionOptionValues":{
          "PortfolioShortName":[
            "AGB",
            "BBB",
            "CIP",
            "STIP",
            ""
          ],
          "StrategyName":[
            ""
          ]
        },
        "mark":{
          "driver":"Spread",
          "enteredTime":"2020-06-29T08:14:22.442-04:00",
          "user":"DM",
          "value":158.0,
          "spread":158.0,
          "price":102.950161
        },
        "hedgeFactor":1.0,
        "primaryPmName":"ST",
        "backupPmName":"DA",
        "researchName":"LP",
        "owners":[
          "ST",
          "DA",
          "LP"
        ],
        "metrics":{
          "FO": {
            "2020-06-29T08:14:22.442-04:00": {
              "backupPmName":"DA",
              "date": "2020-06-29T08:14:22.442-04:00",
              "hedgeFactor":1.0,
              "mark":{
                "driver":"Spread",
                "enteredTime":"2020-06-29T08:14:22.442-04:00",
                "user":"DM",
                "value":158.0,
                "spread":158.0,
                "price":102.950161
              },
              "partitionOptionValues":{
                "PortfolioShortName":[
                  "AGB",
                  "BBB",
                  "CIP",
                  "STIP",
                  ""
                ],
                "StrategyName":[
                  ""
                ]
              },
              "owners":[
                "ST",
                "DA",
                "LP"
              ],
              "primaryPmName":"ST",
              "researchName":"LP",
              "source": 1
            }
          }
        }
      },
      "securityType":"Bond",
      "maturityType":"Callable"
    },
    "trades":[
      {
        "partitionOptionValue":{
          "PortfolioShortName":"CIP",
          "StrategyName":"LTOV - Spread"
        },
        "tradeId":"5295639",
        "parentTradeId":"5295635",
        "trader":"DM",
        "quantity":5725000.0,
        "tradeDateTime":"2020-06-29T08:18:00-04:00",
        "price":103.028,
        "counterpartyName":"MS",
        "spread":158.0,
        "quantityAfterTrade":11879000.0,
        "wgtAvgSpread":158.26,
        "wgtAvgPrice":102.9298,
        "isCancelled":false
      },
      {
        "partitionOptionValue":{
          "PortfolioShortName":"BBB",
          "StrategyName":"LTOV - Spread"
        },
        "tradeId":"5295640",
        "parentTradeId":"5295635",
        "trader":"DM",
        "quantity":2025000.0,
        "tradeDateTime":"2020-06-29T08:18:00-04:00",
        "price":103.028,
        "counterpartyName":"MS",
        "spread":158.0,
        "quantityAfterTrade":4201000.0,
        "wgtAvgSpread":158.26,
        "wgtAvgPrice":102.9299,
        "isCancelled":false
      }
    ],
    "alertConfigId":"7dc03f68-fbb6-4c06-90d5-c18b188c19f6",
    "alertId":"5295635",
    "timeStamp":"2020-06-29T08:20:03.5245241-04:00",
    "isUrgent":true,
    "isActive":true,
    "isDeleted":false,
    "isCancelled":false,
    "sendEmail": false
  },
  {
    "type":"Mark",
    "subType":"Bid",
    "keyWord":"ISPIM 24s|5MM 233/",
    "message":"BNP bids 12 bps better than our mark (245 bps). Position: 66MM, CS01: 37K",
    "security":{
      "securityIdentifier":"60102",
      "metrics":{
        "Default":{
          "isFixedForLife":true,
          "isFixedToFloatInFixed":false,
          "isFloat":false,
          "isOnTheRun":false,
          "isNewIssue":false,
          "benchmarkSecurityIdentifier":"74791",
          "benchmarkName":"T 0.25 05/31/2025 USD",
          "underlyingSecurityId":-1,
          "yieldWorst":null,
          "amtOutstanding":750000000.0,
          "marketValue":771497542.0,
          "workoutTerm":4.2466,
          "ratingDouble":15.25,
          "isRated":true,
          "rating":"BBB",
          "ratingNoNotch":"BBB",
          "ratingBucket":"IG",
          "price":null,
          "spread":null
        }
      },
      "deltaMetrics":{
        "Dod":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Wow":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Mtd":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Mom":{
          "yieldWorst":null,
          "ratingDouble":0.0,
          "price":null,
          "spread":null
        },
        "Ytd":{
          "yieldWorst":null,
          "ratingDouble":-0.25,
          "price":null,
          "spread":null
        },
        "Yoy":null
      },
      "ccy":"USD",
      "country":"IT",
      "industry":"Banks",
      "name":"ISPIM 3.25 09/23/2024 Bullet USD SENIOR_UNSECURED",
      "genericSeniority":"SR",
      "globalIdentifier":"US46115HBJ59",
      "obligorName":"INTESA SANPAOLO SPA",
      "obligorId":685,
      "paymentRank":"SR PREFERRED",
      "sector":"Financials",
      "securitySubType":"Bond",
      "subIndustry":"Commer Banks Non-US",
      "ticker":"ISPIM",
      "unitPosition":{
        "securityIdentifier":"60102",
        "partitionOptionValues":{
          "PortfolioShortName":[
            "AGB",
            "DOF",
            "STIP",
            ""
          ],
          "StrategyName":[
            "LTOV - Spread"
          ]
        },
        "mark":{
          "driver":"Spread",
          "enteredTime":"2020-06-29T00:00:00-04:00",
          "user":null,
          "value":245.0,
          "spread":245.0,
          "price":102.025422
        },
        "hedgeFactor":1.0,
        "primaryPmName":"DM",
        "backupPmName":"RS",
        "researchName":"LP",
        "owners":[
          "DM",
          "RS",
          "LP"
        ],
        "metrics": {
          "FO": {
            "2020-06-29T00:00:00-04:00": {
              "backupPmName":"RS",
              "date": "2020-06-29T00:00:00-04:00",
              "hedgeFactor":1.0,
              "mark":{
                "driver":"Spread",
                "enteredTime":"2020-06-29T00:00:00-04:00",
                "user":null,
                "value":245.0,
                "spread":245.0,
                "price":102.025422
              },
              "partitionOptionValues":{
                "PortfolioShortName":[
                  "AGB",
                  "DOF",
                  "STIP",
                  ""
                ],
                "StrategyName":[
                  "LTOV - Spread"
                ]
              },
              "owners":[
                "DM",
                "RS",
                "LP"
              ],
              "primaryPmName":"DM",
              "researchName":"LP",
              "source": 1
            }
          }
        }
      },
      "securityType":"Bond",
      "maturityType":"Bullet"
    },
    "quote":{
      "benchmarkYellowkey":null,
      "isSpreadDerived":false,
      "isYieldDerived":false,
      "isPriceDerived":false,
      "coupon":3.25,
      "maturity":"2024-09-23T00:00:00",
      "equityReferencePrice":null,
      "isGreyMarket":false,
      "class":"BOND_OFFER",
      "msG1MessageID":"5EF999EF00009D9329280001",
      "messageSequenceNumber":231641372,
      "messageSequenceTimestamp":1593416182005,
      "priceValidityIndicator":true,
      "bloombergIdentifier":"ZR6421591",
      "bloombergGlobalIdentifier":"BBG00Q99TTT7",
      "quoteID":"bf601fa6-de4b-468d-a6ba-91d254928a8f",
      "eventDate":"2020-06-29T00:00:00",
      "creationTime":"2020-06-29T03:36:22",
      "lastModifiedTime":"2020-06-29T03:36:44",
      "discriminator":"Msg1BondQuote",
      "quoteStatus":null,
      "venue":"MSG1",
      "eventTime":"2020-06-29T03:36:18",
      "securityID":60102,
      "globalIdentifierType":"ISIN",
      "globalIdentifier":"US46115HBJ59",
      "benchmarkSecurityID":null,
      "globalBenchmarkIdentifierType":null,
      "globalBenchmarkIdentifier":null,
      "curveID":null,
      "tenor":null,
      "securityType":"Bond",
      "securityName":"ISPIM 3 ¼ 09/23/24",
      "ticker":"ISPIM",
      "issuer":"INTESA SANPAOLO SPA",
      "industrySector":"Financial",
      "currency":"USD",
      "actionFlag":"N",
      "isActive":true,
      "dealer":"BNP",
      "side":"Bid",
      "quantity":5000000.0,
      "price":102.4000015258789,
      "yieldType":"YTW",
      "yield":2.634200096130371,
      "spread":233.0,
      "rate":null,
      "type":"Axe",
      "isTraded":false,
      "stringQuantity":"5MM"
    },
    "marketListAlert":null,
    "isMarketListAlert":false,
    "alertConfigId":"2a2ddbdc-c6a7-4b2a-ba5c-999af04d86cd",
    "alertId":"03d3ae10-f680-4d2d-820c-5f27f988263f",
    "timeStamp":"2020-06-29T07:22:37.0754935-04:00",
    "isUrgent":true,
    "isActive":true,
    "isDeleted":false,
    "isCancelled":false,
    "sendEmail":false
  }
]
