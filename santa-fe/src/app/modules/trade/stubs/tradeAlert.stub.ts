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
      "isUrgent": false
    }
  }
}

export const AlertSample: Array<BEAlertDTO> = [
  {
    "type":"Axe",
    "subType":"Bid",
    "keyWord":"MO 50s|5MM 298/",
    "message":"BARC bids",
    "security":{
      "isSovereign":false,
      "isGovt":false,
      "isEm":false,
      "securityIdentifier":"72594",
      "ccy":"USD",
      "country":"US",
      "industry":"Tobacco",
      "name":"MO 4.45 05/06/2050 Callable USD SENIOR_UNSECURED",
      "genericSeniority":"SR",
      "globalIdentifier":"US02209SBK87",
      "obligorName":"ALTRIA GROUP INC",
      "obligorId":533,
      "paymentRank":"SR UNSECURED",
      "sector":"Consumers",
      "securitySubType":"Bond",
      "subIndustry":"Tobacco",
      "ticker":"MO",
      "metrics":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":true,
        "benchmarkSecurityIdentifier":"63089",
        "benchmarkName":"T 2.375 11/15/2049 USD",
        "underlyingSecurityId":-1,
        "zSpread":346.171,
        "gSpread":295.3865,
        "yieldWorst":4.24588,
        "amtOutstanding":500000000.0,
        "marketValue":517060000.0,
        "workoutTerm":29.9973,
        "ratingDouble":15.0,
        "isRated":true,
        "rating":"BBB",
        "ratingNoNotch":"BBB",
        "ratingBucket":"IG",
        "price":103.412,
        "spread":296.7828999999999,
        "isIndex":true
      },
      "deltaMetrics":{
        "Dod":{
          "zSpread":-2.837,
          "gSpread":-0.2871,
          "yieldWorst":-0.06585,
          "ratingDouble":0.0,
          "price":1.118,
          "spread":-0.0603
        },
        "Wow":{
          "zSpread":-4.461,
          "gSpread":-0.959,
          "yieldWorst":-0.05775,
          "ratingDouble":0.0,
          "price":0.981,
          "spread":-0.7777
        },
        "Mtd":null,
        "Mom":null,
        "Ytd":null,
        "Yoy":null
      },
      "unitPosition":{
        "metricDate":"2020-05-15T00:00:00-04:00",
        "securityIdentifier":"72594",
        "partitionOptionValues":{
          "PortfolioShortName":[
            "AGB",
            "STIP"
          ],
          "StrategyName":[
            "LTOV - Spread"
          ]
        },
        "mark":{
          "driver":"Spread",
          "enteredTime":"2020-05-15T13:32:29.98-04:00",
          "user":"DM",
          "value":290.0,
          "spread":290.0,
          "price":104.613664
        },
        "hedgeFactor":1.0,
        "primaryPmName":"DM",
        "backupPmName":"DA",
        "researchName":"PD",
        "owners":[
          "DM",
          "DA",
          "PD"
        ]
      },
      "securityType":"Bond",
      "maturityType":"Callable"
    },
    "quote":{
      "benchmarkYellowkey":"Govt",
      "isSpreadDerived":false,
      "isYieldDerived":true,
      "isPriceDerived":true,
      "coupon":4.449999809265137,
      "maturity":"2050-05-06T00:00:00",
      "equityReferencePrice":null,
      "isGreyMarket":false,
      "class":"BOND_OFFER",
      "msG1MessageID":"5EBED6BA00011E1239710006",
      "messageSequenceNumber":190367320,
      "messageSequenceTimestamp":1589565141849,
      "priceValidityIndicator":true,
      "bloombergIdentifier":"BJ2645841",
      "bloombergGlobalIdentifier":"BBG00TN4Q307",
      "quoteID":"9a8e2e82-779f-455b-a96b-dc477616090c",
      "eventDate":"2020-05-15T00:00:00-04:00",
      "creationTime":"2020-05-15T13:52:20.490361-04:00",
      "lastModifiedTime":"0001-01-01T00:00:00",
      "discriminator":"Msg1BondQuote",
      "quoteStatus":null,
      "venue":"MSG1",
      "eventTime":"2020-05-15T13:51:54-04:00",
      "securityID":72594,
      "globalIdentifierType":"ISIN",
      "globalIdentifier":"US02209SBK87",
      "benchmarkSecurityID":63089,
      "globalBenchmarkIdentifierType":"ID_BB",
      "globalBenchmarkIdentifier":"912810SK5",
      "curveID":null,
      "tenor":null,
      "securityType":"Bond",
      "securityName":"MO 4.45 05/06/50",
      "ticker":"MO",
      "issuer":"ALTRIA GROUP INC",
      "industrySector":"Consumer, Non-cyclical",
      "currency":"USD",
      "actionFlag":"N",
      "isActive":true,
      "dealer":"BARC",
      "side":"Bid",
      "quantity":5000000.0,
      "price":102.69400024414062,
      "yieldType":"YTW",
      "yield":4.288000106811523,
      "spread":298.0,
      "rate":null,
      "type":"Axe",
      "stringQuantity":"5MM"
    },
    "marketListAlert":null,
    "alertConfigId":"804d7a74-1211-4576-9f79-d70dc0766bb7",
    "alertId":"eab870bf-1dc6-41f1-bc99-1a2d0eec267b",
    "timeStamp":"2020-05-15T13:52:49.3804456-04:00",
    "isUrgent":true,
    "isActive":true,
    "isDeleted":false,
    "isCancelled":false
  },
  {
    "type":"Trade",
    "subType":"Buy",
    "keyWord":"ETRHWY 32s|2MM",
    "message":"DM bought 1MM in STIP, 567K in CIP, 201K in BBB, 161K in AGB",
    "security":{
      "isSovereign":false,
      "isGovt":false,
      "isEm":false,
      "securityIdentifier":"74243",
      "ccy":"CAD",
      "country":"CA",
      "industry":"Industrial Other",
      "name":"ETRHWY 2.59 05/25/2032 Callable CAD SENIOR_SECURED",
      "genericSeniority":"SECURED",
      "globalIdentifier":"CA35085ZBX39",
      "obligorName":"407 INTERNATIONAL INC",
      "obligorId":1042,
      "paymentRank":"SECURED",
      "sector":"Industrials",
      "securitySubType":"Bond",
      "subIndustry":"Public Thoroughfares",
      "ticker":"ETRHWY",
      "metrics":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":false,
        "isNewIssue":true,
        "benchmarkSecurityIdentifier":"57357",
        "benchmarkName":"CAN 1.25 06/01/2030 CAD",
        "underlyingSecurityId":-1,
        "zSpread":150.8953,
        "gSpread":186.71,
        "yieldWorst":2.493946,
        "amtOutstanding":400000000.0,
        "marketValue":403900968.0,
        "workoutTerm":11.7918,
        "ratingDouble":18.0,
        "isRated":true,
        "rating":"A",
        "ratingNoNotch":"A",
        "ratingBucket":"IG",
        "price":100.975242,
        "spread":197.0,
        "isIndex":false
      },
      "deltaMetrics":{
        "Dod":null,
        "Wow":null,
        "Mtd":null,
        "Mom":null,
        "Ytd":null,
        "Yoy":null
      },
      "unitPosition":{
        "metricDate":"2020-05-15T00:00:00-04:00",
        "securityIdentifier":"74243",
        "partitionOptionValues":{
          "PortfolioShortName":[
            "AGB",
            "BBB",
            "CIP",
            "STIP"
          ],
          "StrategyName":[
            "LTOV - Spread"
          ]
        },
        "mark":{
          "driver":"Spread",
          "enteredTime":"2020-05-15T00:00:00-04:00",
          "user":null,
          "value":197.0,
          "spread":197.0,
          "price":101.115208
        },
        "hedgeFactor":1.0,
        "primaryPmName":"IL",
        "backupPmName":"ST",
        "researchName":"TW",
        "owners":[
          "IL",
          "ST",
          "TW"
        ]
      },
      "securityType":"Bond",
      "maturityType":"Callable"
    },
    "trades":[
      {
        "partitionOptionValue":{
          "PortfolioShortName":"STIP",
          "StrategyName":"LTOV - Spread"
        },
        "tradeId":"5142772",
        "parentTradeId":"5142770",
        "trader":"DM",
        "quantity":1071000.0,
        "tradeDateTime":"2020-05-15T11:54:00-04:00",
        "price":1.01139,
        "counterpartyName":"RBC TOR",
        "spread":197.0,
        "isCancelled":false,
        "shouldCalculateSpread":true,
        "shouldCalculatePrice":true,
        "securityQuantityAfterTrade":13386000.0,
        "fifoAvgSpread":204.36060062752128,
        "wgtAvgSpread":204.36060062752128,
        "fifoAvgPrice":1.0014453563424472,
        "wgtAvgPrice":1.0014453563424472
      },
      {
        "partitionOptionValue":{
          "PortfolioShortName":"CIP",
          "StrategyName":"LTOV - Spread"
        },
        "tradeId":"5142773",
        "parentTradeId":"5142770",
        "trader":"DM",
        "quantity":567000.0,
        "tradeDateTime":"2020-05-15T11:54:00-04:00",
        "price":1.01139,
        "counterpartyName":"RBC TOR",
        "spread":197.0,
        "isCancelled":false,
        "shouldCalculateSpread":true,
        "shouldCalculatePrice":true,
        "securityQuantityAfterTrade":7092000.0,
        "fifoAvgSpread":204.35659898477158,
        "wgtAvgSpread":204.35659898477158,
        "fifoAvgPrice":1.0014496446700507,
        "wgtAvgPrice":1.0014496446700507
      },
      {
        "partitionOptionValue":{
          "PortfolioShortName":"BBB",
          "StrategyName":"LTOV - Spread"
        },
        "tradeId":"5142774",
        "parentTradeId":"5142770",
        "trader":"DM",
        "quantity":201000.0,
        "tradeDateTime":"2020-05-15T11:54:00-04:00",
        "price":1.01139,
        "counterpartyName":"RBC TOR",
        "spread":197.0,
        "isCancelled":false,
        "shouldCalculateSpread":true,
        "shouldCalculatePrice":true,
        "securityQuantityAfterTrade":2511000.0,
        "fifoAvgSpread":204.36320191158902,
        "wgtAvgSpread":204.36320191158902,
        "fifoAvgPrice":1.00144256869773,
        "wgtAvgPrice":1.00144256869773
      },
      {
        "partitionOptionValue":{
          "PortfolioShortName":"AGB",
          "StrategyName":"LTOV - Spread"
        },
        "tradeId":"5142775",
        "parentTradeId":"5142770",
        "trader":"DM",
        "quantity":161000.0,
        "tradeDateTime":"2020-05-15T11:54:00-04:00",
        "price":1.01139,
        "counterpartyName":"RBC TOR",
        "spread":197.0,
        "isCancelled":false,
        "shouldCalculateSpread":true,
        "shouldCalculatePrice":true,
        "securityQuantityAfterTrade":2011000.0,
        "fifoAvgSpread":204.36399801093984,
        "wgtAvgSpread":204.36399801093984,
        "fifoAvgPrice":1.0014417155643958,
        "wgtAvgPrice":1.001441715564396
      }
    ],
    "alertConfigId":"29ac6fe1-18cf-42c4-8936-69406f6b4ed3",
    "alertId":"5142770",
    "timeStamp":"2020-05-15T13:55:44.1011412-04:00",
    "isUrgent":true,
    "isActive":true,
    "isDeleted":false,
    "isCancelled":false
  }
]
