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
    "alertId": "67df0e59-46ba-41fa-9c97-99072ea8d1bb",
    "alertConfigId": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
    "timeStamp": "2020-03-11T15:52:06.5983444-04:00",
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "STANLN 26s|2.539",
    "message": "CG Offer 10MM Spread @2.539",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "64712",
      "ccy": "USD",
      "country": "GB",
      "industry": "Diversified Banks",
      "name": "STANLN 2.819 01/30/2025 01/30/2026 USD 144A SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US85325WAA62",
      "obligorName": "STANDARD CHARTERED PLC",
      "obligorId": 728,
      "paymentRank": "SR UNSECURED",
      "sector": "Financials",
      "securitySubType": "Bond",
      "subIndustry": "Commer Banks Non-US",
      "ticker": "STANLN",
      "metrics": {
        "isFixedForLife": false,
        "isFixedToFloatInFixed": true,
        "isFloat": false,
        "isOnTheRun": true,
        "isNewIssue": false,
        "benchmarkSecurityIdentifier": "67133",
        "benchmarkName": "T 1.125 02/28/2025 USD",
        "underlyingSecurityId": -1,
        "zSpread": 190.358,
        "gSpread": 192.4511,
        "yieldWorst": 2.58938,
        "amtOutstanding": 2000000000,
        "marketValue": 2017560000,
        "workoutTerm": 4.8959,
        "ratingDouble": 16,
        "isRated": true,
        "rating": "BBB+",
        "ratingNoNotch": "BBB",
        "ratingBucket": "IG",
        "price": 100.878,
        "spread": 192.1606,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": 25.746,
          "gSpread": 21.8453,
          "yieldWorst": 0.40695,
          "ratingDouble": 0,
          "price": -1.925,
          "spread": 21.7301
        },
        "Wow": {
          "zSpread": 46.336,
          "gSpread": 44.9454,
          "yieldWorst": 0.30937,
          "ratingDouble": 0,
          "price": -1.6,
          "spread": 38.6821
        },
        "Mtd": {
          "zSpread": 45.149,
          "gSpread": 50.664,
          "yieldWorst": 0.17681,
          "ratingDouble": 0,
          "price": -0.967,
          "spread": 44.7338
        },
        "Mom": {
          "zSpread": 70.845,
          "gSpread": 75.0562,
          "yieldWorst": 0.0275,
          "ratingDouble": 0,
          "price": -0.312,
          "spread": 74.894
        },
        "Ytd": null,
        "Yoy": null
      },
      "firmPosition": {
        "partitionOptionValues": {
          "PortfolioShortName": [
            "AGB",
            "CIP",
            "DOF",
            "SOF"
          ],
          "StrategyName": [
            "LTOV - Spread"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-03-11T14:41:02.42-04:00",
          "user": "DM",
          "value": 205
        },
        "primaryPmName": "DM",
        "backupPmName": "RS",
        "researchName": "LP",
        "owners": [
          "DM",
          "RS",
          "LP"
        ],
        "date": "2020-03-11T00:00:00-04:00",
        "securityIdentifier": "64712",
        "quantity": 85395000,
        "cs01Cad": 63869.837507805,
        "cs01Local": 46511.67893082217,
        "hedgeFactor": 1
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "urgentLevel": 0,
    "isActive": true
  },
  {
    "alertId": "bbbdc950-1dec-433f-a2dd-02824c559d61",
    "alertConfigId": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
    "timeStamp": "2020-03-11T15:52:13.5441408-04:00",
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "UTX 30s|2.429",
    "message": "FTB Offer 3MM Spread @2.429",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "67062",
      "ccy": "USD",
      "country": "US",
      "industry": "Electrical Equipment Manufacturing",
      "name": "UTX 2.565 02/15/2030 Callable USD 144A SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US68902VAF40",
      "obligorName": "OTIS WORLDWIDE CORP",
      "obligorId": 7170,
      "paymentRank": "SR UNSECURED",
      "sector": "Industrials",
      "securitySubType": "Bond",
      "subIndustry": "Machinery-General Indust",
      "ticker": "UTX",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": true,
        "isNewIssue": true,
        "benchmarkSecurityIdentifier": "66248",
        "benchmarkName": "T 1.5 02/15/2030 USD",
        "underlyingSecurityId": -1,
        "zSpread": 161.71,
        "gSpread": 163.793,
        "yieldWorst": 2.44108,
        "amtOutstanding": 1500000000,
        "marketValue": 1515960000,
        "workoutTerm": 9.9425,
        "ratingDouble": 15,
        "isRated": true,
        "rating": "BBB",
        "ratingNoNotch": "BBB",
        "ratingBucket": "IG",
        "price": 101.064,
        "spread": 163.785,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": -5.042,
          "gSpread": -6.6204,
          "yieldWorst": 0.19596,
          "ratingDouble": 0,
          "price": -1.706,
          "spread": -6.5943
        },
        "Wow": {
          "zSpread": 48.63,
          "gSpread": 52.8246,
          "yieldWorst": 0.3323,
          "ratingDouble": 0,
          "price": -2.919,
          "spread": 52.9009
        },
        "Mtd": {
          "zSpread": 45.294,
          "gSpread": 54.3718,
          "yieldWorst": 0.198,
          "ratingDouble": 0,
          "price": -1.73,
          "spread": 54.4234
        },
        "Mom": null,
        "Ytd": null,
        "Yoy": null
      },
      "firmPosition": {
        "partitionOptionValues": {
          "PortfolioShortName": [
            "AGB",
            "BBB",
            "CIP",
            "DOF"
          ],
          "StrategyName": [
            "LTOV - Spread"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-03-11T14:33:59.991-04:00",
          "user": "DA",
          "value": 180
        },
        "primaryPmName": "DA",
        "backupPmName": "DM",
        "researchName": "TW",
        "owners": [
          "DA",
          "DM",
          "TW"
        ],
        "date": "2020-03-11T00:00:00-04:00",
        "securityIdentifier": "67062",
        "quantity": 17000000,
        "cs01Cad": 20422.063977,
        "cs01Local": 14871.87880643752,
        "hedgeFactor": 1
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "urgentLevel": 0,
    "isActive": true
  },
  {
    "alertId": "0c27a3fc-6975-4af5-afe4-0fde0870a627",
    "alertConfigId": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
    "timeStamp": "2020-03-11T15:52:19.0636182-04:00",
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "UTX 40s|3.28",
    "message": "MUFG Offer 500K Spread @3.28",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "66465",
      "ccy": "USD",
      "country": "US",
      "industry": "Aerospace & Defense",
      "name": "UTX 3.377 04/05/2040 Callable USD 144A SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US14448CAB00",
      "obligorName": "UNITED TECHNOLOGIES CORP",
      "obligorId": 830,
      "paymentRank": "SR UNSECURED",
      "sector": "Industrials",
      "securitySubType": "Bond",
      "subIndustry": "Aerospace/Defense-Equip",
      "ticker": "UTX",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": true,
        "benchmarkSecurityIdentifier": "63089",
        "benchmarkName": "T 2.375 11/15/2049 USD",
        "underlyingSecurityId": -1,
        "zSpread": 247.066,
        "gSpread": 239.8002,
        "yieldWorst": 3.35287,
        "amtOutstanding": 1500000000,
        "marketValue": 1505100000,
        "workoutTerm": 20.0849,
        "ratingDouble": 15,
        "isRated": true,
        "rating": "BBB",
        "ratingNoNotch": "BBB",
        "ratingBucket": "IG",
        "price": 100.34,
        "spread": 206.56959999999998,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": -5.466,
          "gSpread": -13.5258,
          "yieldWorst": 0.20983,
          "ratingDouble": 0,
          "price": -3.056,
          "spread": -7.3483
        },
        "Wow": {
          "zSpread": 51.733,
          "gSpread": 56.3871,
          "yieldWorst": 0.2271,
          "ratingDouble": 0,
          "price": -3.315,
          "spread": 55.2178
        },
        "Mtd": {
          "zSpread": 52.18,
          "gSpread": 58.5852,
          "yieldWorst": 0.16287,
          "ratingDouble": 0,
          "price": -2.365,
          "spread": 54.853
        },
        "Mom": null,
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
            "STIP"
          ],
          "StrategyName": [
            "LTOV - Spread"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-03-11T09:18:07.164-04:00",
          "user": "DA",
          "value": 215
        },
        "primaryPmName": "DA",
        "backupPmName": "DM",
        "researchName": "TW",
        "owners": [
          "DA",
          "DM",
          "TW"
        ],
        "date": "2020-03-11T00:00:00-04:00",
        "securityIdentifier": "66465",
        "quantity": 14175000,
        "cs01Cad": 28142.45245665,
        "cs01Local": 20494.066746759396,
        "hedgeFactor": 1
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "urgentLevel": 0,
    "isActive": true
  },
  {
    "alertId": "f79c6847-131d-403b-a576-771edfab61ca",
    "alertConfigId": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
    "timeStamp": "2020-03-11T15:52:36.8379001-04:00",
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "DWDP 25s|2.736",
    "message": "CG Offer 5MM Spread @2.736",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "47374",
      "ccy": "USD",
      "country": "US",
      "industry": "Chemicals",
      "name": "DD 4.493 11/15/2025 Callable USD SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US26078JAC45",
      "obligorName": "DUPONT DE NEMOURS INC",
      "obligorId": 5312,
      "paymentRank": "SR UNSECURED",
      "sector": "Basic Materials",
      "securitySubType": "Bond",
      "subIndustry": "Chemicals-Diversified",
      "ticker": "DWDP",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": false,
        "benchmarkSecurityIdentifier": "67133",
        "benchmarkName": "T 1.125 02/28/2025 USD",
        "underlyingSecurityId": -1,
        "zSpread": 215.885,
        "gSpread": 215.7523,
        "yieldWorst": 2.84841,
        "amtOutstanding": 1850000000,
        "marketValue": 2004086500,
        "workoutTerm": 5.5205,
        "ratingDouble": 17,
        "isRated": true,
        "rating": "A-",
        "ratingNoNotch": "A",
        "ratingBucket": "IG",
        "price": 108.329,
        "spread": 217.9434,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": 58.244,
          "gSpread": 53.83,
          "yieldWorst": 0.73518,
          "ratingDouble": 0,
          "price": -3.99,
          "spread": 54.5367
        },
        "Wow": {
          "zSpread": 110.838,
          "gSpread": 104.1446,
          "yieldWorst": 0.95492,
          "ratingDouble": 0,
          "price": -5.253,
          "spread": 103.14
        },
        "Mtd": {
          "zSpread": 109.15,
          "gSpread": 109.5924,
          "yieldWorst": 0.81762,
          "ratingDouble": 0,
          "price": -4.496,
          "spread": 109.0654
        },
        "Mom": {
          "zSpread": 130.6948,
          "gSpread": 134.3355,
          "yieldWorst": 0.61934,
          "ratingDouble": 0,
          "price": -3.51,
          "spread": 134.0365
        },
        "Ytd": {
          "zSpread": 131.5886,
          "gSpread": 131.0529,
          "yieldWorst": 0.263,
          "ratingDouble": 0,
          "price": -1.721,
          "spread": null
        },
        "Yoy": {
          "zSpread": 104.999,
          "gSpread": 101.2223,
          "yieldWorst": -0.79364,
          "ratingDouble": null,
          "price": 3.438,
          "spread": null
        }
      },
      "firmPosition": {
        "partitionOptionValues": {
          "PortfolioShortName": [
            "DOF"
          ],
          "StrategyName": [
            "LTOV - Spread"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-03-11T10:46:33.817-04:00",
          "user": "ST",
          "value": 200
        },
        "primaryPmName": "ST",
        "backupPmName": "DM",
        "researchName": "TW",
        "owners": [
          "ST",
          "DM",
          "TW"
        ],
        "date": "2020-03-11T00:00:00-04:00",
        "securityIdentifier": "47374",
        "quantity": 25000000,
        "cs01Cad": 18652.475875,
        "cs01Local": 13583.21866807457,
        "hedgeFactor": 1
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "urgentLevel": 0,
    "isActive": true
  },
  {
    "alertId": "3ff8fbaa-30cd-4594-bf24-04d311d45945",
    "alertConfigId": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
    "timeStamp": "2020-03-11T15:52:44.4240125-04:00",
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "DWDP 25s|2.741",
    "message": "CG Offer 5MM Spread @2.741",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "47374",
      "ccy": "USD",
      "country": "US",
      "industry": "Chemicals",
      "name": "DD 4.493 11/15/2025 Callable USD SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US26078JAC45",
      "obligorName": "DUPONT DE NEMOURS INC",
      "obligorId": 5312,
      "paymentRank": "SR UNSECURED",
      "sector": "Basic Materials",
      "securitySubType": "Bond",
      "subIndustry": "Chemicals-Diversified",
      "ticker": "DWDP",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": false,
        "benchmarkSecurityIdentifier": "67133",
        "benchmarkName": "T 1.125 02/28/2025 USD",
        "underlyingSecurityId": -1,
        "zSpread": 215.885,
        "gSpread": 215.7523,
        "yieldWorst": 2.84841,
        "amtOutstanding": 1850000000,
        "marketValue": 2004086500,
        "workoutTerm": 5.5205,
        "ratingDouble": 17,
        "isRated": true,
        "rating": "A-",
        "ratingNoNotch": "A",
        "ratingBucket": "IG",
        "price": 108.329,
        "spread": 217.9434,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": 58.244,
          "gSpread": 53.83,
          "yieldWorst": 0.73518,
          "ratingDouble": 0,
          "price": -3.99,
          "spread": 54.5367
        },
        "Wow": {
          "zSpread": 110.838,
          "gSpread": 104.1446,
          "yieldWorst": 0.95492,
          "ratingDouble": 0,
          "price": -5.253,
          "spread": 103.14
        },
        "Mtd": {
          "zSpread": 109.15,
          "gSpread": 109.5924,
          "yieldWorst": 0.81762,
          "ratingDouble": 0,
          "price": -4.496,
          "spread": 109.0654
        },
        "Mom": {
          "zSpread": 130.6948,
          "gSpread": 134.3355,
          "yieldWorst": 0.61934,
          "ratingDouble": 0,
          "price": -3.51,
          "spread": 134.0365
        },
        "Ytd": {
          "zSpread": 131.5886,
          "gSpread": 131.0529,
          "yieldWorst": 0.263,
          "ratingDouble": 0,
          "price": -1.721,
          "spread": null
        },
        "Yoy": {
          "zSpread": 104.999,
          "gSpread": 101.2223,
          "yieldWorst": -0.79364,
          "ratingDouble": null,
          "price": 3.438,
          "spread": null
        }
      },
      "firmPosition": {
        "partitionOptionValues": {
          "PortfolioShortName": [
            "DOF"
          ],
          "StrategyName": [
            "LTOV - Spread"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-03-11T10:46:33.817-04:00",
          "user": "ST",
          "value": 200
        },
        "primaryPmName": "ST",
        "backupPmName": "DM",
        "researchName": "TW",
        "owners": [
          "ST",
          "DM",
          "TW"
        ],
        "date": "2020-03-11T00:00:00-04:00",
        "securityIdentifier": "47374",
        "quantity": 25000000,
        "cs01Cad": 18652.475875,
        "cs01Local": 13583.21866807457,
        "hedgeFactor": 1
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "urgentLevel": 0,
    "isActive": true
  },
  {
    "alertId": "c8c431f8-fa53-467b-9bec-eb66ca65cc6e",
    "alertConfigId": "2f68f8e6-03b5-4a7b-b041-16aaec774f13",
    "timeStamp": "2020-03-11T16:02:19.0112745-04:00",
    "type": "Axe",
    "subType": "Ask",
    "keyWord": "DWDP 25s|2.756",
    "message": "CG Offer 5MM Spread @2.756",
    "security": {
      "isSovereign": false,
      "isGovt": false,
      "isEm": false,
      "securityIdentifier": "47374",
      "ccy": "USD",
      "country": "US",
      "industry": "Chemicals",
      "name": "DD 4.493 11/15/2025 Callable USD SENIOR_UNSECURED",
      "genericSeniority": "SR",
      "globalIdentifier": "US26078JAC45",
      "obligorName": "DUPONT DE NEMOURS INC",
      "obligorId": 5312,
      "paymentRank": "SR UNSECURED",
      "sector": "Basic Materials",
      "securitySubType": "Bond",
      "subIndustry": "Chemicals-Diversified",
      "ticker": "DWDP",
      "metrics": {
        "isFixedForLife": true,
        "isFixedToFloatInFixed": false,
        "isFloat": false,
        "isOnTheRun": false,
        "isNewIssue": false,
        "benchmarkSecurityIdentifier": "67133",
        "benchmarkName": "T 1.125 02/28/2025 USD",
        "underlyingSecurityId": -1,
        "zSpread": 215.885,
        "gSpread": 215.7523,
        "yieldWorst": 2.84841,
        "amtOutstanding": 1850000000,
        "marketValue": 2004086500,
        "workoutTerm": 5.5205,
        "ratingDouble": 17,
        "isRated": true,
        "rating": "A-",
        "ratingNoNotch": "A",
        "ratingBucket": "IG",
        "price": 108.329,
        "spread": 217.9434,
        "isIndex": true
      },
      "deltaMetrics": {
        "Dod": {
          "zSpread": 58.244,
          "gSpread": 53.83,
          "yieldWorst": 0.73518,
          "ratingDouble": 0,
          "price": -3.99,
          "spread": 54.5367
        },
        "Wow": {
          "zSpread": 110.838,
          "gSpread": 104.1446,
          "yieldWorst": 0.95492,
          "ratingDouble": 0,
          "price": -5.253,
          "spread": 103.14
        },
        "Mtd": {
          "zSpread": 109.15,
          "gSpread": 109.5924,
          "yieldWorst": 0.81762,
          "ratingDouble": 0,
          "price": -4.496,
          "spread": 109.0654
        },
        "Mom": {
          "zSpread": 130.6948,
          "gSpread": 134.3355,
          "yieldWorst": 0.61934,
          "ratingDouble": 0,
          "price": -3.51,
          "spread": 134.0365
        },
        "Ytd": {
          "zSpread": 131.5886,
          "gSpread": 131.0529,
          "yieldWorst": 0.263,
          "ratingDouble": 0,
          "price": -1.721,
          "spread": null
        },
        "Yoy": {
          "zSpread": 104.999,
          "gSpread": 101.2223,
          "yieldWorst": -0.79364,
          "ratingDouble": null,
          "price": 3.438,
          "spread": null
        }
      },
      "firmPosition": {
        "partitionOptionValues": {
          "PortfolioShortName": [
            "DOF"
          ],
          "StrategyName": [
            "LTOV - Spread"
          ]
        },
        "mark": {
          "driver": "Spread",
          "enteredTime": "2020-03-11T10:46:33.817-04:00",
          "user": "ST",
          "value": 200
        },
        "primaryPmName": "ST",
        "backupPmName": "DM",
        "researchName": "TW",
        "owners": [
          "ST",
          "DM",
          "TW"
        ],
        "date": "2020-03-11T00:00:00-04:00",
        "securityIdentifier": "47374",
        "quantity": 25000000,
        "cs01Cad": 18652.475875,
        "cs01Local": 13583.21866807457,
        "hedgeFactor": 1
      },
      "securityType": "Bond",
      "maturityType": "Callable"
    },
    "urgentLevel": 0,
    "isActive": true
  }
]