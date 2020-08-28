import { BEHistoricalSummaryOverviewDTO } from 'BEModels/backend-models.interface';

export const HistoricalSummarySampleReturn: BEHistoricalSummaryOverviewDTO = {
  "GroupIdentifierWithInclusiveOptions":{
    "source":"Default",
    "date":"2020-03-03T00:00:00-05:00",
    "groupOptionValues":{
      "SecurityType":[
        "Bond"
      ],
      "Ccy":[
        "USD"
      ],
      "CouponType":[
        "Float"
      ],
      "BackendTenor":[
        "None"
      ],
      "BailInStatus":[
        "Not bail in"
      ],
      "Country":[
        "US"
      ],
      "Industry":[
        "Medical Equipment & Devices Manufacturing"
      ],
      "IsNewIssue":[
        "N"
      ],
      "IsOnTheRun":[
        "N"
      ],
      "MaturityType":[
        "Bullet"
      ],
      "ObligorId":[
        "1278"
      ],
      "QuotedToday":[
        "Y"
      ],
      "RatingNoNotch":[
        "BBB"
      ],
      "RatingBucket":[
        "Xover"
      ],
      "Sector":[
        "Health Care"
      ],
      "SecurityIdentifier":[
        "2508"
      ],
      "Seniority":[
        "SR"
      ],
      "SubIndustry":[
        "Drug Delivery Systems"
      ],
      "Tenor":[
        "2Y"
      ],
      "Ticker":[
        "BDX"
      ],
      "IsOwned":[
        "Y"
      ],
      "PrimaryPmName":[
        "DJ"
      ],
      "BackupPmName":[
        "PM"
      ],
      "ResearchName":[
        "AG"
      ],
      "PortfolioShortName":[
        "None"
      ],
      "StrategyName":[
        "None"
      ],
      "Owner":[
        "None"
      ]
    },
    "groupFilters":{

    }
  },
  "Mom":{
    "BaseSecurity":{
      "databaseSource":"Citi",
      "startDate":"2020-02-03T00:00:00-05:00",
      "endDate":"2020-03-03T00:00:00-05:00",
      "metricName":"Spread",
      "historicalLevel":{
        "targetSecurityIdentifier":null,
        "startMetric":75.0092,
        "endMetric":null,
        "maxMetric":null,
        "minMetric":null,
        "timeSeries":{

        },
        "isLevelRange":true,
        "isBasisRange":false,
        "isValid":false
      },
      "historicalBasis":null,
      "security":{
        "securityIdentifier":"79",
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
          },
          "Index":{
            "isFixedForLife":true,
            "isFixedToFloatInFixed":false,
            "isFloat":false,
            "isOnTheRun":true,
            "isNewIssue":false,
            "benchmarkSecurityIdentifier":null,
            "benchmarkName":null,
            "underlyingSecurityId":-1,
            "yieldWorst":1.676677,
            "amtOutstanding":800000000,
            "marketValue":885715240,
            "workoutTerm":4.5644,
            "ratingDouble":null,
            "isRated":true,
            "rating":null,
            "ratingNoNotch":null,
            "ratingBucket":"NR",
            "price":109.060295,
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
        "name":"TCN 3.75 01/17/2025 Callable CAD SENIOR_UNSECURED",
        "genericSeniority":"SR",
        "globalIdentifier":"CA87971MAX17",
        "obligorName":"TELUS CORP",
        "obligorId":756,
        "paymentRank":"SR UNSECURED",
        "sector":"Communications",
        "securitySubType":"Bond",
        "subIndustry":"Telecom Services",
        "ticker":"TCN",
        "unitPosition":{
          "securityIdentifier":"79",
          "partitionOptionValues":{
            "PortfolioShortName":[
              "DOF"
            ],
            "StrategyName":[
              "LTOV - Spread"
            ]
          },
          "mark":{
            "driver":"Spread",
            "enteredTime":"2020-06-29T00:00:00-04:00",
            "user":null,
            "value":124,
            "spread":124,
            "price":109.220155
          },
          "hedgeFactor":1,
          "primaryPmName":"IL",
          "backupPmName":"ST",
          "researchName":"LC",
          "owners":[
            "IL",
            "ST",
            "LC"
          ],
          "metrics": {
            "FO": {
              "2020-06-29T00:00:00-04:00": {
                "backupPmName":"ST",
                "date": "2020-06-29T00:00:00-04:00",
                "hedgeFactor":1,
                "mark":{
                  "driver":"Spread",
                  "enteredTime":"2020-06-29T00:00:00-04:00",
                  "user":null,
                  "value":124,
                  "spread":124,
                  "price":109.220155
                },
                "partitionOptionValues":{
                  "PortfolioShortName":[
                    "DOF"
                  ],
                  "StrategyName":[
                    "LTOV - Spread"
                  ]
                },
                "owners":[
                  "IL",
                  "ST",
                  "LC"
                ],
                "primaryPmName":"IL",
                "researchName":"LC",
                "source": 1
              }
            }
          }
        },
        "securityType":"Bond",
        "maturityType":"Callable"
      },
      "rank":0,
      "name":"BDX FRN 06/06/2022 Bullet USD SENIOR_UNSECURED",
      "isSecurityHistoricalSummary":true,
      "isGroupHistoricalSummary":false
    },
    "Group":{
      "databaseSource":"Citi",
      "startDate":"2020-02-03T00:00:00-05:00",
      "endDate":"2020-03-03T00:00:00-05:00",
      "metricName":"Spread",
      "historicalLevel":{
        "targetSecurityIdentifier":null,
        "startMetric":null,
        "endMetric":null,
        "maxMetric":null,
        "minMetric":null,
        "timeSeries":{

        },
        "isLevelRange":true,
        "isBasisRange":false,
        "isValid":false
      },
      "historicalBasis":{
        "targetSecurityIdentifier":"2508",
        "startMetric":null,
        "endMetric":null,
        "maxMetric":null,
        "minMetric":null,
        "timeSeries":{

        },
        "isLevelRange":false,
        "isBasisRange":true,
        "isValid":false
      },
      "group":{
        "ccy":"USD",
        "securityType":"Bond",
        "couponType":"Float",
        "metrics":{
          "workoutTerm":2.2603,
          "ratingDouble":14,
          "price":0,
          "zSpread":0,
          "gSpread":0,
          "yieldWorst":0,
          "amtOutstanding":500000000,
          "marketValue":508136980,
          "spread":0,
          "tenor":"2Y",
          "backendTenor":"2Y",
          "propertyToNumSecurities":{
            "WorkoutTerm":1,
            "RatingDouble":1,
            "AmtOutstanding":1,
            "MarketValue":1
          },
          "isRated":true,
          "rating":"BBB-",
          "ratingNoNotch":"BBB",
          "ratingBucket":"NR",
          "isIndex":false
        },
        "deltaMetrics":{
          "Dod":{
            "ratingDouble":-1,
            "price":0,
            "zSpread":0,
            "gSpread":0,
            "yieldWorst":0,
            "spread":0,
            "tenor":null,
            "backendTenor":null,
            "propertyToNumSecurities":{
              "WorkoutTerm":1,
              "RatingDouble":1,
              "AmtOutstanding":1,
              "MarketValue":1
            }
          },
          "Wow":{
            "ratingDouble":-1,
            "price":0,
            "zSpread":0,
            "gSpread":0,
            "yieldWorst":0,
            "spread":0,
            "tenor":null,
            "backendTenor":null,
            "propertyToNumSecurities":{
              "WorkoutTerm":1,
              "RatingDouble":1,
              "AmtOutstanding":1,
              "MarketValue":1
            }
          },
          "Mtd":{
            "ratingDouble":-1,
            "price":0,
            "zSpread":0,
            "gSpread":0,
            "yieldWorst":0,
            "spread":0,
            "tenor":null,
            "backendTenor":null,
            "propertyToNumSecurities":{
              "WorkoutTerm":1,
              "RatingDouble":1,
              "AmtOutstanding":1,
              "MarketValue":1
            }
          },
          "Mom":{
            "ratingDouble":-1,
            "price":0,
            "zSpread":0,
            "gSpread":0,
            "yieldWorst":0,
            "spread":0,
            "tenor":null,
            "backendTenor":null,
            "propertyToNumSecurities":{
              "WorkoutTerm":1,
              "RatingDouble":1,
              "AmtOutstanding":1,
              "MarketValue":1
            }
          },
          "Ytd":{
            "ratingDouble":-1,
            "price":0,
            "zSpread":0,
            "gSpread":0,
            "yieldWorst":0,
            "spread":0,
            "tenor":null,
            "backendTenor":null,
            "propertyToNumSecurities":{
              "WorkoutTerm":1,
              "RatingDouble":1,
              "AmtOutstanding":1,
              "MarketValue":1
            }
          },
          "Yoy":{
            "ratingDouble":0,
            "price":0,
            "zSpread":0,
            "gSpread":0,
            "yieldWorst":0,
            "spread":0,
            "tenor":null,
            "backendTenor":null,
            "propertyToNumSecurities":{
              "WorkoutTerm":1,
              "RatingDouble":1,
              "AmtOutstanding":1,
              "MarketValue":1
            }
          }
        },
        "isValid":true,
        "groupIdentifier":{
          "source":"Default",
          "date":"2020-03-03T00:00:00-05:00",
          "groupOptionValues":{
            "Seniority":[
              "SR"
            ],
            "RatingNoNotch":[
              "BBB"
            ],
            "Sector":[
              "Health Care"
            ],
            "Industry":[
              "Medical Equipment & Devices Manufacturing"
            ],
            "Tenor":[
              "2Y"
            ],
            "Country":[
              "US"
            ],
            "Ccy":[
              "USD"
            ],
            "SecurityType":[
              "Bond"
            ],
            "CouponType":[
              "Float"
            ]
          },
          "groupFilters":{

          }
        },
        "source":"Default",
        "date":"2020-03-03T00:00:00-05:00",
        "numSecurities":1,
        "name":"Bond|USD|Float|SR|2Y|BBB|Health Car|Medical Eq|US",
        "type":"SingleSecurityGroup"
      },
      "rank":0,
      "name":"Bond|USD|Float|SR|2Y|BBB|Health Car|Medical Eq|US",
      "isSecurityHistoricalSummary":false,
      "isGroupHistoricalSummary":true
    },
    "Top":[

    ],
    "Bottom":[

    ]
  }
}
