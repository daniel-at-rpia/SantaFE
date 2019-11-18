import {
  SecurityTableQuoteMetric
} from 'FEModels/frontend-stub-models.interface';

export const QuoteMetricList: Array<SecurityTableQuoteMetric> = [
  {
    labelList: ['Source'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['Dealer'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B Px', 'A Px'],
    isDoubleWidthColumn: true,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B YTW', 'A YTW'],
    isDoubleWidthColumn: true,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B Sprd', 'A Sprd'],
    isDoubleWidthColumn: true,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B Size', 'A Size'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: true,
    textOnly: false
  },{
    labelList: ['Benchmarks'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: true,
    textOnly: true
  }
];