import { BESecurityGroupDTO } from 'BEModels/backend-models.interface';

export const SecurityGroupList: Array<BESecurityGroupDTO> = [
  {
    "ccy": "CAD",
    "securityType": "Bond",
    "couponType": "Fixed",
    "metrics": {
      "workoutTerm": 7.738515284685013,
      "ratingDouble": 15.622496852426893,
      "price": 106.22229910148987,
      "spread": 129.37176680365206,
      "yieldWorst": 2.4202313728168336,
      "amtOutstanding": 382980232.51789975,
      "marketValue": 412434954.3860911,
      "tenor": "7Y",
      "backendTenor": "2Y",
      "propertyToNumSecurities": {
        "WorkoutTerm": 521,
        "RatingDouble": 521,
        "Price": 521,
        "BackendWorkoutTerm": 521,
        "Spread": 521,
        "YieldWorst": 521,
        "AmtOutstanding": 521,
        "MarketValue": 521
      },
      "isRated": true,
      "rating": "BBB",
      "ratingNoNotch": "BBB",
      "ratingBucket": "NR"
    },
    "deltaMetrics": {
      "Dod": {
        "ratingDouble": 0.0,
        "price": 0.09101888087750595,
        "spread": -0.807080295410816,
        "yieldWorst": -0.0011781858455354088,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "WorkoutTerm": 521,
          "RatingDouble": 521,
          "Price": 521,
          "BackendWorkoutTerm": 521,
          "Spread": 521,
          "YieldWorst": 521,
          "AmtOutstanding": 521,
          "MarketValue": 521
        }
      },
      "TMinusTwo": {
        "ratingDouble": 0.0,
        "price": -0.12152609615010097,
        "spread": 0.6518256091167003,
        "yieldWorst": 0.031834841137017816,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "WorkoutTerm": 519,
          "RatingDouble": 519,
          "Price": 516,
          "BackendWorkoutTerm": 519,
          "Spread": 519,
          "YieldWorst": 516,
          "AmtOutstanding": 519,
          "MarketValue": 519
        }
      },
      "Wow": {
        "ratingDouble": 0.0,
        "price": -1.1774855321065643,
        "spread": 4.055744654971874,
        "yieldWorst": 0.18184777835785138,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "WorkoutTerm": 512,
          "RatingDouble": 512,
          "Price": 509,
          "BackendWorkoutTerm": 512,
          "Spread": 512,
          "YieldWorst": 509,
          "AmtOutstanding": 512,
          "MarketValue": 512
        }
      },
      "Mom": {
        "ratingDouble": 0.0,
        "price": -2.9479075701815374,
        "spread": 8.035777683190256,
        "yieldWorst": 0.3880650096584767,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "WorkoutTerm": 504,
          "RatingDouble": 504,
          "Price": 504,
          "BackendWorkoutTerm": 504,
          "Spread": 504,
          "YieldWorst": 504,
          "AmtOutstanding": 504,
          "MarketValue": 504
        }
      },
      "Ytd": {
        "ratingDouble": 0.0,
        "price": -4.578786133713484,
        "spread": -6.717123662233972,
        "yieldWorst": 0.5011505742958334,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "WorkoutTerm": 496,
          "RatingDouble": 496,
          "Price": 496,
          "BackendWorkoutTerm": 496,
          "Spread": 496,
          "YieldWorst": 496,
          "AmtOutstanding": 496,
          "MarketValue": 496
        }
      }
    },
    "isValid": true,
    "groupIdentifier": {
      "source": "Default",
      "date": "2021-03-17T00:00:00-04:00",
      "groupOptionValues": {
        "SecurityType": [
          "Bond"
        ],
        "RatingNoNotch": [
          "BBB"
        ],
        "Ccy": [
          "CAD"
        ],
        "CouponType": [
          "Fixed"
        ]
      },
      "groupFilters": {
        "CouponType": [
          "Fixed",
          "Float"
        ]
      }
    },
    "source": "Default",
    "date": "2021-03-17T00:00:00-04:00",
    "numSecurities": 521,
    "name": "Bond|CAD|Fixed|BBB|Filtering|CouponType=[Fixed,Float]",
    "type": "SingleSecurityGroup"
  },
  {
    "ccy": "USD",
    "securityType": "Bond",
    "couponType": "Fixed",
    "metrics": {
      "workoutTerm": null,
      "ratingDouble": null,
      "price": 107.06431367496057,
      "spread": 108.18116219311021,
      "yieldWorst": 2.524828085013903,
      "amtOutstanding": 714515323.7720013,
      "marketValue": 770704459.6890838,
      "tenor": null,
      "backendTenor": null,
      "propertyToNumSecurities": {
        "Price": 9807,
        "Spread": 11457,
        "YieldWorst": 9732,
        "AmtOutstanding": 11542,
        "MarketValue": 11542
      },
      "isRated": true,
      "rating": null,
      "ratingNoNotch": null,
      "ratingBucket": "NR"
    },
    "deltaMetrics": {
      "Dod": {
        "ratingDouble": null,
        "price": -0.05421870188734357,
        "spread": 1.4869404473939822,
        "yieldWorst": 0.012036351321802342,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "Price": 9805,
          "Spread": 11456,
          "YieldWorst": 9710,
          "AmtOutstanding": 11542,
          "MarketValue": 11542
        }
      },
      "TMinusTwo": {
        "ratingDouble": null,
        "price": -0.06862715537354507,
        "spread": 1.0361165969806758,
        "yieldWorst": 0.01049174843786225,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "Price": 9772,
          "Spread": 11455,
          "YieldWorst": 9681,
          "AmtOutstanding": 11542,
          "MarketValue": 11542
        }
      },
      "Wow": {
        "ratingDouble": null,
        "price": -0.4259171687609778,
        "spread": -0.8319711878545663,
        "yieldWorst": 0.047298808351921566,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "Price": 9735,
          "Spread": 11414,
          "YieldWorst": 9647,
          "AmtOutstanding": 11500,
          "MarketValue": 11500
        }
      },
      "Mom": {
        "ratingDouble": null,
        "price": -2.36253439652151,
        "spread": 4.011843344926775,
        "yieldWorst": 0.30140937151589525,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "Price": 9583,
          "Spread": 11196,
          "YieldWorst": 9511,
          "AmtOutstanding": 11275,
          "MarketValue": 11275
        }
      },
      "Ytd": {
        "ratingDouble": null,
        "price": -3.5318734582508267,
        "spread": -6.3704637071279855,
        "yieldWorst": 0.3698210124834167,
        "backendTenor": null,
        "propertyToNumSecurities": {
          "Price": 9221,
          "Spread": 10805,
          "YieldWorst": 9164,
          "AmtOutstanding": 10869,
          "MarketValue": 10869
        }
      }
    },
    "isValid": true,
    "groupIdentifier": {
      "source": "Default",
      "date": "2021-03-17T00:00:00-04:00",
      "groupOptionValues": {
        "SecurityType": [
          "Bond"
        ],
        "RatingNoNotch": [
          "NR"
        ],
        "Ccy": [
          "USD"
        ],
        "CouponType": [
          "Fixed"
        ]
      },
      "groupFilters": {
        "CouponType": [
          "Fixed",
          "Float"
        ]
      }
    },
    "source": "Default",
    "date": "2021-03-17T00:00:00-04:00",
    "numSecurities": 11571,
    "name": "Bond|USD|Fixed|NR|Filtering|CouponType=[Fixed,Float]",
    "type": "SingleSecurityGroup"
  }
];
