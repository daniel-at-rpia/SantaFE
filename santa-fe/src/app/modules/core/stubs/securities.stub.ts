import { BEPortfolioDTO } from 'BEModels/backend-models.interface';

const PortfolioList: Array<BEPortfolioDTO> = [{
  "date":"2019-12-23T00:00:00-05:00",
  "securityIdentifier":"129",
  "security":{
    "isGovt":false,
    "securityIdentifier":"129",
    "ccy":"CAD",
    "country":"US",
    "industry":"Wireless Telecommunications Services",
    "isBailIn":false,
    "isCallable":false,
    "isPerpetual":false,
    "issueDate":"2013-11-14T00:00:00",
    "issuer":"AT&T INC",
    "isValidForCreditGrouping":true,
    "maturityDate":"2020-11-25T00:00:00",
    "name":"ATT 3.825 11/25/2020 Bullet CAD SR UNSECURED",
    "obligorName":"AT&T INC",
    "obligorId":935,
    "paymentRank":"Sr Unsecured",
    "sector":"Communications",
    "securitySubType":"Bond",
    "seniority":"Sr Unsecured",
    "subIndustry":"Telephone-Integrated",
    "ticker":"ATT",
    "metrics":{
      "isFixedForLife":true,
      "isFixedToFloatInFixed":false,
      "isFloat":false,
      "isNewIssue":false,
      "isOnTheRun":false,
      "benchmarkId":23,
      "benchmarkName":"CAN 0.75 09/01/2020 CAD",
      "underlyingSecurityId":-1,
      "backendWorkoutTerm":0,
      "oasSpread":45.7626,
      "zSpread":0,
      "aswUsd":0,
      "gSpread":44.79,
      "yieldWorst":2.20265,
      "amtOutstanding":1000000000,
      "marketValue":1017481870,
      "workoutTerm":0.9342,
      "ratingDouble":15.6667,
      "rating":"BBB+",
      "ratingNoNotch":"BBB",
      "ratingBucket":"IG",
      "price":101.486201,
      "isRated":true
    },
    "deltaMetrics":{
      "Dod":{
        "oasSpread":-2.1018,
        "zSpread":0,
        "aswUsd":0,
        "gSpread":-2.43,
        "yieldWorst":-0.035404,
        "ratingDouble":-1,
        "price":0.028554
      },
      "Wow":{
        "oasSpread":-6.1434,
        "zSpread":0,
        "aswUsd":0,
        "gSpread":-6,
        "yieldWorst":-0.034028,
        "ratingDouble":-1,
        "price":0.001509
      },
      "Mtd":{
        "oasSpread":-9.8707,
        "zSpread":0,
        "aswUsd":0,
        "gSpread":-10.65,
        "yieldWorst":-0.042747,
        "ratingDouble":-1,
        "price":-0.050082
      },
      "Mom":{
        "oasSpread":-9.9373,
        "zSpread":0,
        "aswUsd":0,
        "gSpread":-11.88,
        "yieldWorst":-0.007065,
        "ratingDouble":-1,
        "price":-0.123774
      },
      "Ytd":{
        "oasSpread":-72.5086,
        "zSpread":0,
        "aswUsd":0,
        "gSpread":0,
        "yieldWorst":-0.825619,
        "ratingDouble":-1,
        "price":0.034055
      },
      "Yoy":{
        "oasSpread":-67.6905,
        "zSpread":0,
        "aswUsd":0,
        "gSpread":0,
        "yieldWorst":-0.836118,
        "ratingDouble":-1,
        "price":0.032559
      }
    },
    "securityType":"Bond",
    "baseType":"SingleSecurity",
    "maturityType":"Bullet"
  },
  "mark":{
    "driver":"Spread",
    "enteredTime":null,
    "user":null,
    "value":45
  },
  "portfolioShortName":"DOF",
  "isInNlf":false,
  "isInHf":true,
  "accountName":"",
  "strategyName":"Short Carry",
  "attributionOwner":"",
  "primaryPmName":"IL",
  "backupPmName":"ST",
  "researchName":"LC",
  "quantity":149479000,
  "marketValueCad":152133477.47,
  "marketValueLocal":152133477.47,
  "creditValueCad":152060112.18980998,
  "creditValueLocal":152060112.18980998,
  "bondEquivalentValueCad":152060112.18980998,
  "bondEquivalentValueLocal":152060112.18980998,
  "hedgeFactor":1,
  "dv01Cad":13901.502754215999,
  "dv01CadFactored":13901.502754215999,
  "dv01Local":13901.502754215999,
  "dv01LocalFactored":13901.502754215999,
  "cs01Cad":13901.502754215999,
  "cs01CadFactored":13901.502754215999,
  "cs01Local":13901.502754215999,
  "cs01LocalFactored":13901.502754215999,
  "cs10Cad":56504.55679,
  "cs10CadFactored":56504.55679,
  "cs10Local":56504.55679,
  "cs10LocalFactored":56504.55679
}
  
];