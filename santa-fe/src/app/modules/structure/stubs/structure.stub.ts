import { BEPortfolioStructuringDTO } from 'BEModels/backend-models.interface';
import {PortfolioShortNames} from 'Core/constants/structureConstants.constants';

export const PortfolioStructuringSample: BEPortfolioStructuringDTO = {
  rpPortfolioDate: null,
  portfolioId: null,
  portfolioShortName: PortfolioShortNames.SOF,
  portfolioNav: null,
  target: {
    portfolioTargetId: null,
    date: null,
    portfolioId: null,
    target: {
      cs01: 220000,
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
      'USD': {
        cs01: {
          total: null,
          targetLevel: 120,
          targetPct: null,
          currentLevel: 100,
          currentPct: 8.7,
          indexPct: 20
        },
        leverageValue: null
      },
      'CAD': {
        cs01: {
          total: null,
          targetLevel: 360,
          targetPct: null,
          currentLevel: 550,
          currentPct: 47.8,
          indexPct: 28
        },
        leverageValue: null
      },
      'EUR': {
        cs01: {
          total: null,
          targetLevel: 720,
          targetPct: null,
          currentLevel: 500,
          currentPct: 43.4,
          indexPct: 52
        },
        leverageValue: null
      }
    }
  },
  bicsLevel1Breakdown: {
    groupOption: 'bics',
    breakdown: {
      'Communications': {
        cs01: {
          total: null,
          targetLevel: 65,
          targetPct: null,
          currentLevel: 17,
          currentPct: 1.5,
          indexPct: 4
        },
        leverageValue: null
      },
      'Consumer, Cyclical': {
        cs01: {
          total: null,
          targetLevel: 92,
          targetPct: null,
          currentLevel: 66,
          currentPct: 5.7,
          indexPct: 10
        },
        leverageValue: null
      },
      'Consumer, Noncyclical': {
        cs01: {
          total: null,
          targetLevel: 70,
          targetPct: null,
          currentLevel: 24,
          currentPct: 2,
          indexPct: 3
        },
        leverageValue: null
      },
      'Energy': {
        cs01: {
          total: null,
          targetLevel: 65,
          targetPct: null,
          currentLevel: 185,
          currentPct: 16.1,
          indexPct: 12
        },
        leverageValue: null
      },
      'Diversified': {
        cs01: {
          total: null,
          targetLevel: 180,
          targetPct: null,
          currentLevel: 230,
          currentPct: 20,
          indexPct: 28
        },
        leverageValue: null
      },
      'Financial': {
        cs01: {
          total: null,
          targetLevel: 230,
          targetPct: null,
          currentLevel: 120,
          currentPct: 10.4,
          indexPct: 10
        },
        leverageValue: null
      },
      'Industrial': {
        cs01: {
          total: null,
          targetLevel: 5,
          targetPct: null,
          currentLevel: 12,
          currentPct: 1,
          indexPct: 20
        },
        leverageValue: null
      },
      'Basic Materials': {
        cs01: {
          total: null,
          targetLevel: 90,
          targetPct: null,
          currentLevel: 90,
          currentPct: 7.8,
          indexPct: 8
        },
        leverageValue: null
      },
      'Technology': {
        cs01: {
          total: null,
          targetLevel: 102,
          targetPct: null,
          currentLevel: 140,
          currentPct: 12.2,
          indexPct: 21
        },
        leverageValue: null
      },
      'Utilities': {
        cs01: {
          total: null,
          targetLevel: 23,
          targetPct: null,
          currentLevel: 50,
          currentPct: 4.3,
          indexPct: 20
        },
        leverageValue: null
      }
    }
  },
  bicsLevel2Breakdown: null,
  bicsLevel3Breakdown: null,
  ratingBreakdown: {
    groupOption: 'rating',
    breakdown: {
      'AAA': {
        cs01: {
          total: null,
          targetLevel: 53,
          targetPct: null,
          currentLevel: 100,
          currentPct: 8,
          indexPct: 6
        },
        leverageValue: null
      },
      'AA': {
        cs01: {
          total: null,
          targetLevel: 120,
          targetPct: null,
          currentLevel: 65,
          currentPct: 40,
          indexPct: 17
        },
        leverageValue: null
      },
      'A': {
        cs01: {
          total: null,
          targetLevel: 250,
          targetPct: null,
          currentLevel: 72,
          currentPct: 34,
          indexPct: 12
        },
        leverageValue: null
      },
      'BBB': {
        cs01: {
          total: null,
          targetLevel: 344,
          targetPct: null,
          currentLevel: 154,
          currentPct: 8,
          indexPct: 20
        },
        leverageValue: null
      },
      'BB': {
        cs01: {
          total: null,
          targetLevel: 212,
          targetPct: null,
          currentLevel: 168,
          currentPct: 40,
          indexPct: 28
        },
        leverageValue: null
      },
      'B': {
        cs01: {
          total: null,
          targetLevel: 174,
          targetPct: null,
          currentLevel: 240,
          currentPct: 34,
          indexPct: 15
        },
        leverageValue: null
      },
      'CCCToD': {
        cs01: {
          total: null,
          targetLevel: 84,
          targetPct: null,
          currentLevel: 55,
          currentPct: 8,
          indexPct: 13
        },
        leverageValue: null
      },
      'NR': {
        cs01: {
          total: null,
          targetLevel: 43,
          targetPct: null,
          currentLevel: 45,
          currentPct: 40,
          indexPct: 10
        },
        leverageValue: null
      }
    }
  },
  tenorBreakdown: {
    groupOption: 'tenor',
    breakdown: {
      '2Y': {
        cs01: {
          total: null,
          targetLevel: 60,
          targetPct: null,
          currentLevel: 100,
          currentPct: 8.7,
          indexPct: 20
        },
        leverageValue: null
      },
      '3Y': {
        cs01: {
          total: null,
          targetLevel: 180,
          targetPct: null,
          currentLevel: 150,
          currentPct: 13.0,
          indexPct: 8
        },
        leverageValue: null
      },
      '5Y': {
        cs01: {
          total: null,
          targetLevel: 360,
          targetPct: null,
          currentLevel: 200,
          currentPct: 17.4,
          indexPct: 12
        },
        leverageValue: null
      },
      '7Y': {
        cs01: {
          total: null,
          targetLevel: 120,
          targetPct: null,
          currentLevel: 20,
          currentPct: 8.7,
          indexPct: 1.7
        },
        leverageValue: null
      },
      '10Y': {
        cs01: {
          total: null,
          targetLevel: 50,
          targetPct: null,
          currentLevel: 87,
          currentPct: 7.6,
          indexPct: 12
        },
        leverageValue: null
      },
      '30Y': {
        cs01: {
          total: null,
          targetLevel: 300,
          targetPct: null,
          currentLevel: 500,
          currentPct: 43.4,
          indexPct: 52
        },
        leverageValue: null
      }
    }
  }
}