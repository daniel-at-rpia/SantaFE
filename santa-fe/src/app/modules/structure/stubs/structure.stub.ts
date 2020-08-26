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
      Cs01: 220000,
      CreditLeverage: 1.8
    }
  },
  currentTotals: {
    Cs01: 180000,
    CreditLeverage: 1.5
  },
  indexId: null,
  indexShortName: '',
  indexNav: null,
  indexTotals: {
    Cs01: null,
    CreditLeverage: null
  },
  ccyBreakdown: {
    groupOption: 'ccy',
    breakdown: {
      'USD': {
        Cs01: {
          total: null,
          targetLevel: 120,
          targetPct: null,
          currentLevel: 100,
          currentPct: 8.7,
          indexPct: 20
        },
        CreditLeverage: null
      },
      'CAD': {
        Cs01: {
          total: null,
          targetLevel: 360,
          targetPct: null,
          currentLevel: 550,
          currentPct: 47.8,
          indexPct: 28
        },
        CreditLeverage: null
      },
      'EUR': {
        Cs01: {
          total: null,
          targetLevel: 720,
          targetPct: null,
          currentLevel: 500,
          currentPct: 43.4,
          indexPct: 52
        },
        CreditLeverage: null
      }
    }
  },
  bicsLevel1Breakdown: {
    groupOption: 'bics',
    breakdown: {
      'Communications': {
        Cs01: {
          total: null,
          targetLevel: 65,
          targetPct: null,
          currentLevel: 17,
          currentPct: 1.5,
          indexPct: 4
        },
        CreditLeverage: null
      },
      'Consumer, Cyclical': {
        Cs01: {
          total: null,
          targetLevel: 92,
          targetPct: null,
          currentLevel: 66,
          currentPct: 5.7,
          indexPct: 10
        },
        CreditLeverage: null
      },
      'Consumer, Noncyclical': {
        Cs01: {
          total: null,
          targetLevel: 70,
          targetPct: null,
          currentLevel: 24,
          currentPct: 2,
          indexPct: 3
        },
        CreditLeverage: null
      },
      'Energy': {
        Cs01: {
          total: null,
          targetLevel: 65,
          targetPct: null,
          currentLevel: 185,
          currentPct: 16.1,
          indexPct: 12
        },
        CreditLeverage: null
      },
      'Diversified': {
        Cs01: {
          total: null,
          targetLevel: 180,
          targetPct: null,
          currentLevel: 230,
          currentPct: 20,
          indexPct: 28
        },
        CreditLeverage: null
      },
      'Financial': {
        Cs01: {
          total: null,
          targetLevel: 230,
          targetPct: null,
          currentLevel: 120,
          currentPct: 10.4,
          indexPct: 10
        },
        CreditLeverage: null
      },
      'Industrial': {
        Cs01: {
          total: null,
          targetLevel: 5,
          targetPct: null,
          currentLevel: 12,
          currentPct: 1,
          indexPct: 20
        },
        CreditLeverage: null
      },
      'Basic Materials': {
        Cs01: {
          total: null,
          targetLevel: 90,
          targetPct: null,
          currentLevel: 90,
          currentPct: 7.8,
          indexPct: 8
        },
        CreditLeverage: null
      },
      'Technology': {
        Cs01: {
          total: null,
          targetLevel: 102,
          targetPct: null,
          currentLevel: 140,
          currentPct: 12.2,
          indexPct: 21
        },
        CreditLeverage: null
      },
      'Utilities': {
        Cs01: {
          total: null,
          targetLevel: 23,
          targetPct: null,
          currentLevel: 50,
          currentPct: 4.3,
          indexPct: 20
        },
        CreditLeverage: null
      }
    }
  },
  bicsLevel2Breakdown: null,
  bicsLevel3Breakdown: null,
  ratingBreakdown: {
    groupOption: 'rating',
    breakdown: {
      'AAA': {
        Cs01: {
          total: null,
          targetLevel: 53,
          targetPct: null,
          currentLevel: 100,
          currentPct: 8,
          indexPct: 6
        },
        CreditLeverage: null
      },
      'AA': {
        Cs01: {
          total: null,
          targetLevel: 120,
          targetPct: null,
          currentLevel: 65,
          currentPct: 40,
          indexPct: 17
        },
        CreditLeverage: null
      },
      'A': {
        Cs01: {
          total: null,
          targetLevel: 250,
          targetPct: null,
          currentLevel: 72,
          currentPct: 34,
          indexPct: 12
        },
        CreditLeverage: null
      },
      'BBB': {
        Cs01: {
          total: null,
          targetLevel: 344,
          targetPct: null,
          currentLevel: 154,
          currentPct: 8,
          indexPct: 20
        },
        CreditLeverage: null
      },
      'BB': {
        Cs01: {
          total: null,
          targetLevel: 212,
          targetPct: null,
          currentLevel: 168,
          currentPct: 40,
          indexPct: 28
        },
        CreditLeverage: null
      },
      'B': {
        Cs01: {
          total: null,
          targetLevel: 174,
          targetPct: null,
          currentLevel: 240,
          currentPct: 34,
          indexPct: 15
        },
        CreditLeverage: null
      },
      'CCCToD': {
        Cs01: {
          total: null,
          targetLevel: 84,
          targetPct: null,
          currentLevel: 55,
          currentPct: 8,
          indexPct: 13
        },
        CreditLeverage: null
      },
      'NR': {
        Cs01: {
          total: null,
          targetLevel: 43,
          targetPct: null,
          currentLevel: 45,
          currentPct: 40,
          indexPct: 10
        },
        CreditLeverage: null
      }
    }
  },
  tenorBreakdown: {
    groupOption: 'tenor',
    breakdown: {
      '2Y': {
        Cs01: {
          total: null,
          targetLevel: 60,
          targetPct: null,
          currentLevel: 100,
          currentPct: 8.7,
          indexPct: 20
        },
        CreditLeverage: null
      },
      '3Y': {
        Cs01: {
          total: null,
          targetLevel: 180,
          targetPct: null,
          currentLevel: 150,
          currentPct: 13.0,
          indexPct: 8
        },
        CreditLeverage: null
      },
      '5Y': {
        Cs01: {
          total: null,
          targetLevel: 360,
          targetPct: null,
          currentLevel: 200,
          currentPct: 17.4,
          indexPct: 12
        },
        CreditLeverage: null
      },
      '7Y': {
        Cs01: {
          total: null,
          targetLevel: 120,
          targetPct: null,
          currentLevel: 20,
          currentPct: 8.7,
          indexPct: 1.7
        },
        CreditLeverage: null
      },
      '10Y': {
        Cs01: {
          total: null,
          targetLevel: 50,
          targetPct: null,
          currentLevel: 87,
          currentPct: 7.6,
          indexPct: 12
        },
        CreditLeverage: null
      },
      '30Y': {
        Cs01: {
          total: null,
          targetLevel: 300,
          targetPct: null,
          currentLevel: 500,
          currentPct: 43.4,
          indexPct: 52
        },
        CreditLeverage: null
      }
    }
  }
}