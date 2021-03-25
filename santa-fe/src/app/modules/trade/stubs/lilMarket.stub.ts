import { BEHistoricalSummaryOverviewDTO } from 'BEModels/backend-models.interface';
import { CompactSecuritySample } from 'Core/stubs/securities.stub';

export const HistoricalSummarySampleReturn: BEHistoricalSummaryOverviewDTO = {
  "GroupIdentifierWithInclusiveOptions": {
    "source": "Default",
    "date": "2020-12-21T00:00:00-05:00",
    "groupOptionValues": {
      "SecurityType": [
        "Bond"
      ],
      "Ccy": [
        "USD"
      ],
      "CouponType": [
        "Fixed"
      ],
      "BackendTenor": [
        "2Y"
      ],
      "BailInStatus": [
        "Not bail in"
      ],
      "BicsCode": [
        "14111110"
      ],
      "BicsCodeLevel1": [
        "14"
      ],
      "BicsCodeLevel2": [
        "1411"
      ],
      "BicsCodeLevel3": [
        "141111"
      ],
      "BicsCodeLevel4": [
        "14111110"
      ],
      "BicsLevel1": [
        "Financials"
      ],
      "BicsLevel2": [
        "Financial Services"
      ],
      "BicsLevel3": [
        "Specialty Finance"
      ],
      "BicsLevel4": [
        "Commercial Finance"
      ],
      "Country": [
        "Ireland"
      ],
      "Industry": [
        "Commercial Finance"
      ],
      "IsNewIssue": [
        "N"
      ],
      "MaturityType": [
        "Callable"
      ],
      "ObligorId": [
        "1290"
      ],
      "QuotedToday": [
        "Y"
      ],
      "RatingNoNotch": [
        "BBB"
      ],
      "RatingBucket": [
        "IG"
      ],
      "Sector": [
        "Financials"
      ],
      "SecurityIdentifier": [
        "29868"
      ],
      "Seniority": [
        "SR"
      ],
      "SubIndustry": [
        "Finance-Leasing Compan"
      ],
      "Tenor": [
        "2Y"
      ],
      "Ticker": [
        "AVOL"
      ],
      "IsOwned": [
        "Y"
      ],
      "PrimaryPmName": [
        "DM"
      ],
      "BackupPmName": [
        "TW"
      ],
      "ResearchName": [
        "LP"
      ],
      "PortfolioShortName": [
        "None"
      ],
      "StrategyName": [
        "LTOV - Spread"
      ],
      "Owner": [
        "None"
      ]
    },
    "groupFilters": {}
  },
  "Mom": {
    "BaseSecurity": {
      "sourceInDb": "RP",
      "startDate": "2021-02-17T00:00:00-05:00",
      "endDate": "2021-03-17T00:00:00-04:00",
      "metricName": "Spread",
      "historicalLevel": {
        "targetSecurityIdentifier": null,
        "startMetric": 177.613,
        "endMetric": 194.214,
        "maxMetric": 194.214,
        "minMetric": 177.613,
        "timeSeries": {
          "2021-02-17T00:00:00-05:00": 177.613,
          "2021-03-17T00:00:00-04:00": 194.214
        },
        "isLevelRange": true,
        "isBasisRange": false,
        "isValid": true
      },
      "historicalBasis": null,
      "security": {
        "securityIdentifier": "29868",
        "name": "AVOL 5.5 01/15/2023 USD 144A SENIOR_UNSECURED",
        "securityType": "Bond",
        "securitySubType": "Corp",
        "ccy": "USD",
        "obligorId": 1290,
        "obligorName": "AVOLON HOLDINGS LTD",
        "country": "Ireland",
        "sector": "Financials",
        "industry": "Commercial Finance",
        "subIndustry": "Finance-Leasing Compan",
        "bicsCode": "14111110",
        "bicsLevel1": "Financials",
        "bicsLevel2": "Financial Services",
        "bicsLevel3": "Specialty Finance",
        "bicsLevel4": "Commercial Finance",
        "genericSeniority": "SR",
        "globalIdentifier": "US05401AAA97",
        "paymentRank": "SR UNSECURED",
        "ticker": "AVOL",
        "maturityType": "Callable",
        "metrics": {
          "BB": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "yieldWorst": 2.09811,
            "tenor": null,
            "amtOutstanding": 414580000.0,
            "marketValue": 442536050.0,
            "workoutTerm": null,
            "ratingDouble": null,
            "isRated": true,
            "rating": null,
            "ratingNoNotch": null,
            "ratingBucket": "NR",
            "price": 105.796,
            "spread": 194.214
          },
          "Default": {
            "isFixedForLife": true,
            "isFixedToFloatInFixed": false,
            "isFloat": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "yieldWorst": 2.09811,
            "tenor": null,
            "amtOutstanding": 414580000.0,
            "marketValue": 442536050.0,
            "workoutTerm": null,
            "ratingDouble": null,
            "isRated": true,
            "rating": null,
            "ratingNoNotch": null,
            "ratingBucket": "NR",
            "price": 105.796,
            "spread": 194.214
          }
        },
        "deltaMetrics": {
          "Dod": {
            "yieldWorst": 0.148695,
            "ratingDouble": null,
            "price": -0.253999,
            "spread": 14.214
          },
          "TMinusTwo": {
            "yieldWorst": 0.14616,
            "ratingDouble": null,
            "price": -0.259,
            "spread": 14.214
          },
          "Wow": {
            "yieldWorst": 0.07304,
            "ratingDouble": null,
            "price": -0.119251,
            "spread": 3.964
          },
          "Mom": {
            "yieldWorst": 0.20605,
            "ratingDouble": null,
            "price": -0.646,
            "spread": 16.601
          },
          "Ytd": {
            "yieldWorst": -0.0699,
            "ratingDouble": null,
            "price": -0.551,
            "spread": -9.71
          }
        },
        "unitPosition": null
      },
      "rank": 0,
      "name": "AVOL 5.5 01/15/2023 USD 144A SENIOR_UNSECURED",
      "isSecurityHistoricalSummary": true,
      "isGroupHistoricalSummary": false
    },
    "Group": {
      "sourceInDb": "BB",
      "startDate": "2020-11-20T00:00:00-05:00",
      "endDate": "2020-12-21T00:00:00-05:00",
      "metricName": "Spread",
      "historicalLevel": {
        "targetSecurityIdentifier": null,
        "startMetric": 63.40551802578167,
        "endMetric": 57.98900405977367,
        "maxMetric": 63.40551802578167,
        "minMetric": 57.98900405977367,
        "timeSeries": {
          "2020-11-20T00:00:00-05:00": 63.40551802578167,
          "2020-12-21T00:00:00-05:00": 57.98900405977367
        },
        "isLevelRange": true,
        "isBasisRange": false,
        "isValid": true
      },
      "historicalBasis": {
        "targetSecurityIdentifier": "29868",
        "startMetric": -222.61098197421833,
        "endMetric": -140.76099594022634,
        "maxMetric": -140.76099594022634,
        "minMetric": -222.61098197421833,
        "timeSeries": {
          "2020-11-20T00:00:00-05:00": -222.61098197421833,
          "2020-12-21T00:00:00-05:00": -140.76099594022634
        },
        "isLevelRange": false,
        "isBasisRange": true,
        "isValid": true
      },
      "group": {
        "ccy": "USD",
        "securityType": "Bond",
        "couponType": "Fixed",
        "metrics": {
          "workoutTerm": 1.653691246893615,
          "ratingDouble": 15.567146568832808,
          "price": 104.1705957718162,
          "spread": 57.98900405977367,
          "yieldWorst": 0.7685290087150098,
          "amtOutstanding": 796758123.8938053,
          "marketValue": 847589382.3063064,
          "tenor": "2Y",
          "backendTenor": "2Y",
          "propertyToNumSecurities": {
            "WorkoutTerm": 139,
            "RatingDouble": 139,
            "Price": 125,
            "BackendWorkoutTerm": 139,
            "Spread": 139,
            "YieldWorst": 125,
            "AmtOutstanding": 139,
            "MarketValue": 139
          },
          "isRated": true,
          "rating": "BBB+",
          "ratingNoNotch": "BBB",
          "ratingBucket": "NR"
        },
        "deltaMetrics": {
          "Dod": {
            "ratingDouble": 0.0,
            "price": -0.012203514440118123,
            "spread": 0.8823038890779017,
            "yieldWorst": 0.005215306501699512,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 139,
              "RatingDouble": 139,
              "Price": 125,
              "BackendWorkoutTerm": 139,
              "Spread": 139,
              "YieldWorst": 125,
              "AmtOutstanding": 139,
              "MarketValue": 139
            }
          },
          "Wow": {
            "ratingDouble": 0.0,
            "price": -0.005859388355603749,
            "spread": -3.145020287908437,
            "yieldWorst": -0.027126914133873224,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 139,
              "RatingDouble": 139,
              "Price": 125,
              "BackendWorkoutTerm": 139,
              "Spread": 139,
              "YieldWorst": 125,
              "AmtOutstanding": 139,
              "MarketValue": 139
            }
          },
          "Mom": {
            "ratingDouble": 0.0,
            "price": -0.04175028210890233,
            "spread": -5.416513966007998,
            "yieldWorst": -0.10774246844087118,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 138,
              "RatingDouble": 138,
              "Price": 124,
              "BackendWorkoutTerm": 138,
              "Spread": 138,
              "YieldWorst": 124,
              "AmtOutstanding": 138,
              "MarketValue": 138
            }
          },
          "Ytd": {
            "ratingDouble": -0.41476625190921934,
            "price": 0.5040292745104392,
            "spread": -15.065797746337328,
            "yieldWorst": -1.6412425044462209,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 6,
              "RatingDouble": 6,
              "Price": 6,
              "BackendWorkoutTerm": 6,
              "Spread": 6,
              "YieldWorst": 6,
              "AmtOutstanding": 6,
              "MarketValue": 6
            }
          },
          "TMinusTwo": {
            "ratingDouble": -0.41476625190921934,
            "price": 0.5756188941116697,
            "spread": -14.649414658219385,
            "yieldWorst": -1.6951393932955312,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 6,
              "RatingDouble": 6,
              "Price": 6,
              "BackendWorkoutTerm": 6,
              "Spread": 6,
              "YieldWorst": 6,
              "AmtOutstanding": 6,
              "MarketValue": 6
            }
          }
        },
        "isValid": true,
        "groupIdentifier": {
          "source": "Default",
          "date": "2020-12-21T00:00:00-05:00",
          "groupOptionValues": {
            "Seniority": [
              "SR"
            ],
            "RatingNoNotch": [
              "BBB"
            ],
            "BicsLevel1": [
              "Financials"
            ],
            "Tenor": [
              "2Y"
            ],
            "Ccy": [
              "USD"
            ],
            "SecurityType": [
              "Bond"
            ],
            "CouponType": [
              "Fixed"
            ]
          },
          "groupFilters": {}
        },
        "source": "Default",
        "date": "2020-12-21T00:00:00-05:00",
        "numSecurities": 139,
        "name": "Bond|USD|Fixed|SR|2Y|BBB|Financials",
        "type": "SingleSecurityGroup"
      },
      "rank": 0,
      "name": "Bond|USD|Fixed|SR|2Y|BBB|Financials",
      "isSecurityHistoricalSummary": false,
      "isGroupHistoricalSummary": true
    },
    "Top": [
      {
        "sourceInDb": "RP",
        "startDate": "2020-11-20T00:00:00-05:00",
        "endDate": "2020-12-21T00:00:00-05:00",
        "metricName": "Spread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 308.5685,
          "endMetric": 164.0,
          "maxMetric": 308.5685,
          "minMetric": 164.0,
          "timeSeries": {
            "2020-11-20T00:00:00-05:00": 308.5685,
            "2020-12-21T00:00:00-05:00": 164.0
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": {
          "targetSecurityIdentifier": "29868",
          "startMetric": 22.551999999999964,
          "endMetric": -34.75,
          "maxMetric": 22.551999999999964,
          "minMetric": -34.75,
          "timeSeries": {
            "2020-11-20T00:00:00-05:00": 22.551999999999964,
            "2020-12-21T00:00:00-05:00": -34.75
          },
          "isLevelRange": false,
          "isBasisRange": true,
          "isValid": true
        },
        "security": {
          "securityIdentifier": "15272",
          "metrics": {
            "FO": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": "97247",
              "benchmarkName": "T 0.125 12/15/2023 USD",
              "underlyingSecurityId": -1,
              "yieldWorst": 2.095942,
              "tenor": "2Y",
              "amtOutstanding": 500000000.0,
              "marketValue": 538254990.0,
              "workoutTerm": 2.276712,
              "ratingDouble": 14.33,
              "isRated": true,
              "rating": "BBB-",
              "ratingNoNotch": "BBB",
              "ratingBucket": "IG",
              "price": 106.595442,
              "spread": 185.0
            },
            "BB": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": null,
              "benchmarkName": null,
              "underlyingSecurityId": -1,
              "yieldWorst": 2.04384,
              "tenor": "2Y",
              "amtOutstanding": 500000000.0,
              "marketValue": 538211665.0,
              "workoutTerm": 2.284932,
              "ratingDouble": 14.0,
              "isRated": true,
              "rating": "BBB-",
              "ratingNoNotch": "BBB",
              "ratingBucket": "IG",
              "price": 106.559,
              "spread": 189.709
            },
            "Default": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": "97247",
              "benchmarkName": "T 0.125 12/15/2023 USD",
              "underlyingSecurityId": -1,
              "yieldWorst": 1.818,
              "tenor": "2Y",
              "amtOutstanding": 500000000.0,
              "marketValue": 538211665.0,
              "workoutTerm": 2.276712,
              "ratingDouble": 14.33,
              "isRated": true,
              "rating": "BBB-",
              "ratingNoNotch": "BBB",
              "ratingBucket": "IG",
              "price": 107.049,
              "spread": 164.0
            }
          },
          "deltaMetrics": {
            "Dod": {
              "yieldWorst": 0.011085,
              "ratingDouble": 0.0,
              "price": -0.034716,
              "spread": 1.0835
            },
            "Wow": {
              "yieldWorst": -0.273122,
              "ratingDouble": 0.0,
              "price": 0.575787,
              "spread": -28.25
            },
            "TMinusTwo": {
              "yieldWorst": -1.028325,
              "ratingDouble": 0.0,
              "price": 2.228,
              "spread": -101.911
            },
            "Mom": {
              "yieldWorst": -1.479092,
              "ratingDouble": 0.0,
              "price": 3.226124,
              "spread": -144.5685
            },
            "Ytd": null
          },
          "ccy": "USD",
          "obligorId": 1684,
          "obligorName": "AIRCASTLE LTD",
          "country": "United States America",
          "sector": "Financials",
          "industry": "Diversified Finan Serv",
          "subIndustry": "Finance-Leasing Compan",
          "bicsCode": "14111110",
          "bicsLevel1": "Financials",
          "bicsLevel2": "Financial Services",
          "bicsLevel3": "Specialty Finance",
          "bicsLevel4": "Commercial Finance",
          "name": "AYR 5 04/01/2023 USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US00928QAP63",
          "paymentRank": "SR UNSECURED",
          "securitySubType": "Bond",
          "ticker": "AYR",
          "unitPosition": {
            "securityIdentifier": "15272",
            "partitionOptionValues": {
              "PortfolioShortName": [
                "DOF",
                "AGB",
                ""
              ],
              "StrategyName": [
                "LTOV - Spread"
              ]
            },
            "strategyAsOfDate": "2020-12-18T00:00:00",
            "mark": {
              "driver": "Spread",
              "enteredTime": "2020-12-21T00:00:00-05:00",
              "user": null,
              "value": 185.0,
              "spread": 185.0,
              "price": 106.595442,
              "yield": 2.095942
            },
            "hedgeFactor": 1.0,
            "strategies": [
              "LTOV - Spread"
            ],
            "owners": [
              "SP",
              "DA",
              "LP"
            ],
            "primaryPmName": "SP",
            "backupPmName": "DA",
            "researchName": "LP"
          },
          "securityType": "Bond",
          "maturityType": "Bullet"
        },
        "rank": 1,
        "name": "AYR 5 04/01/2023 USD SENIOR_UNSECURED",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      }
    ],
    "Bottom": [
      {
        "sourceInDb": "RP",
        "startDate": "2020-11-20T00:00:00-05:00",
        "endDate": "2020-12-21T00:00:00-05:00",
        "metricName": "Spread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 1775.42,
          "endMetric": 2084.3,
          "maxMetric": 2084.3,
          "minMetric": 1775.42,
          "timeSeries": {
            "2020-11-20T00:00:00-05:00": 1775.42,
            "2020-12-21T00:00:00-05:00": 2084.3
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": {
          "targetSecurityIdentifier": "29868",
          "startMetric": 1489.4035000000001,
          "endMetric": 1885.5500000000002,
          "maxMetric": 1885.5500000000002,
          "minMetric": 1489.4035000000001,
          "timeSeries": {
            "2020-11-20T00:00:00-05:00": 1489.4035000000001,
            "2020-12-21T00:00:00-05:00": 1885.5500000000002
          },
          "isLevelRange": false,
          "isBasisRange": true,
          "isValid": true
        },
        "security": {
          "securityIdentifier": "62701",
          "metrics": {
            "BB": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": null,
              "benchmarkName": null,
              "underlyingSecurityId": -1,
              "yieldWorst": 20.9681,
              "tenor": "2Y",
              "amtOutstanding": 500000000.0,
              "marketValue": 384095280.0,
              "workoutTerm": 1.805479,
              "ratingDouble": 14.0,
              "isRated": true,
              "rating": "BBB-",
              "ratingNoNotch": "BBB",
              "ratingBucket": "IG",
              "price": 75.971,
              "spread": 2084.3
            },
            "Default": {
              "isFixedForLife": true,
              "isFixedToFloatInFixed": false,
              "isFloat": false,
              "isNewIssue": false,
              "benchmarkSecurityIdentifier": null,
              "benchmarkName": null,
              "underlyingSecurityId": -1,
              "yieldWorst": 20.9681,
              "tenor": "2Y",
              "amtOutstanding": 500000000.0,
              "marketValue": 384095280.0,
              "workoutTerm": 1.805479,
              "ratingDouble": 14.0,
              "isRated": true,
              "rating": "BBB-",
              "ratingNoNotch": "BBB",
              "ratingBucket": "IG",
              "price": 75.971,
              "spread": 2084.3
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
              "yieldWorst": 0.085499,
              "ratingDouble": 0.0,
              "price": 0.019,
              "spread": 7.6501
            },
            "TMinusTwo": {
              "yieldWorst": 1.7936,
              "ratingDouble": 0.0,
              "price": -1.691,
              "spread": 180.7301
            },
            "Mom": {
              "yieldWorst": 3.061499,
              "ratingDouble": 0.0,
              "price": -3.065,
              "spread": 308.88
            },
            "Ytd": null
          },
          "ccy": "USD",
          "obligorId": 6932,
          "obligorName": "HAIGUO XINTAI CAPITAL LTD",
          "country": "China",
          "sector": "Financials",
          "industry": "Financial Services",
          "subIndustry": "Investment Companies",
          "bicsCode": "14111010",
          "bicsLevel1": "Financials",
          "bicsLevel2": "Financial Services",
          "bicsLevel3": "Asset Management",
          "bicsLevel4": "Investment Companies",
          "name": "BJHAIG 4.3 10/08/22",
          "genericSeniority": "SR",
          "globalIdentifier": "XS2017302527",
          "paymentRank": "SR UNSECURED",
          "securitySubType": "Bond",
          "ticker": "BJHAIG",
          "unitPosition": null,
          "securityType": "Bond",
          "maturityType": "Bullet"
        },
        "rank": 1,
        "name": "BJHAIG 4.3 10/08/22",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      }
    ]
  }
}
