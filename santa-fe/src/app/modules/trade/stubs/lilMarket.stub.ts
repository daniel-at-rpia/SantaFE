import { BEHistoricalSummaryOverviewDTO } from 'BEModels/backend-models.interface';
import { CompactSecuritySample } from 'Core/stubs/securities.stub';

export const HistoricalSummarySampleReturn: BEHistoricalSummaryOverviewDTO = {
    "GroupIdentifierWithInclusiveOptions": {
        "source": "Default",
        "date": "2020-11-25T00:00:00-05:00",
        "groupOptionValues": {
            "SecurityType": [
                "Bond"
            ],
            "Ccy": [
                "CAD"
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
                "20101110"
            ],
            "BicsLevel1": [
                "Utilities"
            ],
            "BicsLevel2": [
                "Utilities"
            ],
            "BicsLevel3": [
                "Gas & Water Utilities"
            ],
            "BicsLevel4": [
                "Gas Utilities"
            ],
            "Country": [
                "Canada"
            ],
            "Industry": [
                "Gas"
            ],
            "IsNewIssue": [
                "N"
            ],
            "MaturityType": [
                "Callable"
            ],
            "ObligorId": [
                "2252"
            ],
            "QuotedToday": [
                "N"
            ],
            "RatingNoNotch": [
                "BBB"
            ],
            "RatingBucket": [
                "IG"
            ],
            "Sector": [
                "Utilities"
            ],
            "SecurityIdentifier": [
                "25064"
            ],
            "Seniority": [
                "SR"
            ],
            "SubIndustry": [
                "Gas-Distribution"
            ],
            "Tenor": [
                "7Y"
            ],
            "Ticker": [
                "ACICN"
            ],
            "IsOwned": [
                "Y"
            ],
            "PrimaryPmName": [
                "IL"
            ],
            "BackupPmName": [
                "IL"
            ],
            "ResearchName": [
                "PD"
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
            "startDate": "2020-10-23T00:00:00-04:00",
            "endDate": "2020-11-25T00:00:00-05:00",
            "metricName": "Spread",
            "historicalLevel": {
                "targetSecurityIdentifier": null,
                "startMetric": 127.0,
                "endMetric": 117.0,
                "maxMetric": 127.0,
                "minMetric": 117.0,
                "timeSeries": {},
                "isLevelRange": true,
                "isBasisRange": false,
                "isValid": true
            },
            "historicalBasis": null,
            "security": {
                "securityIdentifier": "25064",
                "metrics": {
                    "FO": {
                        "isFixedForLife": true,
                        "isFixedToFloatInFixed": false,
                        "isFloat": false,
                        "isNewIssue": false,
                        "benchmarkSecurityIdentifier": "18211",
                        "benchmarkName": "CAN 2 06/01/2028 CAD",
                        "underlyingSecurityId": -1,
                        "yieldWorst": 1.752829,
                        "amtOutstanding": 300000000.0,
                        "marketValue": 360941619.0,
                        "workoutTerm": 7.783562,
                        "ratingDouble": 16.0,
                        "isRated": true,
                        "rating": "BBB+",
                        "ratingNoNotch": "BBB",
                        "ratingBucket": "IG",
                        "price": 118.306421,
                        "spread": 117.0
                    },
                    "Default": {
                        "isFixedForLife": true,
                        "isFixedToFloatInFixed": false,
                        "isFloat": false,
                        "isNewIssue": false,
                        "benchmarkSecurityIdentifier": "18211",
                        "benchmarkName": "CAN 2 06/01/2028 CAD",
                        "underlyingSecurityId": -1,
                        "yieldWorst": 1.752829,
                        "amtOutstanding": 300000000.0,
                        "marketValue": 360941619.0,
                        "workoutTerm": 7.783562,
                        "ratingDouble": 16.0,
                        "isRated": true,
                        "rating": "BBB+",
                        "ratingNoNotch": "BBB",
                        "ratingBucket": "IG",
                        "price": 118.306421,
                        "spread": 117.0
                    }
                },
                "deltaMetrics": {
                    "Dod": {
                        "yieldWorst": 0.0,
                        "ratingDouble": 0.0,
                        "price": 0.141754,
                        "spread": 0.0
                    },
                    "Wow": {
                        "yieldWorst": 0.004912,
                        "ratingDouble": 0.0,
                        "price": 0.067035,
                        "spread": -2.0
                    },
                    "Mtd": {
                        "yieldWorst": -0.075326,
                        "ratingDouble": 0.0,
                        "price": 0.598157,
                        "spread": -14.0
                    },
                    "Mom": {
                        "yieldWorst": -0.013877,
                        "ratingDouble": 0.0,
                        "price": 0.064373,
                        "spread": -10.0
                    },
                    "Ytd": {
                        "yieldWorst": -1.247046,
                        "ratingDouble": 0.0,
                        "price": 8.737846,
                        "spread": -11.0
                    },
                    "Yoy": {
                        "yieldWorst": -1.135634,
                        "ratingDouble": 0.0,
                        "price": 7.736116,
                        "spread": -24.0
                    }
                },
                "ccy": "CAD",
                "obligorId": 2252,
                "obligorName": "ALTAGAS CANADA INC",
                "country": "Canada",
                "sector": "Utilities",
                "industry": "Gas",
                "subIndustry": "Gas-Distribution",
                "bicsCode": "20101110",
                "bicsLevel1": "Utilities",
                "bicsLevel2": "Utilities",
                "bicsLevel3": "Gas & Water Utilities",
                "bicsLevel4": "Gas Utilities",
                "name": "ACICN 4.26 12/05/2028 Callable CAD MTN SENIOR_UNSECURED",
                "genericSeniority": "SR",
                "globalIdentifier": "CA02091ZAA62",
                "paymentRank": "SR UNSECURED",
                "securitySubType": "Bond",
                "ticker": "ACICN",
                "unitPosition": {
                    "securityIdentifier": "25064",
                    "partitionOptionValues": {
                        "PortfolioShortName": [
                            "STIP",
                            "CIP",
                            "BBB"
                        ],
                        "StrategyName": [
                            "LTOV - Spread"
                        ]
                    },
                    "strategyAsOfDate": "2020-11-24T00:00:00",
                    "mark": {
                        "driver": "Spread",
                        "enteredTime": "2020-11-25T00:00:00-05:00",
                        "user": null,
                        "value": 117.0,
                        "spread": 117.0,
                        "price": 118.306421,
                        "yield": 0.4
                    },
                    "hedgeFactor": 1.0,
                    "strategies": [
                        "LTOV - Spread"
                    ],
                    "owners": [
                        "IL",
                        "PD"
                    ],
                    "primaryPmName": "IL",
                    "backupPmName": "IL",
                    "researchName": "PD"
                },
                "securityType": "Bond",
                "maturityType": "Callable"
            },
            "rank": 0,
            "name": "ACICN 4.26 12/05/2028 Callable CAD MTN SENIOR_UNSECURED",
            "isSecurityHistoricalSummary": true,
            "isGroupHistoricalSummary": false
        },
        "Group": {
            "sourceInDb": "FTSE",
            "startDate": "2020-10-23T00:00:00-04:00",
            "endDate": "2020-11-25T00:00:00-05:00",
            "metricName": "Spread",
            "historicalLevel": {
                "targetSecurityIdentifier": null,
                "startMetric": null,
                "endMetric": null,
                "maxMetric": null,
                "minMetric": null,
                "timeSeries": {},
                "isLevelRange": true,
                "isBasisRange": false,
                "isValid": false
            },
            "historicalBasis": {
                "targetSecurityIdentifier": "25064",
                "startMetric": null,
                "endMetric": null,
                "maxMetric": null,
                "minMetric": null,
                "timeSeries": {},
                "isLevelRange": false,
                "isBasisRange": true,
                "isValid": false
            },
            "group": {
                "ccy": "CAD",
                "securityType": "Bond",
                "couponType": "Fixed",
                "metrics": {
                    "workoutTerm": 7.783562,
                    "ratingDouble": 16.0,
                    "price": 118.306421,
                    "yieldWorst": 1.752829,
                    "amtOutstanding": 300000000.0,
                    "marketValue": 360941619.0,
                    "spread": null,
                    "tenor": "7Y",
                    "backendTenor": "2Y",
                    "propertyToNumSecurities": {
                        "WorkoutTerm": 1,
                        "RatingDouble": 1,
                        "Price": 1,
                        "BackendWorkoutTerm": 1,
                        "OasSpread": 1,
                        "ZSpread": 1,
                        "GSpread": 1,
                        "YieldWorst": 1,
                        "AmtOutstanding": 1,
                        "MarketValue": 1
                    },
                    "isRated": true,
                    "rating": "BBB+",
                    "ratingNoNotch": "BBB",
                    "ratingBucket": "NR"
                },
                "deltaMetrics": {
                    "Dod": {
                        "ratingDouble": 0.0,
                        "price": 0.14175400000000593,
                        "yieldWorst": 0.0,
                        "spread": null,
                        "tenor": null,
                        "backendTenor": null,
                        "propertyToNumSecurities": {
                            "WorkoutTerm": 1,
                            "RatingDouble": 1,
                            "Price": 1,
                            "BackendWorkoutTerm": 1,
                            "OasSpread": 1,
                            "ZSpread": 1,
                            "GSpread": 1,
                            "YieldWorst": 1,
                            "AmtOutstanding": 1,
                            "MarketValue": 1
                        }
                    },
                    "Wow": {
                        "ratingDouble": 0.0,
                        "price": 0.06703500000000417,
                        "yieldWorst": 0.0049120000000000275,
                        "spread": null,
                        "tenor": null,
                        "backendTenor": null,
                        "propertyToNumSecurities": {
                            "WorkoutTerm": 1,
                            "RatingDouble": 1,
                            "Price": 1,
                            "BackendWorkoutTerm": 1,
                            "OasSpread": 1,
                            "ZSpread": 1,
                            "GSpread": 1,
                            "YieldWorst": 1,
                            "AmtOutstanding": 1,
                            "MarketValue": 1
                        }
                    },
                    "Mtd": {
                        "ratingDouble": 0.0,
                        "price": 0.5981570000000005,
                        "yieldWorst": -0.075326,
                        "spread": null,
                        "tenor": null,
                        "backendTenor": null,
                        "propertyToNumSecurities": {
                            "WorkoutTerm": 1,
                            "RatingDouble": 1,
                            "Price": 1,
                            "BackendWorkoutTerm": 1,
                            "OasSpread": 1,
                            "ZSpread": 1,
                            "GSpread": 1,
                            "YieldWorst": 1,
                            "AmtOutstanding": 1,
                            "MarketValue": 1
                        }
                    },
                    "Mom": {
                        "ratingDouble": 0.0,
                        "price": 0.06437300000000334,
                        "yieldWorst": -0.01387700000000014,
                        "spread": null,
                        "tenor": null,
                        "backendTenor": null,
                        "propertyToNumSecurities": {
                            "WorkoutTerm": 1,
                            "RatingDouble": 1,
                            "Price": 1,
                            "BackendWorkoutTerm": 1,
                            "OasSpread": 1,
                            "ZSpread": 1,
                            "GSpread": 1,
                            "YieldWorst": 1,
                            "AmtOutstanding": 1,
                            "MarketValue": 1
                        }
                    },
                    "Ytd": {
                        "ratingDouble": 0.0,
                        "price": 8.737846000000005,
                        "yieldWorst": -1.2470459999999999,
                        "spread": null,
                        "tenor": null,
                        "backendTenor": null,
                        "propertyToNumSecurities": {
                            "WorkoutTerm": 1,
                            "RatingDouble": 1,
                            "Price": 1,
                            "BackendWorkoutTerm": 1,
                            "OasSpread": 1,
                            "GSpread": 1,
                            "YieldWorst": 1,
                            "AmtOutstanding": 1,
                            "MarketValue": 1
                        }
                    },
                    "Yoy": {
                        "ratingDouble": 0.0,
                        "price": 7.7361159999999956,
                        "yieldWorst": -1.1356339999999998,
                        "spread": null,
                        "tenor": null,
                        "backendTenor": null,
                        "propertyToNumSecurities": {
                            "WorkoutTerm": 1,
                            "RatingDouble": 1,
                            "Price": 1,
                            "BackendWorkoutTerm": 1,
                            "OasSpread": 1,
                            "GSpread": 1,
                            "YieldWorst": 1,
                            "AmtOutstanding": 1,
                            "MarketValue": 1
                        }
                    }
                },
                "isValid": true,
                "groupIdentifier": {
                    "source": "Default",
                    "date": "2020-11-25T00:00:00-05:00",
                    "groupOptionValues": {
                        "Seniority": [
                            "SR"
                        ],
                        "RatingNoNotch": [
                            "BBB"
                        ],
                        "Sector": [
                            "Utilities"
                        ],
                        "Industry": [
                            "Gas"
                        ],
                        "Tenor": [
                            "7Y"
                        ],
                        "Country": [
                            "Canada"
                        ],
                        "Ccy": [
                            "CAD"
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
                "date": "2020-11-25T00:00:00-05:00",
                "numSecurities": 1,
                "name": "Bond|CAD|Fixed|SR|7Y|BBB|Utilities|Gas|Canada",
                "type": "SingleSecurityGroup"
            },
            "rank": 0,
            "name": "Bond|CAD|Fixed|SR|7Y|BBB|Utilities|Gas|Canada",
            "isSecurityHistoricalSummary": false,
            "isGroupHistoricalSummary": true
        },
        "Top": [
            {
                "sourceInDb": "RP",
                "startDate": "2020-10-23T00:00:00-04:00",
                "endDate": "2020-11-25T00:00:00-05:00",
                "metricName": "Spread",
                "historicalLevel": {
                    "targetSecurityIdentifier": null,
                    "startMetric": 127.0,
                    "endMetric": 117.0,
                    "maxMetric": 127.0,
                    "minMetric": 117.0,
                    "timeSeries": {},
                    "isLevelRange": true,
                    "isBasisRange": false,
                    "isValid": true
                },
                "historicalBasis": null,
                "security": {
                    "securityIdentifier": "25064",
                    "metrics": {
                        "FO": {
                            "isFixedForLife": true,
                            "isFixedToFloatInFixed": false,
                            "isFloat": false,
                            "isNewIssue": false,
                            "benchmarkSecurityIdentifier": "18211",
                            "benchmarkName": "CAN 2 06/01/2028 CAD",
                            "underlyingSecurityId": -1,
                            "yieldWorst": 1.752829,
                            "amtOutstanding": 300000000.0,
                            "marketValue": 360941619.0,
                            "workoutTerm": 7.783562,
                            "ratingDouble": 16.0,
                            "isRated": true,
                            "rating": "BBB+",
                            "ratingNoNotch": "BBB",
                            "ratingBucket": "IG",
                            "price": 118.306421,
                            "spread": 117.0
                        },
                        "Default": {
                            "isFixedForLife": true,
                            "isFixedToFloatInFixed": false,
                            "isFloat": false,
                            "isNewIssue": false,
                            "benchmarkSecurityIdentifier": "18211",
                            "benchmarkName": "CAN 2 06/01/2028 CAD",
                            "underlyingSecurityId": -1,
                            "yieldWorst": 1.752829,
                            "amtOutstanding": 300000000.0,
                            "marketValue": 360941619.0,
                            "workoutTerm": 7.783562,
                            "ratingDouble": 16.0,
                            "isRated": true,
                            "rating": "BBB+",
                            "ratingNoNotch": "BBB",
                            "ratingBucket": "IG",
                            "price": 118.306421,
                            "spread": 117.0
                        }
                    },
                    "deltaMetrics": {
                        "Dod": {
                            "yieldWorst": 0.0,
                            "ratingDouble": 0.0,
                            "price": 0.141754,
                            "spread": 0.0
                        },
                        "Wow": {
                            "yieldWorst": 0.004912,
                            "ratingDouble": 0.0,
                            "price": 0.067035,
                            "spread": -2.0
                        },
                        "Mtd": {
                            "yieldWorst": -0.075326,
                            "ratingDouble": 0.0,
                            "price": 0.598157,
                            "spread": -14.0
                        },
                        "Mom": {
                            "yieldWorst": -0.013877,
                            "ratingDouble": 0.0,
                            "price": 0.064373,
                            "spread": -10.0
                        },
                        "Ytd": {
                            "yieldWorst": -1.247046,
                            "ratingDouble": 0.0,
                            "price": 8.737846,
                            "spread": -11.0
                        },
                        "Yoy": {
                            "yieldWorst": -1.135634,
                            "ratingDouble": 0.0,
                            "price": 7.736116,
                            "spread": -24.0
                        }
                    },
                    "ccy": "CAD",
                    "obligorId": 2252,
                    "obligorName": "ALTAGAS CANADA INC",
                    "country": "Canada",
                    "sector": "Utilities",
                    "industry": "Gas",
                    "subIndustry": "Gas-Distribution",
                    "bicsCode": "20101110",
                    "bicsLevel1": "Utilities",
                    "bicsLevel2": "Utilities",
                    "bicsLevel3": "Gas & Water Utilities",
                    "bicsLevel4": "Gas Utilities",
                    "name": "ACICN 4.26 12/05/2028 Callable CAD MTN SENIOR_UNSECURED",
                    "genericSeniority": "SR",
                    "globalIdentifier": "CA02091ZAA62",
                    "paymentRank": "SR UNSECURED",
                    "securitySubType": "Bond",
                    "ticker": "ACICN",
                    "unitPosition": {
                        "securityIdentifier": "25064",
                        "partitionOptionValues": {
                            "PortfolioShortName": [
                                "STIP",
                                "CIP",
                                "BBB"
                            ],
                            "StrategyName": [
                                "LTOV - Spread"
                            ]
                        },
                        "strategyAsOfDate": "2020-11-24T00:00:00",
                        "mark": {
                            "driver": "Spread",
                            "enteredTime": "2020-11-25T00:00:00-05:00",
                            "user": null,
                            "value": 117.0,
                            "spread": 117.0,
                            "price": 118.306421
                        },
                        "hedgeFactor": 1.0,
                        "strategies": [
                            "LTOV - Spread"
                        ],
                        "owners": [
                            "IL",
                            "PD"
                        ],
                        "primaryPmName": "IL",
                        "backupPmName": "IL",
                        "researchName": "PD"
                    },
                    "securityType": "Bond",
                    "maturityType": "Callable"
                },
                "rank": 1,
                "name": "ACICN 4.26 12/05/2028 Callable CAD MTN SENIOR_UNSECURED",
                "isSecurityHistoricalSummary": true,
                "isGroupHistoricalSummary": false
            }
        ],
        "Bottom": []
    }
}
