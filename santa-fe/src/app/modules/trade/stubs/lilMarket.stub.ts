import { BEHistoricalSummaryOverviewDTO } from 'BEModels/backend-models.interface';

export const HistoricalSummarySampleReturn: BEHistoricalSummaryOverviewDTO = {
  "GroupIdentifierWithInclusiveOptions": {
    "source": "Default",
    "date": "2020-02-14T00:00:00-05:00",
    "groupOptionValues": {
      "SecurityType": [
        "Bond"
      ],
      "Ccy": [
        "USD"
      ],
      "CouponType": [
        "Float"
      ],
      "BackendTenor": [
        "None"
      ],
      "BailInStatus": [
        "Not bail in"
      ],
      "Country": [
        "US"
      ],
      "Industry": [
        "Medical Equipment & Devices Manufacturing"
      ],
      "InMetricContext": [
        "Y"
      ],
      "IsNewIssue": [
        "N"
      ],
      "IsOnTheRun": [
        "N"
      ],
      "MaturityType": [
        "Bullet"
      ],
      "ObligorId": [
        "1278"
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
        "Health Care"
      ],
      "Seniority": [
        "SR"
      ],
      "SubIndustry": [
        "Drug Delivery Systems"
      ],
      "Tenor": [
        "2Y"
      ],
      "Ticker": [
        "BDX"
      ]
    },
    "filters": {},
    "singleSecurityTenorOptions": [
      "2Y",
      "3Y",
      "5Y",
      "7Y",
      "10Y",
      "20Y",
      "30Y"
    ],
    "metricContextFieldMinMax": null,
    "weightField": "AmtOutstanding"
  },
  "Mom": {
    "BaseSecurity": {
      "databaseSource": "Citi",
      "startDate": "2020-01-14T00:00:00-05:00",
      "endDate": "2020-02-14T00:00:00-05:00",
      "metricName": "GSpread",
      "historicalLevel": {
        "targetSecurityIdentifier": null,
        "startMetric": 80.0666,
        "endMetric": 56.1018,
        "maxMetric": 83.542984,
        "minMetric": 56.101811,
        "timeSeries": {
          "2020-01-14T00:00:00": 80.066637,
          "2020-01-15T00:00:00": 82.278695,
          "2020-01-16T00:00:00": 80.526511,
          "2020-01-17T00:00:00": 83.290691,
          "2020-01-21T00:00:00": 81.427062,
          "2020-01-22T00:00:00": 83.542984,
          "2020-01-23T00:00:00": 81.602551,
          "2020-01-24T00:00:00": 71.783774,
          "2020-01-27T00:00:00": 72.975848,
          "2020-01-28T00:00:00": 77.409971,
          "2020-01-29T00:00:00": 77.450189,
          "2020-01-30T00:00:00": 77.491271,
          "2020-01-31T00:00:00": 82.574479,
          "2020-02-03T00:00:00": 78.790605,
          "2020-02-04T00:00:00": 78.988411,
          "2020-02-05T00:00:00": 65.010827,
          "2020-02-06T00:00:00": 64.271543,
          "2020-02-07T00:00:00": 62.722707,
          "2020-02-10T00:00:00": 60.617357,
          "2020-02-11T00:00:00": 60.582929,
          "2020-02-12T00:00:00": 58.145963,
          "2020-02-13T00:00:00": 56.757062,
          "2020-02-14T00:00:00": 56.101811
        },
        "isLevelRange": true,
        "isBasisRange": false,
        "isValid": true
      },
      "historicalBasis": null,
      "security": {
        "isSovereign": false,
        "isGovt": false,
        "isEm": false,
        "securityIdentifier": "2508",
        "ccy": "USD",
        "country": "US",
        "industry": "Medical Equipment & Devices Manufacturing",
        "name": "BDX FRN 06/06/2022 Bullet USD SENIOR_UNSECURED",
        "genericSeniority": "SR",
        "globalIdentifier": "US075887BU29",
        "obligorName": "BECTON DICKINSON AND CO",
        "obligorId": 1278,
        "paymentRank": "SR UNSECURED",
        "sector": "Health Care",
        "securitySubType": "FRN",
        "subIndustry": "Drug Delivery Systems",
        "ticker": "BDX",
        "metrics": {
          "isFixedForLife": false,
          "isFixedToFloatInFixed": false,
          "isFloat": true,
          "isOnTheRun": false,
          "isNewIssue": false,
          "benchmarkSecurityIdentifier": null,
          "benchmarkName": null,
          "underlyingSecurityId": -1,
          "zSpread": 55.9909,
          "gSpread": 56.1018,
          "yieldWorst": 1.98761,
          "amtOutstanding": 500000000,
          "marketValue": 505465000,
          "workoutTerm": 2.3096,
          "ratingDouble": 15,
          "isRated": true,
          "rating": "BBB",
          "ratingNoNotch": "BBB",
          "ratingBucket": "IG",
          "price": 101.093,
          "spread": 55.9909,
          "isIndex": true
        },
        "deltaMetrics": {
          "Dod": {
            "zSpread": 0.9286,
            "gSpread": -0.6553,
            "yieldWorst": -0.01729,
            "ratingDouble": 0,
            "price": -0.02,
            "spread": 0.9286
          },
          "Wow": {
            "zSpread": -4.4449,
            "gSpread": -6.6209,
            "yieldWorst": -0.04616,
            "ratingDouble": 0,
            "price": 0.097,
            "spread": -4.4449
          },
          "Mtd": {
            "zSpread": -21.3911,
            "gSpread": -26.4727,
            "yieldWorst": -0.14924,
            "ratingDouble": 0,
            "price": 0.477,
            "spread": -21.3911
          },
          "Mom": {
            "zSpread": -20.8384,
            "gSpread": -23.9648,
            "yieldWorst": -0.39725,
            "ratingDouble": 0,
            "price": 0.454,
            "spread": -20.8384
          },
          "Ytd": {
            "zSpread": -20.9562,
            "gSpread": -29.0038,
            "yieldWorst": -0.44862,
            "ratingDouble": 0,
            "price": 0.463,
            "spread": -20.9562
          },
          "Yoy": {
            "zSpread": -75.9301,
            "gSpread": -85.3982,
            "yieldWorst": -1.89625,
            "ratingDouble": 1,
            "price": 1.9345,
            "spread": -75.9301
          }
        },
        "firmPosition": {
          "mark": {
            "driver": "Spread",
            "enteredTime": null,
            "user": null,
            "value": 51.8474
          },
          "primaryPmName": "DJ",
          "backupPmName": "PM",
          "researchName": "AG",
          "owners": [
            "DJ",
            "PM",
            "AG"
          ],
          "partitionOptionValues": {
            "AccountName": [
              "NT AGB CUSTODY",
              "TD DOF PB"
            ],
            "AttributionOwner": [
              "Short Carry"
            ],
            "PortfolioShortName": [
              "AGB",
              "DOF"
            ],
            "StrategyName": [
              "Short Carry"
            ]
          },
          "date": "2020-02-18T00:00:00",
          "securityIdentifier": "2508",
          "quantity": 3354000,
          "cs01Cad": 999.2144229600001,
          "cs01Local": 999.2144229600001
        },
        "securityType": "Bond"
      },
      "rank": 0,
      "name": "BDX FRN 06/06/2022 Bullet USD SENIOR_UNSECURED",
      "isSecurityHistoricalSummary": true,
      "isGroupHistoricalSummary": false
    },
    "Group": {
      "databaseSource": "Citi",
      "startDate": "2020-01-14T00:00:00-05:00",
      "endDate": "2020-02-14T00:00:00-05:00",
      "metricName": "GSpread",
      "historicalLevel": {
        "targetSecurityIdentifier": null,
        "startMetric": 57.21887,
        "endMetric": 42.764143,
        "maxMetric": 58.020072,
        "minMetric": 42.615196,
        "timeSeries": {
          "2020-01-14T00:00:00": 57.21887,
          "2020-01-15T00:00:00": 55.461845,
          "2020-01-16T00:00:00": 54.191037,
          "2020-01-17T00:00:00": 58.020072,
          "2020-01-21T00:00:00": 55.371978,
          "2020-01-22T00:00:00": 52.992559,
          "2020-01-23T00:00:00": 52.323328,
          "2020-01-24T00:00:00": 53.0019,
          "2020-01-27T00:00:00": 48.449382,
          "2020-01-28T00:00:00": 50.138367,
          "2020-01-29T00:00:00": 51.961802,
          "2020-01-30T00:00:00": 50.457413,
          "2020-01-31T00:00:00": 53.613139,
          "2020-02-03T00:00:00": 51.787041,
          "2020-02-04T00:00:00": 52.140971,
          "2020-02-05T00:00:00": 47.605815,
          "2020-02-06T00:00:00": 45.714211,
          "2020-02-07T00:00:00": 46.36557,
          "2020-02-10T00:00:00": 42.615196,
          "2020-02-11T00:00:00": 44.279593,
          "2020-02-12T00:00:00": 43.322865,
          "2020-02-13T00:00:00": 42.642094,
          "2020-02-14T00:00:00": 42.764143
        },
        "isLevelRange": true,
        "isBasisRange": false,
        "isValid": true
      },
      "historicalBasis": {
        "targetSecurityIdentifier": "2508",
        "startMetric": -22.847755010324292,
        "endMetric": -13.337644323726629,
        "maxMetric": -13.337668,
        "minMetric": -30.550425000000004,
        "timeSeries": {
          "2020-01-14T00:00:00": -22.847766999999997,
          "2020-01-15T00:00:00": -26.816850000000002,
          "2020-01-16T00:00:00": -26.335473999999998,
          "2020-01-17T00:00:00": -25.270618999999996,
          "2020-01-21T00:00:00": -26.055084000000008,
          "2020-01-22T00:00:00": -30.550425000000004,
          "2020-01-23T00:00:00": -29.27922300000001,
          "2020-01-24T00:00:00": -18.781873999999995,
          "2020-01-27T00:00:00": -24.526466,
          "2020-01-28T00:00:00": -27.271603999999996,
          "2020-01-29T00:00:00": -25.488386999999996,
          "2020-01-30T00:00:00": -27.033857999999995,
          "2020-01-31T00:00:00": -28.96134,
          "2020-02-03T00:00:00": -27.003563999999997,
          "2020-02-04T00:00:00": -26.84744,
          "2020-02-05T00:00:00": -17.405012000000006,
          "2020-02-06T00:00:00": -18.557331999999995,
          "2020-02-07T00:00:00": -16.357137,
          "2020-02-10T00:00:00": -18.002161,
          "2020-02-11T00:00:00": -16.303336,
          "2020-02-12T00:00:00": -14.823098000000002,
          "2020-02-13T00:00:00": -14.114967999999998,
          "2020-02-14T00:00:00": -13.337668
        },
        "isLevelRange": false,
        "isBasisRange": true,
        "isValid": true
      },
      "group": {
        "groupIdentifier": {
          "source": "Default",
          "date": "2020-02-14T00:00:00-05:00",
          "groupOptionValues": {
            "Seniority": [
              "SR"
            ],
            "RatingNoNotch": [
              "BBB"
            ],
            "Sector": [
              "Health Care"
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
              "Float"
            ]
          },
          "filters": {},
          "singleSecurityTenorOptions": [
            "2Y",
            "3Y",
            "5Y",
            "7Y",
            "10Y",
            "20Y",
            "30Y"
          ],
          "metricContextFieldMinMax": null,
          "weightField": "AmtOutstanding"
        },
        "source": "Default",
        "date": "2020-02-14T00:00:00-05:00",
        "metricsType": "SantaServer.DataModels.SantaMetrics.IndividualSecurityMetrics, SantaServer, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
        "ccy": "USD",
        "securityType": "Bond",
        "couponType": "Float",
        "metrics": {
          "workoutTerm": 1.515832394366197,
          "ratingDouble": 15,
          "price": 100.50186869215695,
          "zSpread": 37.10451956005478,
          "gSpread": 42.76415567627337,
          "yieldWorst": 1.8608676981617294,
          "amtOutstanding": 772928333.3333334,
          "marketValue": 681249846.8,
          "tenor": "2Y",
          "backendTenor": "2Y",
          "propertyToNumSecurities": {
            "WorkoutTerm": 7,
            "RatingDouble": 7,
            "Price": 7,
            "BackendWorkoutTerm": 2,
            "OasSpread": 5,
            "ZSpread": 5,
            "AswUsd": 5,
            "GSpread": 5,
            "YieldWorst": 5,
            "AmtOutstanding": 7,
            "MarketValue": 7
          },
          "isRated": true,
          "rating": "BBB",
          "ratingNoNotch": "BBB",
          "ratingBucket": "NR",
          "spread": 0,
          "isIndex": false
        },
        "deltaMetrics": {
          "Dod": {
            "ratingDouble": 0,
            "price": -0.003499999999993578,
            "zSpread": 0.6757654979749284,
            "gSpread": 0.12205446876950023,
            "yieldWorst": -0.015850443463437655,
            "tenor": null,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 7,
              "RatingDouble": 7,
              "Price": 7,
              "BackendWorkoutTerm": 2,
              "OasSpread": 5,
              "ZSpread": 5,
              "AswUsd": 5,
              "GSpread": 5,
              "YieldWorst": 5,
              "AmtOutstanding": 7,
              "MarketValue": 7
            },
            "spread": 0
          },
          "Wow": {
            "ratingDouble": 0,
            "price": 0.02486903465873482,
            "zSpread": -1.105185037087918,
            "gSpread": -3.6014045372491705,
            "yieldWorst": -0.016777054117784976,
            "tenor": null,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 7,
              "RatingDouble": 7,
              "Price": 7,
              "BackendWorkoutTerm": 2,
              "OasSpread": 5,
              "ZSpread": 5,
              "AswUsd": 5,
              "GSpread": 5,
              "YieldWorst": 5,
              "AmtOutstanding": 7,
              "MarketValue": 7
            },
            "spread": 0
          },
          "Mtd": {
            "ratingDouble": 0,
            "price": 0.060356240994042736,
            "zSpread": -6.498944910934549,
            "gSpread": -10.848986408356613,
            "yieldWorst": -0.017399840214108828,
            "tenor": null,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 7,
              "RatingDouble": 7,
              "Price": 7,
              "BackendWorkoutTerm": 2,
              "OasSpread": 5,
              "ZSpread": 5,
              "AswUsd": 5,
              "GSpread": 5,
              "YieldWorst": 5,
              "AmtOutstanding": 7,
              "MarketValue": 7
            },
            "spread": 0
          },
          "Mom": {
            "ratingDouble": 0,
            "price": 0.10138699276098447,
            "zSpread": -9.028933466243922,
            "gSpread": -14.45468931340233,
            "yieldWorst": -0.25870239913384735,
            "tenor": null,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 7,
              "RatingDouble": 7,
              "Price": 7,
              "BackendWorkoutTerm": 2,
              "OasSpread": 5,
              "ZSpread": 5,
              "AswUsd": 5,
              "GSpread": 5,
              "YieldWorst": 5,
              "AmtOutstanding": 7,
              "MarketValue": 7
            },
            "spread": 0
          },
          "Ytd": {
            "ratingDouble": 0,
            "price": 0.13412300706776759,
            "zSpread": -8.311594149281486,
            "gSpread": -15.589016379415053,
            "yieldWorst": -0.2935988115950527,
            "tenor": null,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 7,
              "RatingDouble": 7,
              "Price": 7,
              "BackendWorkoutTerm": 2,
              "OasSpread": 5,
              "ZSpread": 5,
              "AswUsd": 5,
              "GSpread": 5,
              "YieldWorst": 5,
              "AmtOutstanding": 7,
              "MarketValue": 7
            },
            "spread": 0
          },
          "Yoy": {
            "ratingDouble": 1,
            "price": 1.2255463080880729,
            "zSpread": -52.450514080942376,
            "gSpread": -57.70074403738825,
            "yieldWorst": -1.623685529830602,
            "tenor": null,
            "backendTenor": null,
            "propertyToNumSecurities": {
              "WorkoutTerm": 7,
              "RatingDouble": 1,
              "Price": 6,
              "OasSpread": 4,
              "ZSpread": 4,
              "AswUsd": 4,
              "GSpread": 4,
              "YieldWorst": 4,
              "AmtOutstanding": 7,
              "MarketValue": 6
            },
            "spread": 0
          }
        },
        "numSecurities": 7,
        "name": "Bond|USD|2Y|BBB|Float|Health Car|SR",
        "type": "SingleSecurityGroup"
      },
      "rank": 0,
      "name": "Bond|USD|2Y|BBB|Float|Health Car|SR",
      "isSecurityHistoricalSummary": false,
      "isGroupHistoricalSummary": true
    },
    "Top": [
      {
        "databaseSource": "Citi",
        "startDate": "2020-01-14T00:00:00-05:00",
        "endDate": "2020-02-14T00:00:00-05:00",
        "metricName": "GSpread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 80.0666,
          "endMetric": 56.1018,
          "maxMetric": 83.542984,
          "minMetric": 56.101811,
          "timeSeries": {
            "2020-01-14T00:00:00": 80.066637,
            "2020-01-15T00:00:00": 82.278695,
            "2020-01-16T00:00:00": 80.526511,
            "2020-01-17T00:00:00": 83.290691,
            "2020-01-21T00:00:00": 81.427062,
            "2020-01-22T00:00:00": 83.542984,
            "2020-01-23T00:00:00": 81.602551,
            "2020-01-24T00:00:00": 71.783774,
            "2020-01-27T00:00:00": 72.975848,
            "2020-01-28T00:00:00": 77.409971,
            "2020-01-29T00:00:00": 77.450189,
            "2020-01-30T00:00:00": 77.491271,
            "2020-01-31T00:00:00": 82.574479,
            "2020-02-03T00:00:00": 78.790605,
            "2020-02-04T00:00:00": 78.988411,
            "2020-02-05T00:00:00": 65.010827,
            "2020-02-06T00:00:00": 64.271543,
            "2020-02-07T00:00:00": 62.722707,
            "2020-02-10T00:00:00": 60.617357,
            "2020-02-11T00:00:00": 60.582929,
            "2020-02-12T00:00:00": 58.145963,
            "2020-02-13T00:00:00": 56.757062,
            "2020-02-14T00:00:00": 56.101811
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": null,
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "2508",
          "ccy": "USD",
          "country": "US",
          "industry": "Medical Equipment & Devices Manufacturing",
          "name": "BDX FRN 06/06/2022 Bullet USD SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US075887BU29",
          "obligorName": "BECTON DICKINSON AND CO",
          "obligorId": 1278,
          "paymentRank": "SR UNSECURED",
          "sector": "Health Care",
          "securitySubType": "FRN",
          "subIndustry": "Drug Delivery Systems",
          "ticker": "BDX",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": false,
            "isFloat": true,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 55.9909,
            "gSpread": 56.1018,
            "yieldWorst": 1.98761,
            "amtOutstanding": 500000000,
            "marketValue": 505465000,
            "workoutTerm": 2.3096,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 101.093,
            "spread": 55.9909,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.9286,
              "gSpread": -0.6553,
              "yieldWorst": -0.01729,
              "ratingDouble": 0,
              "price": -0.02,
              "spread": 0.9286
            },
            "Wow": {
              "zSpread": -4.4449,
              "gSpread": -6.6209,
              "yieldWorst": -0.04616,
              "ratingDouble": 0,
              "price": 0.097,
              "spread": -4.4449
            },
            "Mtd": {
              "zSpread": -21.3911,
              "gSpread": -26.4727,
              "yieldWorst": -0.14924,
              "ratingDouble": 0,
              "price": 0.477,
              "spread": -21.3911
            },
            "Mom": {
              "zSpread": -20.8384,
              "gSpread": -23.9648,
              "yieldWorst": -0.39725,
              "ratingDouble": 0,
              "price": 0.454,
              "spread": -20.8384
            },
            "Ytd": {
              "zSpread": -20.9562,
              "gSpread": -29.0038,
              "yieldWorst": -0.44862,
              "ratingDouble": 0,
              "price": 0.463,
              "spread": -20.9562
            },
            "Yoy": {
              "zSpread": -75.9301,
              "gSpread": -85.3982,
              "yieldWorst": -1.89625,
              "ratingDouble": 1,
              "price": 1.9345,
              "spread": -75.9301
            }
          },
          "firmPosition": {
            "mark": {
              "driver": "Spread",
              "enteredTime": null,
              "user": null,
              "value": 51.8474
            },
            "primaryPmName": "DJ",
            "backupPmName": "PM",
            "researchName": "AG",
            "owners": [
              "DJ",
              "PM",
              "AG"
            ],
            "partitionOptionValues": {
              "AccountName": [
                "NT AGB CUSTODY",
                "TD DOF PB"
              ],
              "AttributionOwner": [
                "Short Carry"
              ],
              "PortfolioShortName": [
                "AGB",
                "DOF"
              ],
              "StrategyName": [
                "Short Carry"
              ]
            },
            "date": "2020-02-18T00:00:00",
            "securityIdentifier": "2508",
            "quantity": 3354000,
            "cs01Cad": 999.2144229600001,
            "cs01Local": 999.2144229600001
          },
          "securityType": "Bond"
        },
        "rank": 1,
        "name": "BDX FRN 06/06/2022 Bullet USD SENIOR_UNSECURED",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      },
      {
        "databaseSource": "Citi",
        "startDate": "2020-01-14T00:00:00-05:00",
        "endDate": "2020-02-14T00:00:00-05:00",
        "metricName": "GSpread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 44.9677,
          "endMetric": 30.8288,
          "maxMetric": 45.557768,
          "minMetric": 29.662044,
          "timeSeries": {
            "2020-01-14T00:00:00": 44.967713,
            "2020-01-15T00:00:00": 40.343172,
            "2020-01-16T00:00:00": 40.745272,
            "2020-01-17T00:00:00": 45.557768,
            "2020-01-21T00:00:00": 41.379045,
            "2020-01-22T00:00:00": 36.238903,
            "2020-01-23T00:00:00": 36.905008,
            "2020-01-24T00:00:00": 43.174426,
            "2020-01-27T00:00:00": 34.200518,
            "2020-01-28T00:00:00": 34.071517,
            "2020-01-29T00:00:00": 38.564227,
            "2020-01-30T00:00:00": 36.260563,
            "2020-01-31T00:00:00": 36.641017,
            "2020-02-03T00:00:00": 39.059246,
            "2020-02-04T00:00:00": 39.927573,
            "2020-02-05T00:00:00": 36.46852,
            "2020-02-06T00:00:00": 32.879461,
            "2020-02-07T00:00:00": 34.624424,
            "2020-02-10T00:00:00": 29.662044,
            "2020-02-11T00:00:00": 33.717995,
            "2020-02-12T00:00:00": 33.388995,
            "2020-02-13T00:00:00": 30.699184,
            "2020-02-14T00:00:00": 30.828767
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": {
          "targetSecurityIdentifier": "2508",
          "startMetric": -35.09889999999999,
          "endMetric": -25.272999999999996,
          "maxMetric": -24.756968,
          "minMetric": -47.304081000000004,
          "timeSeries": {
            "2020-01-14T00:00:00": -35.098924,
            "2020-01-15T00:00:00": -41.935522999999996,
            "2020-01-16T00:00:00": -39.781239,
            "2020-01-17T00:00:00": -37.73292299999999,
            "2020-01-21T00:00:00": -40.04801700000001,
            "2020-01-22T00:00:00": -47.304081000000004,
            "2020-01-23T00:00:00": -44.697543,
            "2020-01-24T00:00:00": -28.609347999999997,
            "2020-01-27T00:00:00": -38.77533,
            "2020-01-28T00:00:00": -43.338454,
            "2020-01-29T00:00:00": -38.88596199999999,
            "2020-01-30T00:00:00": -41.230708,
            "2020-01-31T00:00:00": -45.933462,
            "2020-02-03T00:00:00": -39.731359,
            "2020-02-04T00:00:00": -39.060838,
            "2020-02-05T00:00:00": -28.542307000000008,
            "2020-02-06T00:00:00": -31.392081999999995,
            "2020-02-07T00:00:00": -28.098283000000002,
            "2020-02-10T00:00:00": -30.955312999999997,
            "2020-02-11T00:00:00": -26.864933999999998,
            "2020-02-12T00:00:00": -24.756968,
            "2020-02-13T00:00:00": -26.057878,
            "2020-02-14T00:00:00": -25.273044
          },
          "isLevelRange": false,
          "isBasisRange": true,
          "isValid": true
        },
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "19830",
          "ccy": "USD",
          "country": "US",
          "industry": "Health Care Facilities & Services",
          "name": "CVS 0 03/09/21",
          "genericSeniority": "SR",
          "globalIdentifier": "US126650DD99",
          "obligorName": "CVS HEALTH CORP",
          "obligorId": 225,
          "paymentRank": "SR UNSECURED",
          "sector": "Health Care",
          "securitySubType": "FRN",
          "subIndustry": "Pharmacy Services",
          "ticker": "CVS",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": false,
            "isFloat": true,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 19.762,
            "gSpread": 30.8288,
            "yieldWorst": 1.75554,
            "amtOutstanding": 1000000000,
            "marketValue": 1005630000,
            "workoutTerm": 1.0658,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 100.563,
            "spread": 19.762,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.1025,
              "gSpread": 0.1296,
              "yieldWorst": -0.01739,
              "ratingDouble": 0,
              "price": -0.001,
              "spread": 0.1025
            },
            "Wow": {
              "zSpread": -1.3401,
              "gSpread": -3.7956,
              "yieldWorst": -0.02368,
              "ratingDouble": 0,
              "price": 0.009,
              "spread": -1.3401
            },
            "Mtd": {
              "zSpread": -2.4065,
              "gSpread": -5.8122,
              "yieldWorst": 0.00456,
              "ratingDouble": 0,
              "price": 0.013,
              "spread": -2.4065
            },
            "Mom": {
              "zSpread": -5.7324,
              "gSpread": -14.1389,
              "yieldWorst": -0.20433,
              "ratingDouble": 0,
              "price": 0.026,
              "spread": -5.7324
            },
            "Ytd": {
              "zSpread": -3.6742,
              "gSpread": -10.7232,
              "yieldWorst": -0.21772,
              "ratingDouble": 0,
              "price": 0,
              "spread": -3.6742
            },
            "Yoy": {
              "zSpread": -42.9243,
              "gSpread": -45.2812,
              "yieldWorst": -1.49629,
              "ratingDouble": 0,
              "price": 0.359,
              "spread": -42.9243
            }
          },
          "firmPosition": null,
          "securityType": "Bond"
        },
        "rank": 2,
        "name": "CVS 0 03/09/21",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      },
      {
        "databaseSource": "Citi",
        "startDate": "2020-01-14T00:00:00-05:00",
        "endDate": "2020-02-14T00:00:00-05:00",
        "metricName": "GSpread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 50.1599,
          "endMetric": 36.6795,
          "maxMetric": 52.343503,
          "minMetric": 36.679503,
          "timeSeries": {
            "2020-01-14T00:00:00": 50.15993,
            "2020-01-15T00:00:00": 52.343503,
            "2020-01-16T00:00:00": 51.235801,
            "2020-01-17T00:00:00": 51.924113,
            "2020-01-21T00:00:00": 49.842302,
            "2020-01-22T00:00:00": 48.819953,
            "2020-01-23T00:00:00": 46.429995,
            "2020-01-24T00:00:00": 42.71056,
            "2020-01-27T00:00:00": 43.944336,
            "2020-01-28T00:00:00": 44.018043,
            "2020-01-29T00:00:00": 45.567108,
            "2020-01-30T00:00:00": 38.514368,
            "2020-01-31T00:00:00": 43.580117,
            "2020-02-03T00:00:00": 40.901911,
            "2020-02-04T00:00:00": 41.596388,
            "2020-02-05T00:00:00": 38.999215,
            "2020-02-06T00:00:00": 39.233794,
            "2020-02-07T00:00:00": 41.837702,
            "2020-02-10T00:00:00": 38.899929,
            "2020-02-11T00:00:00": 37.414731,
            "2020-02-12T00:00:00": 42.37365,
            "2020-02-13T00:00:00": 42.375714,
            "2020-02-14T00:00:00": 36.679503
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": {
          "targetSecurityIdentifier": "2508",
          "startMetric": -29.906699999999994,
          "endMetric": -19.4223,
          "maxMetric": -14.381347999999996,
          "minMetric": -38.994361999999995,
          "timeSeries": {
            "2020-01-14T00:00:00": -29.906706999999997,
            "2020-01-15T00:00:00": -29.935192,
            "2020-01-16T00:00:00": -29.290709999999997,
            "2020-01-17T00:00:00": -31.366577999999997,
            "2020-01-21T00:00:00": -31.58476000000001,
            "2020-01-22T00:00:00": -34.723031000000006,
            "2020-01-23T00:00:00": -35.17255600000001,
            "2020-01-24T00:00:00": -29.073213999999993,
            "2020-01-27T00:00:00": -29.031512,
            "2020-01-28T00:00:00": -33.391928,
            "2020-01-29T00:00:00": -31.883080999999997,
            "2020-01-30T00:00:00": -38.976903,
            "2020-01-31T00:00:00": -38.994361999999995,
            "2020-02-03T00:00:00": -37.888694,
            "2020-02-04T00:00:00": -37.392023,
            "2020-02-05T00:00:00": -26.011612000000007,
            "2020-02-06T00:00:00": -25.03774899999999,
            "2020-02-07T00:00:00": -20.885005,
            "2020-02-10T00:00:00": -21.717427999999998,
            "2020-02-11T00:00:00": -23.168197999999997,
            "2020-02-12T00:00:00": -15.772313000000004,
            "2020-02-13T00:00:00": -14.381347999999996,
            "2020-02-14T00:00:00": -19.422308
          },
          "isLevelRange": false,
          "isBasisRange": true,
          "isValid": true
        },
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "9613",
          "ccy": "USD",
          "country": "GB",
          "industry": "Pharmaceuticals",
          "name": "AZN 0 06/10/22",
          "genericSeniority": "SR",
          "globalIdentifier": "US046353AP31",
          "obligorName": "ASTRAZENECA PLC",
          "obligorId": 87,
          "paymentRank": "SR UNSECURED",
          "sector": "Health Care",
          "securitySubType": "FRN",
          "subIndustry": "Medical-Drugs",
          "ticker": "AZN",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": false,
            "isFloat": true,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 36.6519,
            "gSpread": 36.6795,
            "yieldWorst": 1.79309,
            "amtOutstanding": 250000000,
            "marketValue": 251502500,
            "workoutTerm": 2.3205,
            "ratingDouble": 16,
            "isRated": true,
            "rating": "BBB+",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 100.601,
            "spread": 36.6519,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": -4.1071,
              "gSpread": -5.6962,
              "yieldWorst": -0.06771,
              "ratingDouble": 0,
              "price": 0.094,
              "spread": -4.1071
            },
            "Wow": {
              "zSpread": -3.0076,
              "gSpread": -5.1582,
              "yieldWorst": -0.03171,
              "ratingDouble": 0,
              "price": 0.07,
              "spread": -3.0076
            },
            "Mtd": {
              "zSpread": -1.8566,
              "gSpread": -6.9006,
              "yieldWorst": 0.0464,
              "ratingDouble": 0,
              "price": 0.04,
              "spread": -1.8566
            },
            "Mom": {
              "zSpread": -10.3615,
              "gSpread": -13.4804,
              "yieldWorst": -0.29275,
              "ratingDouble": 0,
              "price": 0.23,
              "spread": -10.3615
            },
            "Ytd": {
              "zSpread": -14.0758,
              "gSpread": -22.0946,
              "yieldWorst": -0.3803,
              "ratingDouble": 0,
              "price": 0.328,
              "spread": -14.0758
            },
            "Yoy": {
              "zSpread": 0,
              "gSpread": 0,
              "yieldWorst": 0,
              "ratingDouble": 0,
              "price": 0,
              "spread": 0
            }
          },
          "firmPosition": null,
          "securityType": "Bond"
        },
        "rank": 3,
        "name": "AZN 0 06/10/22",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      },
      {
        "databaseSource": "Citi",
        "startDate": "2020-01-14T00:00:00-05:00",
        "endDate": "2020-02-14T00:00:00-05:00",
        "metricName": "GSpread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 67.9676,
          "endMetric": 56.0024,
          "maxMetric": 68.995639,
          "minMetric": 51.594026,
          "timeSeries": {
            "2020-01-14T00:00:00": 67.967646,
            "2020-01-15T00:00:00": 68.995639,
            "2020-01-16T00:00:00": 68.002805,
            "2020-01-17T00:00:00": 64.332017,
            "2020-01-21T00:00:00": 65.481247,
            "2020-01-22T00:00:00": 63.175539,
            "2020-01-23T00:00:00": 61.029556,
            "2020-01-24T00:00:00": 62.841318,
            "2020-01-27T00:00:00": 64.675664,
            "2020-01-28T00:00:00": 63.729396,
            "2020-01-29T00:00:00": 65.908412,
            "2020-01-30T00:00:00": 62.30012,
            "2020-01-31T00:00:00": 67.477076,
            "2020-02-03T00:00:00": 58.050674,
            "2020-02-04T00:00:00": 63.337991,
            "2020-02-05T00:00:00": 61.097681,
            "2020-02-06T00:00:00": 59.614719,
            "2020-02-07T00:00:00": 60.490675,
            "2020-02-10T00:00:00": 58.639572,
            "2020-02-11T00:00:00": 60.027246,
            "2020-02-12T00:00:00": 53.615082,
            "2020-02-13T00:00:00": 51.594026,
            "2020-02-14T00:00:00": 56.002383
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": {
          "targetSecurityIdentifier": "2508",
          "startMetric": -12.09899999999999,
          "endMetric": -0.09939999999999571,
          "maxMetric": -0.09942799999999608,
          "minMetric": -20.739931,
          "timeSeries": {
            "2020-01-14T00:00:00": -12.098990999999998,
            "2020-01-15T00:00:00": -13.283056000000002,
            "2020-01-16T00:00:00": -12.523706000000004,
            "2020-01-17T00:00:00": -18.958674000000002,
            "2020-01-21T00:00:00": -15.94581500000001,
            "2020-01-22T00:00:00": -20.367445000000004,
            "2020-01-23T00:00:00": -20.572995000000006,
            "2020-01-24T00:00:00": -8.942455999999993,
            "2020-01-27T00:00:00": -8.300184000000002,
            "2020-01-28T00:00:00": -13.680574999999997,
            "2020-01-29T00:00:00": -11.541776999999996,
            "2020-01-30T00:00:00": -15.191150999999998,
            "2020-01-31T00:00:00": -15.097403,
            "2020-02-03T00:00:00": -20.739931,
            "2020-02-04T00:00:00": -15.650419999999997,
            "2020-02-05T00:00:00": -3.9131460000000047,
            "2020-02-06T00:00:00": -4.656823999999993,
            "2020-02-07T00:00:00": -2.2320319999999967,
            "2020-02-10T00:00:00": -1.9777849999999972,
            "2020-02-11T00:00:00": -0.5556830000000019,
            "2020-02-12T00:00:00": -4.530881000000001,
            "2020-02-13T00:00:00": -5.163035999999998,
            "2020-02-14T00:00:00": -0.09942799999999608
          },
          "isLevelRange": false,
          "isBasisRange": true,
          "isValid": true
        },
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "2602",
          "ccy": "USD",
          "country": "US",
          "industry": "Health Care Facilities & Services",
          "name": "CAH 0 06/15/22",
          "genericSeniority": "SR",
          "globalIdentifier": "US14149YBG26",
          "obligorName": "CARDINAL HEALTH INC",
          "obligorId": 151,
          "paymentRank": "SR UNSECURED",
          "sector": "Health Care",
          "securitySubType": "FRN",
          "subIndustry": "Medical-Whsle Drug Dist",
          "ticker": "CAH",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": false,
            "isFloat": true,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 56.0038,
            "gSpread": 56.0024,
            "yieldWorst": 1.98593,
            "amtOutstanding": 337570000,
            "marketValue": 339301734,
            "workoutTerm": 2.3342,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 100.513,
            "spread": 56.0038,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 5.999,
              "gSpread": 4.4084,
              "yieldWorst": 0.03331,
              "ratingDouble": 0,
              "price": -0.135,
              "spread": 5.999
            },
            "Wow": {
              "zSpread": -2.3627,
              "gSpread": -4.4883,
              "yieldWorst": -0.02523,
              "ratingDouble": 0,
              "price": 0.056,
              "spread": -2.3627
            },
            "Mtd": {
              "zSpread": -6.4593,
              "gSpread": -11.4747,
              "yieldWorst": 0.00055,
              "ratingDouble": 0,
              "price": 0.148,
              "spread": -6.4593
            },
            "Mom": {
              "zSpread": -8.8668,
              "gSpread": -11.9652,
              "yieldWorst": -0.27803,
              "ratingDouble": 0,
              "price": 0.199,
              "spread": -8.8668
            },
            "Ytd": {
              "zSpread": -7.3799,
              "gSpread": -15.3441,
              "yieldWorst": -0.31378,
              "ratingDouble": 0,
              "price": 0.174,
              "spread": -7.3799
            },
            "Yoy": {
              "zSpread": -54.7912,
              "gSpread": -64.2776,
              "yieldWorst": -1.6854,
              "ratingDouble": 0,
              "price": 1.5256,
              "spread": -54.7912
            }
          },
          "firmPosition": null,
          "securityType": "Bond"
        },
        "rank": 4,
        "name": "CAH 0 06/15/22",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      },
      {
        "databaseSource": "Citi",
        "startDate": "2020-01-14T00:00:00-05:00",
        "endDate": "2020-02-14T00:00:00-05:00",
        "metricName": "GSpread",
        "historicalLevel": {
          "targetSecurityIdentifier": null,
          "startMetric": 53.764,
          "endMetric": 50.4937,
          "maxMetric": 55.420939,
          "minMetric": 40.313629,
          "timeSeries": {
            "2020-01-14T00:00:00": 53.764016,
            "2020-01-15T00:00:00": 48.53261,
            "2020-01-16T00:00:00": 42.03903,
            "2020-01-17T00:00:00": 55.420939,
            "2020-01-21T00:00:00": 51.822727,
            "2020-01-22T00:00:00": 49.939649,
            "2020-01-23T00:00:00": 50.033593,
            "2020-01-24T00:00:00": 51.961496,
            "2020-01-27T00:00:00": 40.564001,
            "2020-01-28T00:00:00": 48.049051,
            "2020-01-29T00:00:00": 43.775465,
            "2020-01-30T00:00:00": 49.350548,
            "2020-01-31T00:00:00": 54.678666,
            "2020-02-03T00:00:00": 51.229978,
            "2020-02-04T00:00:00": 44.294457,
            "2020-02-05T00:00:00": 47.712444,
            "2020-02-06T00:00:00": 47.326856,
            "2020-02-07T00:00:00": 46.120012,
            "2020-02-10T00:00:00": 40.853658,
            "2020-02-11T00:00:00": 40.313629,
            "2020-02-12T00:00:00": 40.94047,
            "2020-02-13T00:00:00": 49.075819,
            "2020-02-14T00:00:00": 50.493709
          },
          "isLevelRange": true,
          "isBasisRange": false,
          "isValid": true
        },
        "historicalBasis": {
          "targetSecurityIdentifier": "2508",
          "startMetric": -26.30259999999999,
          "endMetric": -5.6081,
          "maxMetric": -5.608101999999995,
          "minMetric": -38.487481,
          "timeSeries": {
            "2020-01-14T00:00:00": -26.302621000000002,
            "2020-01-15T00:00:00": -33.746085,
            "2020-01-16T00:00:00": -38.487481,
            "2020-01-17T00:00:00": -27.869752,
            "2020-01-21T00:00:00": -29.604335000000006,
            "2020-01-22T00:00:00": -33.603335,
            "2020-01-23T00:00:00": -31.568958000000002,
            "2020-01-24T00:00:00": -19.822277999999997,
            "2020-01-27T00:00:00": -32.411847,
            "2020-01-28T00:00:00": -29.36092,
            "2020-01-29T00:00:00": -33.674724,
            "2020-01-30T00:00:00": -28.140722999999994,
            "2020-01-31T00:00:00": -27.895812999999997,
            "2020-02-03T00:00:00": -27.560626999999997,
            "2020-02-04T00:00:00": -34.693954,
            "2020-02-05T00:00:00": -17.29838300000001,
            "2020-02-06T00:00:00": -16.944686999999995,
            "2020-02-07T00:00:00": -16.602694999999997,
            "2020-02-10T00:00:00": -19.763698999999995,
            "2020-02-11T00:00:00": -20.2693,
            "2020-02-12T00:00:00": -17.205493000000004,
            "2020-02-13T00:00:00": -7.681242999999995,
            "2020-02-14T00:00:00": -5.608101999999995
          },
          "isLevelRange": false,
          "isBasisRange": true,
          "isValid": true
        },
        "security": {
          "isSovereign": false,
          "isGovt": false,
          "isEm": false,
          "securityIdentifier": "23368",
          "ccy": "USD",
          "country": "US",
          "industry": "Pharmaceuticals",
          "name": "ZTS FRN 08/20/2021 Bullet USD  SENIOR_UNSECURED",
          "genericSeniority": "SR",
          "globalIdentifier": "US98978VAR42",
          "obligorName": "ZOETIS INC",
          "obligorId": 2180,
          "paymentRank": "SR UNSECURED",
          "sector": "Health Care",
          "securitySubType": "FRN",
          "subIndustry": "Medical-Drugs",
          "ticker": "ZTS",
          "metrics": {
            "isFixedForLife": false,
            "isFixedToFloatInFixed": false,
            "isFloat": true,
            "isOnTheRun": false,
            "isNewIssue": false,
            "benchmarkSecurityIdentifier": null,
            "benchmarkName": null,
            "underlyingSecurityId": -1,
            "zSpread": 42.5467,
            "gSpread": 50.4937,
            "yieldWorst": 1.91648,
            "amtOutstanding": 300000000,
            "marketValue": 300090000,
            "workoutTerm": 1.5151,
            "ratingDouble": 15,
            "isRated": true,
            "rating": "BBB",
            "ratingNoNotch": "BBB",
            "ratingBucket": "IG",
            "price": 100.03,
            "spread": 42.5467,
            "isIndex": true
          },
          "deltaMetrics": {
            "Dod": {
              "zSpread": 0.1611,
              "gSpread": 1.4179,
              "yieldWorst": -0.02042,
              "ratingDouble": 0,
              "price": -0.001,
              "spread": 0.1611
            },
            "Wow": {
              "zSpread": 8.2444,
              "gSpread": 4.3737,
              "yieldWorst": 0.07716,
              "ratingDouble": 0,
              "price": -0.12,
              "spread": 8.2444
            },
            "Mtd": {
              "zSpread": 0.7666,
              "gSpread": -4.185,
              "yieldWorst": 0.05577,
              "ratingDouble": 0,
              "price": -0.007,
              "spread": 0.7666
            },
            "Mom": {
              "zSpread": 0.5931,
              "gSpread": -3.2703,
              "yieldWorst": -0.15891,
              "ratingDouble": 0,
              "price": -0.007,
              "spread": 0.5931
            },
            "Ytd": {
              "zSpread": 1.0599,
              "gSpread": -4.3047,
              "yieldWorst": -0.1932,
              "ratingDouble": 0,
              "price": -0.001,
              "spread": 1.0599
            },
            "Yoy": {
              "zSpread": -42.4381,
              "gSpread": -45.5363,
              "yieldWorst": -1.52462,
              "ratingDouble": 0,
              "price": 0.9952,
              "spread": -42.4381
            }
          },
          "firmPosition": null,
          "securityType": "Bond"
        },
        "rank": 5,
        "name": "ZTS FRN 08/20/2021 Bullet USD  SENIOR_UNSECURED",
        "isSecurityHistoricalSummary": true,
        "isGroupHistoricalSummary": false
      }
    ],
    "Bottom": []
  }
}