import { PortfolioStructureDTO } from 'FEModels/frontend-models.interface';

export enum PortfolioView {
  positive = 'Positive',
  negative = 'Negative', 
  neutral = 'Neutral'
}

export enum PortfolioBreakdownGroupOptions {
  currency = 'Currency',
  tenor = 'Tenor',
  rating = 'Rating',
  bics = 'BICS'
}

export enum PortfolioShortNames {
  DOF = 'DOF',
  SOF = 'SOF',
  STIP = 'STIP',
  FIP = 'FIP',
  CIP = 'CIP',
  AGB = 'AGB',
  BBB = 'BBB'
}

export enum PortfolioMetricValues {
  cs01 = 'CS01',
  creditLeverage = 'Credit Leverage'
}
