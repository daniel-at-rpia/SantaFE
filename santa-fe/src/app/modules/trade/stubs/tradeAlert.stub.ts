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
      "isEnabled": true
    }
  }
}

export const AlertSample: Array<BEAlertDTO> = [
  {
    "type":"Axe",
    "subType":"Ask",
    "keyWord":"ABT 37s|1MM ",
    "message":"MKTX BWIC expires at 5:52:58 PM",
    "security":{
      "isSovereign":false,
      "isGovt":false,
      "isEm":false,
      "securityIdentifier":"3104",
      "ccy":"USD",
      "country":"US",
      "industry":"Medical Equipment & Devices Manufacturing",
      "name":"ABT 6.15 11/30/37",
      "genericSeniority":"SR",
      "globalIdentifier":"US002819AC45",
      "obligorName":"ABBOTT LABORATORIES",
      "obligorId":7,
      "paymentRank":"SR UNSECURED",
      "sector":"Health Care",
      "securitySubType":"Bond",
      "subIndustry":"Medical Products",
      "ticker":"ABT",
      "metrics":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":false,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":null,
        "benchmarkName":null,
        "underlyingSecurityId":-1,
        "zSpread":229.215,
        "gSpread":221.8343,
        "yieldWorst":3.01709,
        "amtOutstanding":546911000,
        "marketValue":780004468,
        "workoutTerm":17.6712,
        "ratingDouble":17,
        "isRated":true,
        "rating":"A-",
        "ratingNoNotch":"A",
        "ratingBucket":"IG",
        "price":142.62,
        "spread":null,
        "isIndex":true
      },
      "deltaMetrics":{
        "Dod":{
          "zSpread":4.543,
          "gSpread":-0.0346,
          "yieldWorst":-0.00496,
          "ratingDouble":0,
          "price":0.08,
          "spread":null
        },
        "Wow":{
          "zSpread":-16.363,
          "gSpread":-12.7976,
          "yieldWorst":-0.19409,
          "ratingDouble":0,
          "price":3.237,
          "spread":null
        },
        "Mtd":{
          "zSpread":-9.595,
          "gSpread":-7.3806,
          "yieldWorst":-0.19507,
          "ratingDouble":0,
          "price":3.262,
          "spread":null
        },
        "Mom":{
          "zSpread":84.844,
          "gSpread":86.0523,
          "yieldWorst":0.44034,
          "ratingDouble":0,
          "price":-7.988,
          "spread":null
        },
        "Ytd":{
          "zSpread":113.061,
          "gSpread":112.8662,
          "yieldWorst":-0.1496,
          "ratingDouble":0,
          "price":2.085,
          "spread":null
        },
        "Yoy":{
          "zSpread":59.898,
          "gSpread":64.0843,
          "yieldWorst":-1.30095,
          "ratingDouble":null,
          "price":19.324,
          "spread":null
        }
      },
      "firmPosition":null,
      "securityType":"Bond",
      "maturityType":"Bullet"
    },
    "quoteId":"31a54120-abf1-4fba-83e7-83ead49566ff",
    "marketListType":"BWIC",
    "alertConfigId":"e1c3985a-834e-4d7b-979c-e36c12878f83",
    "alertId":"ddf277ef-d7db-4967-ae3f-79930d7e5f89",
    "timeStamp":"2020-04-06T17:51:24.7004356-04:00",
    "urgency":0,
    "isActive":true,
    "isDeleted":false,
    validUntilTime: new Date().toISOString()

  },
  {
    "type":"MarketList",
    "subType":"Bwic",
    "keyWord":"BWIC|expires in 2 min(s)",
    "message":"BWIC started @ 5:50:58 PM and ends @ 5:52:58 PM",
    "marketListType":"BWIC",
    "marketListDescription":"BWIC started @ 5:50:58 PM and ends @ 5:52:58 PM",
    "securityIdentifierToQuoteId":{
      "3104":"31a54120-abf1-4fba-83e7-83ead49566ff"
    },
    "alertConfigId":"BWIC started @ 5:50:58 PM and ends @ 5:52:58 PM",
    "alertId":"02301f0e-c288-4597-bdc5-5d16acd125e3",
    "timeStamp":"2020-04-06T17:51:24.7003944-04:00",
    "urgency":0,
    "isActive":true,
    "isDeleted":false,
    validUntilTime: new Date().toISOString()
  },
  {
    "type":"Mark",
    "subType":"Bid",
    "keyWord":"WES 25s|5MM 70.5/",
    "message":"SEAP bids 2.5 pts better than our mark (68 pts). Position: 40MM, CS01: 16K",
    "security":{
      "isSovereign":false,
      "isGovt":false,
      "isEm":false,
      "securityIdentifier":"64806",
      "ccy":"USD",
      "country":"US",
      "industry":"Pipeline",
      "name":"WES 3.1 02/01/2025 Callable USD SENIOR_UNSECURED",
      "genericSeniority":"SR",
      "globalIdentifier":"US958667AB34",
      "obligorName":"WESTERN MIDSTREAM OPERATING LP",
      "obligorId":1773,
      "paymentRank":"SR UNSECURED",
      "sector":"Energy",
      "securitySubType":"Bond",
      "subIndustry":"Pipelines",
      "ticker":"WES",
      "metrics":{
        "isFixedForLife":true,
        "isFixedToFloatInFixed":false,
        "isFloat":false,
        "isOnTheRun":true,
        "isNewIssue":false,
        "benchmarkSecurityIdentifier":"69347",
        "benchmarkName":"T 0.5 03/31/2025 USD",
        "underlyingSecurityId":-1,
        "zSpread":1225.92,
        "gSpread":1239.9466,
        "yieldWorst":12.7407,
        "amtOutstanding":1000000000,
        "marketValue":668582000,
        "workoutTerm":4.8356,
        "ratingDouble":13,
        "isRated":true,
        "rating":"BB+",
        "ratingNoNotch":"BB",
        "ratingBucket":"HY",
        "price":66.8582,
        "spread":1208.6881,
        "isIndex":true
      },
      "deltaMetrics":{
        "Dod":{
          "zSpread":-403.65,
          "gSpread":-405.2455,
          "yieldWorst":-4.0526,
          "ratingDouble":0,
          "price":10.2061,
          "spread":-404.0158
        },
        "Wow":{
          "zSpread":-719.07,
          "gSpread":-718.8756,
          "yieldWorst":-7.2297,
          "ratingDouble":0,
          "price":17.0472,
          "spread":-720.2084
        },
        "Mtd":{
          "zSpread":-667.42,
          "gSpread":-667.859,
          "yieldWorst":-6.7064,
          "ratingDouble":0,
          "price":15.9622,
          "spread":-665.4902
        },
        "Mom":{
          "zSpread":1005.759,
          "gSpread":1011.2976,
          "yieldWorst":9.71478,
          "ratingDouble":-1,
          "price":-33.4698,
          "spread":980.419
        },
        "Ytd":null,
        "Yoy":null
      },
      "firmPosition":{
        "partitionOptionValues":{
          "PortfolioShortName":[
            "AGB",
            "BBB",
            "CIP",
            "DOF",
            "SOF",
            "STIP"
          ],
          "StrategyName":[
            "LTOV - Yield"
          ]
        },
        "mark":{
          "driver":"Price",
          "enteredTime":"2020-04-06T15:20:24.559-04:00",
          "user":"IL",
          "value":71,
          "price": 72,
          "spread": 73
        },
        "primaryPmName":"IL",
        "backupPmName":"PM",
        "researchName":"AG",
        "owners":[
          "IL",
          "PM",
          "AG"
        ],
        "date":"2020-04-06T00:00:00-04:00",
        "securityIdentifier":"64806",
        "quantity":39531000,
        "cs01Cad":15725.033248458,
        "cs01Local":11121.743580492255,
        "hedgeFactor":0
      },
      "securityType":"Bond",
      "maturityType":"Callable"
    },
    "quoteId":"460ec687-a561-4aef-9de2-178b4e4335a9",
    "alertConfigId":"afac7751-86ce-4007-b023-f8abc8b130ce",
    "alertId":"74111f78-1e95-4fcb-8fad-655015f30a1e",
    "timeStamp":"2020-04-06T16:04:17.8217249-04:00",
    "urgency":0,
    "isActive":true,
    "isDeleted":false,
    validUntilTime: new Date().toISOString()

  }
]
