import { BESecurityGroupDTO } from 'BEModels/backend-models.interface';

export const SecurityGroupList: Array<BESecurityGroupDTO> = [{
  "groupIdentifier":{
    "source":"Default",
    "date":"2020-01-17T00:00:00-05:00",
    "groupOptionValues":{
      "SecurityType":[
        "Bond"
      ],
      "Ccy":[
        "USD"
      ],
      "CouponType":[
        "Fixed"
      ],
      "Seniority":[
        "SR"
      ],
      "Sector":[
        "Health Care"
      ],
      "Tenor":[
        "2Y"
      ]
    },
    "filters":{

    },
    "singleSecurityTenorOptions":[
      "2Y",
      "3Y",
      "5Y",
      "7Y",
      "10Y",
      "30Y"
    ],
    "weightField":"AmtOutstanding"
  },
  "source":"Default",
  "date":"2020-01-17T00:00:00-05:00",
  "metricsType":"SantaServer.DataModels.SantaMetrics.IndividualSecurityMetrics, SantaServer, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
  "ccy":"USD",
  "securityType":"Bond",
  "couponType":"Fixed",
  "metrics":{
    "tenor":"2Y",
    "backendTenor":"2Y",
    "propertyToNumSecurities":{
      "WorkoutTerm":207,
      "RatingDouble":203,
      "Price":207,
      "BackendWorkoutTerm":103,
      "OasSpread":207,
      "ZSpread":207,
      "AswUsd":207,
      "GSpread":207,
      "YieldWorst":207,
      "AmtOutstanding":207,
      "MarketValue":207
    },
    "backendWorkoutTerm":2.0730929455699374,
    "oasSpread":59.66574777565352,
    "zSpread":54.86195282054058,
    "aswUsd":57.11104619689038,
    "gSpread":65.62437970041758,
    "yieldWorst":2.214601163513427,
    "amtOutstanding":775489251.4970059,
    "marketValue":783682626.5272727,
    "workoutTerm":1.4503409091187636,
    "ratingDouble":15.414933832095189,
    "isRated":true,
    "rating":"BBB",
    "ratingNoNotch":"BBB",
    "ratingBucket":"NR",
    "price":101.86649188186675
  },
  "deltaMetrics":{
    "Dod":{
      "tenor":null,
      "backendTenor":null,
      "propertyToNumSecurities":{
        "WorkoutTerm":207,
        "RatingDouble":203,
        "Price":207,
        "BackendWorkoutTerm":102,
        "OasSpread":207,
        "ZSpread":207,
        "AswUsd":207,
        "GSpread":207,
        "YieldWorst":207,
        "AmtOutstanding":207,
        "MarketValue":207
      },
      "oasSpread":-1.3622443039714183,
      "zSpread":-1.826268710948553,
      "aswUsd":-1.7868559192909523,
      "gSpread":-1.0382255164895382,
      "yieldWorst":-0.011365551351670774,
      "ratingDouble":0.0,
      "price":0.013533995161676932
    },
    "Wow":{
      "tenor":null,
      "backendTenor":null,
      "propertyToNumSecurities":{
        "WorkoutTerm":207,
        "RatingDouble":203,
        "Price":207,
        "BackendWorkoutTerm":102,
        "OasSpread":207,
        "ZSpread":205,
        "AswUsd":207,
        "GSpread":207,
        "YieldWorst":207,
        "AmtOutstanding":207,
        "MarketValue":207
      },
      "oasSpread":-3.7929924853791332,
      "zSpread":-5.894094764407481,
      "aswUsd":-6.686852492241996,
      "gSpread":-5.506218149563294,
      "yieldWorst":-0.053623254136326716,
      "ratingDouble":0.0,
      "price":0.030032200291515827
    },
    "Mtd":{
      "tenor":null,
      "backendTenor":null,
      "propertyToNumSecurities":{
        "WorkoutTerm":206,
        "RatingDouble":202,
        "Price":206,
        "BackendWorkoutTerm":99,
        "OasSpread":206,
        "ZSpread":206,
        "AswUsd":206,
        "GSpread":206,
        "YieldWorst":206,
        "AmtOutstanding":206,
        "MarketValue":206
      },
      "oasSpread":-3.6457874767570093,
      "zSpread":-3.5149401280041963,
      "aswUsd":-4.2840082175567495,
      "gSpread":-5.1529051179667915,
      "yieldWorst":-0.06822435863174722,
      "ratingDouble":0.0,
      "price":0.021789402833683483
    },
    "Mom":{
      "tenor":null,
      "backendTenor":null,
      "propertyToNumSecurities":{
        "WorkoutTerm":206,
        "RatingDouble":202,
        "Price":206,
        "BackendWorkoutTerm":99,
        "OasSpread":206,
        "ZSpread":206,
        "AswUsd":206,
        "GSpread":206,
        "YieldWorst":206,
        "AmtOutstanding":206,
        "MarketValue":206
      },
      "oasSpread":-5.758646805663525,
      "zSpread":-9.023871934877194,
      "aswUsd":-8.40814507950099,
      "gSpread":-9.307758918786652,
      "yieldWorst":-0.12883924530751864,
      "ratingDouble":0.0,
      "price":0.0765887836133031
    },
    "Ytd":{
      "tenor":null,
      "backendTenor":null,
      "propertyToNumSecurities":{
        "WorkoutTerm":206,
        "RatingDouble":202,
        "Price":206,
        "BackendWorkoutTerm":99,
        "OasSpread":206,
        "ZSpread":206,
        "AswUsd":206,
        "GSpread":206,
        "YieldWorst":206,
        "AmtOutstanding":206,
        "MarketValue":206
      },
      "oasSpread":-3.6457874767570093,
      "zSpread":-3.5149401280041963,
      "aswUsd":-4.2840082175567495,
      "gSpread":-5.1529051179667915,
      "yieldWorst":-0.06822435863174722,
      "ratingDouble":0.0,
      "price":0.021789402833683483
    },
    "Yoy":{
      "tenor":null,
      "backendTenor":null,
      "propertyToNumSecurities":{
        "WorkoutTerm":187,
        "RatingDouble":11,
        "Price":187,
        "BackendWorkoutTerm":38,
        "OasSpread":187,
        "ZSpread":187,
        "AswUsd":187,
        "GSpread":187,
        "YieldWorst":187,
        "AmtOutstanding":187,
        "MarketValue":187
      },
      "oasSpread":-52.09367474471591,
      "zSpread":-54.45798790489676,
      "aswUsd":-50.728692030035624,
      "gSpread":-53.01055982671081,
      "yieldWorst":-1.5384880162366719,
      "ratingDouble":0.5031503341543825,
      "price":2.6726260849617436
    }
  },
  "numSecurities":207,
  "name":"Bond|USD|2Y|Fixed|Health Car|SR",
  "type":"SingleSecurityGroup"
}
];
