import { BEStructuringBreakdownSingleEntry, BEPortfolioStructuringBlock } from 'BEModels/backend-models.interface';
import {PortfolioShortNames} from 'Core/constants/structureConstants.constants';
const BreakdownSampleCurrencyCS01: Array<BEStructuringBreakdownSingleEntry> =  [
  {
    total: null,
    targetLevel: 120,
    targetPct: null,
    currentLevel: 100,
    currentPct: 8.7,
    indexPct: 20
  },{
    total: null,
    targetLevel: 360,
    targetPct: null,
    currentLevel: 550,
    currentPct: 47.8,
    indexPct: 28
  },{
    total: null,
    targetLevel: 720,
    targetPct: null,
    currentLevel: 500,
    currentPct: 43.4,
    indexPct: 52
  }
];

const BreakdownSampleBICSCS01: Array<BEStructuringBreakdownSingleEntry> =  [
  {
    total: null,
    targetLevel: 65,
    targetPct: null,
    currentLevel: 17,
    currentPct: 1.5,
    indexPct: 4
  },{
    total: null,
    targetLevel: 92,
    targetPct: null,
    currentLevel: 66,
    currentPct: 5.7,
    indexPct: 10
  },{
    total: null,
    targetLevel: 70,
    targetPct: null,
    currentLevel: 24,
    currentPct: 2,
    indexPct: 3
  },
  {
    total: null,
    targetLevel: 65,
    targetPct: null,
    currentLevel: 185,
    currentPct: 16.1,
    indexPct: 12
  },{
    total: null,
    targetLevel: 180,
    targetPct: null,
    currentLevel: 230,
    currentPct: 20,
    indexPct: 28
  },{
    total: null,
    targetLevel: 230,
    targetPct: null,
    currentLevel: 120,
    currentPct: 10.4,
    indexPct: 10
  },
  {
    total: null,
    targetLevel: 5,
    targetPct: null,
    currentLevel: 12,
    currentPct: 1,
    indexPct: 20
  },{
    total: null,
    targetLevel: 90,
    targetPct: null,
    currentLevel: 90,
    currentPct: 7.8,
    indexPct: 8
  },{
    total: null,
    targetLevel: 102,
    targetPct: null,
    currentLevel: 140,
    currentPct: 12.2,
    indexPct: 21
  },
  {
    total: null,
    targetLevel: 23,
    targetPct: null,
    currentLevel: 50,
    currentPct: 4.3,
    indexPct: 20
  },{
    total: null,
    targetLevel: 88,
    targetPct: null,
    currentLevel: 87,
    currentPct: 7.6,
    indexPct: 13
  },{
    total: null,
    targetLevel: 100,
    targetPct: null,
    currentLevel: 129,
    currentPct: 11.2,
    indexPct: 3
  }
];

const BreakdownSampleTenorCS01: Array<BEStructuringBreakdownSingleEntry> =  [
  {
    total: null,
    targetLevel: 60,
    targetPct: null,
    currentLevel: 100,
    currentPct: 8.7,
    indexPct: 20
  },{
    total: null,
    targetLevel: 180,
    targetPct: null,
    currentLevel: 150,
    currentPct: 13.0,
    indexPct: 8
  },{
    total: null,
    targetLevel: 360,
    targetPct: null,
    currentLevel: 200,
    currentPct: 17.4,
    indexPct: 12
  },
  {
    total: null,
    targetLevel: 120,
    targetPct: null,
    currentLevel: 20,
    currentPct: 8.7,
    indexPct: 1.7
  },{
    total: null,
    targetLevel: 50,
    targetPct: null,
    currentLevel: 87,
    currentPct: 7.6,
    indexPct: 12
  },{
    total: null,
    targetLevel: 300,
    targetPct: null,
    currentLevel: 500,
    currentPct: 43.4,
    indexPct: 52
  }
];

const BreakdownSampleRatingCS01: Array<BEStructuringBreakdownSingleEntry> =  [
  {
    total: null,
    targetLevel: 53,
    targetPct: null,
    currentLevel: 100,
    currentPct: 8,
    indexPct: 6
  },{
    total: null,
    targetLevel: 120,
    targetPct: null,
    currentLevel: 65,
    currentPct: 40,
    indexPct: 17
  },{
    total: null,
    targetLevel: 250,
    targetPct: null,
    currentLevel: 72,
    currentPct: 34,
    indexPct: 12
  },
  {
    total: null,
    targetLevel: 344,
    targetPct: null,
    currentLevel: 154,
    currentPct: 8,
    indexPct: 20
  },{
    total: null,
    targetLevel: 212,
    targetPct: null,
    currentLevel: 168,
    currentPct: 40,
    indexPct: 28
  },{
    total: null,
    targetLevel: 174,
    targetPct: null,
    currentLevel: 240,
    currentPct: 34,
    indexPct: 15
  },
  {
    total: null,
    targetLevel: 84,
    targetPct: null,
    currentLevel: 55,
    currentPct: 8,
    indexPct: 13
  },{
    total: null,
    targetLevel: 43,
    targetPct: null,
    currentLevel: 45,
    currentPct: 40,
    indexPct: 10
  },{
    total: null,
    targetLevel: 10,
    targetPct: null,
    currentLevel: 7,
    currentPct: 34,
    indexPct: 5
  },
  {
    total: null,
    targetLevel: 2,
    targetPct: null,
    currentLevel: 5,
    currentPct: 8,
    indexPct: 3
  },{
    total: null,
    targetLevel: 0,
    targetPct: null,
    currentLevel: 0,
    currentPct: 0,
    indexPct: 0
  }
];

export const BreakdownSampleStructureBlock: BEPortfolioStructuringBlock = {
  rpPortfolioDate: null,
  portfolioId: null,
  portfolioShortName: PortfolioShortNames.SOF,
  portfolioNav: null,
  target: {
    portfolioTargetId: null,
    date: null,
    portfolioId: null,
    target: {
      cs01: 22000,
      leverageValue: 1.8
    }
  },
  currentTotals: {
    cs01: 180000,
    leverageValue: 1.5
  },
  indexId: null,
  indexShortName: '',
  indexNav: null,
  indexTotals: {
    cs01: null,
    leverageValue: null
  },
  ccyBreakdown: {
    groupOption: 'ccy',
    breakdown: {
      'US': {
        cs01: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        },
        leverageValue: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        }
      }
    }
  },
  bicsLevel1Breakdown: {
    groupOption: 'bics',
    breakdown: {
      'finance': {
        cs01: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        },
        leverageValue: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        }
      }
    }
  },
  bicsLevel2Breakdown: {
    groupOption: 'bics',
    breakdown: {
      'Banking': {
        cs01: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        },
        leverageValue: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        }
      }
    }
  },
  bicsLevel3Breakdown: {
    groupOption: 'bics',
    breakdown: {
      'finance': {
        cs01: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        },
        leverageValue: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        }
      }
    }
  },
  ratingBreakdown: {
    groupOption: 'rating',
    breakdown: {
      'AAA': {
        cs01: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        },
        leverageValue: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        }
      }
    }
  },
  tenorBreakdown: {
    groupOption: 'tenor',
    breakdown: {
      '5Y': {
        cs01: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        },
        leverageValue: {
          total: null,
          targetLevel: null,
          targetPct: null,
          currentLevel: null,
          currentPct: null,
          indexPct: null
        }
      }
    }
  }
}