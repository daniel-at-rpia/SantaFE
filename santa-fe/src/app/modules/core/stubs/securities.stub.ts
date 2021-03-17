import { BEFetchAllTradeDataReturn } from 'BEModels/backend-models.interface';
import { BESecurityDTO } from 'BEModels/backend-models.interface';

export const PortfolioList: BEFetchAllTradeDataReturn = {
    "groupIdentifier": {
        "source": "Default",
        "date": "2021-03-17T00:00:00-04:00",
        "groupOptionValues": {},
        "groupFilters": {
            "SecurityIdentifier": [
                "17163",
                "338|5Y"
            ]
        }
    },
    "securityDtos": {
        "17163": {
            "securityIdentifier": "17163",
            "security": {
                "securityIdentifier": "17163",
                "name": "SVC 5 08/15/2022 USD SENIOR_UNSECURED",
                "securityType": "Bond",
                "securitySubType": "Corp",
                "ccy": "USD",
                "obligorId": 6149,
                "obligorName": "SERVICE PROPERTIES TRUST",
                "country": "United States America",
                "sector": "Real Estate",
                "industry": "REITS",
                "subIndustry": "REITS-Hotels",
                "bicsCode": "15101112",
                "bicsLevel1": "Real Estate",
                "bicsLevel2": "Real Estate",
                "bicsLevel3": "REIT",
                "bicsLevel4": "Hotel REIT",
                "genericSeniority": "SR",
                "globalIdentifier": "US44106MAQ50",
                "paymentRank": "SR UNSECURED",
                "ticker": "SVC",
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
                        "yieldWorst": 3.86511,
                        "tenor": null,
                        "amtOutstanding": 500000000.0,
                        "marketValue": 507237220.0,
                        "workoutTerm": null,
                        "ratingDouble": null,
                        "isRated": true,
                        "rating": null,
                        "ratingNoNotch": null,
                        "ratingBucket": "NR",
                        "price": 101.003,
                        "spread": 359.074
                    },
                    "Default": {
                        "isFixedForLife": true,
                        "isFixedToFloatInFixed": false,
                        "isFloat": false,
                        "isNewIssue": false,
                        "benchmarkSecurityIdentifier": null,
                        "benchmarkName": null,
                        "underlyingSecurityId": -1,
                        "yieldWorst": 3.86511,
                        "tenor": null,
                        "amtOutstanding": 500000000.0,
                        "marketValue": 507237220.0,
                        "workoutTerm": null,
                        "ratingDouble": null,
                        "isRated": true,
                        "rating": null,
                        "ratingNoNotch": null,
                        "ratingBucket": "NR",
                        "price": 101.003,
                        "spread": 359.074
                    }
                },
                "deltaMetrics": {
                    "Dod": {
                        "yieldWorst": 0.32261,
                        "ratingDouble": null,
                        "price": -0.288667,
                        "spread": 19.801
                    },
                    "TMinusTwo": {
                        "yieldWorst": 0.39686,
                        "ratingDouble": null,
                        "price": -0.356375,
                        "spread": 27.4535
                    },
                    "Wow": {
                        "yieldWorst": 0.412777,
                        "ratingDouble": null,
                        "price": -0.392833,
                        "spread": 29.3865
                    },
                    "Mom": {
                        "yieldWorst": 1.04216,
                        "ratingDouble": null,
                        "price": -1.111,
                        "spread": 89.024
                    },
                    "Ytd": {
                        "yieldWorst": 0.66956,
                        "ratingDouble": null,
                        "price": -0.967,
                        "spread": 55.019
                    }
                },
                "unitPosition": null
            },
            "bestQuotes": null,
            "positions": null,
            "lastTracePrice": null,
            "lastTraceSpread": null,
            "lastTraceVolumeEstimated": null,
            "lastTraceVolumeReported": null
        },
        "338|5Y": {
            "securityIdentifier": "338|5Y",
            "security": {
                "curveSubType": "XR14",
                "securityIdentifier": "338|5Y",
                "name": "BLL CDS USD SR 5Y",
                "securityType": "CDS",
                "securitySubType": "CDS",
                "ccy": "USD",
                "obligorId": 120,
                "obligorName": "BALL CORP",
                "country": "United States America",
                "sector": "Basic Materials",
                "industry": "Packaging&Containers",
                "subIndustry": "Containers-Metal/Glass",
                "bicsCode": "18101210",
                "bicsLevel1": "Materials",
                "bicsLevel2": "Materials",
                "bicsLevel3": "Containers & Packaging",
                "bicsLevel4": "Containers & Packaging",
                "genericSeniority": "SR",
                "globalIdentifier": "BLL CDS USD SR 5Y",
                "paymentRank": "SR UNSECURED",
                "ticker": "BLL",
                "maturityType": null,
                "metrics": {
                    "Default": null
                },
                "deltaMetrics": {
                    "Dod": null,
                    "TMinusTwo": null,
                    "Wow": null,
                    "Mom": null,
                    "Ytd": null
                },
                "unitPosition": null
            },
            "bestQuotes": null,
            "positions": null,
            "lastTracePrice": null,
            "lastTraceSpread": null,
            "lastTraceVolumeEstimated": null,
            "lastTraceVolumeReported": null
        }
    },
    "totalNumberOfSecurities": 2
}

export const CompactSecuritySample: BESecurityDTO = PortfolioList.securityDtos['17163'].security;

export const SeniorityLegendList: Array<BESecurityDTO> = [
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"Secured",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"Sr Preferred",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"SLA",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SLA",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"Subordinated",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  }
];

export const RatingLegendList: Array<BESecurityDTO> = [
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"AAA",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"A",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name": "",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SR UNSECURED",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"SLA",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"BB",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"CCC",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  },
  {
    "securityIdentifier":"79",
    "bicsCode": "10",
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
        "ratingNoNotch":"NR",
        "ratingBucket":"IG",
        "price":null,
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
      "TMinusTwo":{
        "yieldWorst":null,
        "ratingDouble":0,
        "price":null,
        "spread":null
      }
    },
    "ccy":"CAD",
    "country":"CA",
    "industry":"Telecommunications",
    "name":"",
    "genericSeniority":"",
    "globalIdentifier":"CA87971MAX17",
    "obligorName":"TELUS CORP",
    "obligorId":756,
    "paymentRank":"Subordinated",
    "sector":"Communications",
    "securitySubType":"Bond",
    "subIndustry":"Telecom Services",
    "ticker":"TCN",
    "unitPosition":null,
    "securityType":"Bond",
    "maturityType":"Callable",
    "bicsLevel1": null,
    "bicsLevel2": null,
    "bicsLevel3": null,
    "bicsLevel4": null
  }
]