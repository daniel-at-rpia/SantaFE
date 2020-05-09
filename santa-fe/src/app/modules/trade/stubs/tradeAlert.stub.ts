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
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "AVGO 30s|2MM /345",
    "message": "MUFG offers",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "72963",
      "ccy": "USD",
      "country": "US",
      "industry": "Semiconductors",
      "name": "AVGO 4.15 11/15/2030 Callable USD 144A SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US11135FAP62",
      "obligorName": "BROADCOM INC",
      "obligorId": 1539,
      "paymentRank": "SR UNSECURED",
      "sector": "Technology",
      "securitySubType": "Bond",
      "subIndustry": "Electronic Compo-Semicon",
      "ticker": "AVGO",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": true,
        "benchmarkSecurityIdentifier": "66248",
        "benchmarkName": "T 1.5 02/15/2030 USD",
        "underlyingSecurityId": -1,
        "zSpread": 354.975,
        "gSpread": 347.2579,
        "yieldWorst": 4.13909,
        "amtOutstanding": 2750000000,
        "marketValue": 2752502500,
        "workoutTerm": 10.5315,
        "ratingDouble": 14,
        "isRated": true,
        "rating": "BBB-",
        "ratingNoNotch": "BBB",
        "ratingBucket": "IG",
        "price": 100.091,
        "spread": 349.8219,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": 2.968,
          "gSpread": 1.2646,
          "yieldWorst": -0.04774,
          "ratingDouble": 0,
          "price": 0.4027,
          "spread": 1.4401
        },
        "Wow": null,
        "Mtd": null,
        "Mom": null,
        "Ytd": null,
        "Yoy": null
      },
      "unitPosition": {
        "metricDate": "2020-05-08T00:00:00-04:00",
        "securityIdentifier": "72963",
        "partitionOptionValues": {
          "PortfolioShortName": [
            "AGB",
            "BBB",
            "CIP",
            "DOF"
          ],
          "StrategyName": [
            "STOV"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-05-08T00:00:00-04:00",
          "user": null,
          "value": 344,
          "spread": 344,
          "price": 100.57713385
        },
        "hedgeFactor": 1,
        "primaryPmName": "DM",
        "backupPmName": "IL",
        "researchName": "LC",
        "owners": [
          "DM",
          "IL",
          "LC"
        ]
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "quote": {
      "benchmarkYellowkey": null,
      "isSpreadDerived": false,
      "isYieldDerived": false,
      "isPriceDerived": false,
      "coupon": 4.150000095367432,
      "maturity": "2030-11-15T00:00:00",
      "equityReferencePrice": null,
      "isGreyMarket": false,
      "class": "BOND_OFFER",
      "msG1MessageID": "5EB539D40000ABED29250001",
      "messageSequenceNumber": 183323259,
      "messageSequenceTimestamp": 1588935132304,
      "priceValidityIndicator": true,
      "bloombergIdentifier": "BJ3037543",
      "bloombergGlobalIdentifier": "BBG00TNR5WJ5",
      "quoteID": "655f0ca1-66c9-4a26-b2d9-a59c7d0eef99",
      "eventDate": "2020-05-08T00:00:00",
      "creationTime": "2020-05-08T06:52:10",
      "lastModifiedTime": "2020-05-08T06:52:19",
      "discriminator": "Msg1BondQuote",
      "quoteStatus": null,
      "venue": "MSG1",
      "eventTime": "2020-05-08T06:52:04",
      "securityID": 72963,
      "globalIdentifierType": "ISIN",
      "globalIdentifier": "US11135FAP62",
      "benchmarkSecurityID": null,
      "globalBenchmarkIdentifierType": null,
      "globalBenchmarkIdentifier": null,
      "curveID": null,
      "tenor": null,
      "securityType": "Bond",
      "securityName": "AVGO 4.15 11/15/30",
      "ticker": "AVGO",
      "issuer": "BROADCOM INC",
      "industrySector": "Technology",
      "currency": "USD",
      "actionFlag": "N",
      "isActive": true,
      "dealer": "MUFG",
      "side": "Ask",
      "quantity": 2000000,
      "price": 100.70999908447266,
      "yieldType": "YTW",
      "yield": 4.065000057220459,
      "spread": 345,
      "rate": null,
      "type": "Axe",
      "stringQuantity": "2MM"
    },
    "validUntilTime": null,
    "marketListType": null,
    "alertConfigId": "a17dfeed-99af-4d61-89a9-68e7e2bd5501",
    "alertId": "4f95cf06-7713-437a-83b9-791233fe08b3",
    "timeStamp": "2020-05-08T18:47:10.1789893-04:00",
    "isUrgent": false,
    "isActive": true,
    "isDeleted": false,
    "isCancelled": false
  },
  {
    "type": "Mark",
    "subType": "Bid",
    "keyWord": "ABBV 29s|5MM 181/",
    "message": "SEAP bids 10 bps better than our mark (191 bps). Position: 23MM, CS01: 28K",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "63112",
      "ccy": "USD",
      "country": "US",
      "industry": "Pharmaceuticals",
      "name": "ABBV 3.2 11/21/2029 Callable USD 144A SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US00287YBW84",
      "obligorName": "ABBVIE INC",
      "obligorId": 1762,
      "paymentRank": "SR UNSECURED",
      "sector": "Health Care",
      "securitySubType": "Bond",
      "subIndustry": "Medical-Drugs",
      "ticker": "ABBV",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": false,
        "benchmarkSecurityIdentifier": "66248",
        "benchmarkName": "T 1.5 02/15/2030 USD",
        "underlyingSecurityId": -1,
        "zSpread": 198.327,
        "gSpread": 190.7335,
        "yieldWorst": 2.53163,
        "amtOutstanding": 5500000000,
        "marketValue": 5802335000,
        "workoutTerm": 9.2959,
        "ratingDouble": 17,
        "isRated": true,
        "rating": "A-",
        "ratingNoNotch": "A",
        "ratingBucket": "IG",
        "price": 105.497,
        "spread": 188.8842,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": 4.363,
          "gSpread": 3.0185,
          "yieldWorst": -0.03318,
          "ratingDouble": 0,
          "price": 0.277,
          "spread": 2.8467
        },
        "Wow": {
          "zSpread": 16.582,
          "gSpread": 12.355,
          "yieldWorst": 0.11914,
          "ratingDouble": 0,
          "price": -1.028,
          "spread": null
        },
        "Mtd": {
          "zSpread": 16.582,
          "gSpread": 12.355,
          "yieldWorst": 0.11914,
          "ratingDouble": 0,
          "price": -1.028,
          "spread": null
        },
        "Mom": {
          "zSpread": -34.891,
          "gSpread": -47.882,
          "yieldWorst": -0.5627,
          "ratingDouble": 0,
          "price": 4.643,
          "spread": null
        },
        "Ytd": {
          "zSpread": 87.107,
          "gSpread": 84.8593,
          "yieldWorst": -0.44476,
          "ratingDouble": 0,
          "price": 3.636,
          "spread": null
        },
        "Yoy": null
      },
      "unitPosition": {
        "metricDate": "2020-05-08T00:00:00-04:00",
        "securityIdentifier": "63112",
        "partitionOptionValues": {
          "PortfolioShortName": [
            "CIP",
            "STIP"
          ],
          "StrategyName": [
            "STOV"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-05-08T00:00:00-04:00",
          "user": null,
          "value": 191,
          "spread": 191,
          "price": 104.96773
        },
        "hedgeFactor": 1,
        "primaryPmName": "DM",
        "backupPmName": "SP",
        "researchName": "AG",
        "owners": [
          "DM",
          "SP",
          "AG"
        ]
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "quote": {
      "benchmarkYellowkey": "Govt",
      "isSpreadDerived": false,
      "isYieldDerived": false,
      "isPriceDerived": false,
      "coupon": 3.200000047683716,
      "maturity": "2029-11-21T00:00:00",
      "equityReferencePrice": null,
      "isGreyMarket": false,
      "class": "BOND_OFFER",
      "msG1MessageID": "5EB5352800029C6429210001",
      "messageSequenceNumber": 183310583,
      "messageSequenceTimestamp": 1588933946476,
      "priceValidityIndicator": true,
      "bloombergIdentifier": "ZQ5840868",
      "bloombergGlobalIdentifier": "BBG00QTYHH55",
      "quoteID": "ecb1903f-9692-4c0b-97aa-bb3489b6e918",
      "eventDate": "2020-05-08T00:00:00",
      "creationTime": "2020-05-08T06:32:24",
      "lastModifiedTime": "2020-05-08T06:32:30",
      "discriminator": "Msg1BondQuote",
      "quoteStatus": null,
      "venue": "MSG1",
      "eventTime": "2020-05-08T06:32:15",
      "securityID": 63112,
      "globalIdentifierType": "ISIN",
      "globalIdentifier": "US00287YBW84",
      "benchmarkSecurityID": 66248,
      "globalBenchmarkIdentifierType": "ID_BB",
      "globalBenchmarkIdentifier": "912828Z94",
      "curveID": null,
      "tenor": null,
      "securityType": "Bond",
      "securityName": "ABBV 3.2 11/21/29",
      "ticker": "ABBV",
      "issuer": "ABBVIE INC",
      "industrySector": "Consumer, Non-cyclical",
      "currency": "USD",
      "actionFlag": "N",
      "isActive": true,
      "dealer": "SEAP",
      "side": "Bid",
      "quantity": 5000000,
      "price": 106.40399932861328,
      "yieldType": "YTW",
      "yield": 2.424999952316284,
      "spread": 181,
      "rate": null,
      "type": "Axe",
      "stringQuantity": "5MM"
    },
    "alertConfigId": "c6be6d47-26e9-41f4-9026-e5885a8a7fae",
    "alertId": "df4fec13-c965-4fca-847d-22fa05816705",
    "timeStamp": "2020-05-08T18:47:10.1640016-04:00",
    "isUrgent": true,
    "isActive": true,
    "isDeleted": false,
    "isCancelled": false
  },
  {
    "type": "Trade",
    "subType": "Buy",
    "keyWord": "OVV 21s|447K",
    "message": "447K in DOF",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "11663",
      "ccy": "USD",
      "country": "CA",
      "industry": "Exploration & Production",
      "name": "OVV 3.9 11/15/2021 Callable USD SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US292505AJ36",
      "obligorName": "OVINTIV INC",
      "obligorId": 7279,
      "paymentRank": "SR UNSECURED",
      "sector": "Energy",
      "securitySubType": "Bond",
      "subIndustry": "Oil Comp-Explor&Prodtn",
      "ticker": "OVV",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": false,
        "benchmarkSecurityIdentifier": "70900",
        "benchmarkName": "T 0.125 04/30/2022 USD",
        "underlyingSecurityId": -1,
        "zSpread": 868.762,
        "gSpread": 882.92,
        "yieldWorst": 8.94981,
        "amtOutstanding": 600000000,
        "marketValue": 558040800,
        "workoutTerm": 1.526,
        "ratingDouble": 14,
        "isRated": true,
        "rating": "BBB-",
        "ratingNoNotch": "BBB",
        "ratingBucket": "IG",
        "price": 93.0068,
        "spread": 885.3485999999999,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": -30.429,
          "gSpread": -32.639,
          "yieldWorst": -0.3554,
          "ratingDouble": 0,
          "price": 0.506,
          "spread": -29.4426
        },
        "Wow": {
          "zSpread": -152.508,
          "gSpread": -154.9731,
          "yieldWorst": -1.59269,
          "ratingDouble": 0,
          "price": 2.1778,
          "spread": -154.0857
        },
        "Mtd": {
          "zSpread": -152.508,
          "gSpread": -154.9731,
          "yieldWorst": -1.59269,
          "ratingDouble": 0,
          "price": 2.1778,
          "spread": -154.0857
        },
        "Mom": {
          "zSpread": -1697.198,
          "gSpread": -1718.9391,
          "yieldWorst": -17.27649,
          "ratingDouble": 0,
          "price": 20.7655,
          "spread": -1718.2026
        },
        "Ytd": {
          "zSpread": 794.1082,
          "gSpread": 793.8118,
          "yieldWorst": 6.49722,
          "ratingDouble": -1,
          "price": -9.2742,
          "spread": null
        },
        "Yoy": {
          "zSpread": 783.2281,
          "gSpread": 788.4925,
          "yieldWorst": 5.73712,
          "ratingDouble": -1,
          "price": -8.4872,
          "spread": null
        }
      },
      "unitPosition": {
        "metricDate": "2020-05-08T00:00:00-04:00",
        "securityIdentifier": "11663",
        "partitionOptionValues": {
          "PortfolioShortName": [
            "DOF"
          ],
          "StrategyName": [
            "Portfolio Shorts"
          ]
        },
        "mark": {
          "driver": "Price",
          "enteredTime": "2020-05-08T11:23:32.501-04:00",
          "user": "ST",
          "value": 94,
          "spread": 808.48,
          "price": 94
        },
        "hedgeFactor": 0,
        "primaryPmName": "DJ",
        "backupPmName": "PM",
        "researchName": "TW",
        "owners": [
          "DJ",
          "PM",
          "TW"
        ]
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "trades": [
      {
        "partitionOptionValue": {
          "PortfolioShortName": "DOF",
          "StrategyName": "Portfolio Shorts"
        },
        "tradeId": "5120399",
        "parentTradeId": "5120389",
        "quantity": 447000,
        "tradeDateTime": "2020-05-08T09:02:00-04:00",
        "price": 93.5,
        "counterpartyName": "NBF FI",
        "spread": 846,
        "shouldCalculateSpread": true,
        "shouldCalculatePrice": true,
        "securityQuantityAfterTrade": -3153000,
        "fifoAvgSpread": null,
        "wgtAvgSpread": null,
        "fifoAvgPrice": 70.23739295908659,
        "wgtAvgPrice": 88.61538461538461
      }
    ],
    "alertConfigId": "a42fceb5-89b1-4fd5-9036-3ee988e4aecf",
    "alertId": "5120389",
    "timeStamp": "2020-05-08T09:02:00-04:00",
    "isUrgent": false,
    "isActive": true,
    "isDeleted": false,
    "isCancelled": false
  }
]
