import {
  SecurityTableMetricStub
} from 'FEModels/frontend-stub-models.interface';

/* Stages:
1: ready after the get-position call
2. ready after the get-securities call
3. ready after the get-best-quotes call
*/
export const SecurityTableMetrics: Array<SecurityTableMetricStub> = [
  {
    label: 'Security',
    attrName: null,
    underlineAttrName: null,
    readyStage: 1,
    pureText: true
  },
  {
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isForQuantComparer: true
  },{
    label: 'Mark',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3
  },{
    label: 'Mark Discrepancy',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isFrontEndMetric: true
  },
  {
    label: 'Position',
    attrName: 'positionInMM',
    underlineAttrName: 'position',
    readyStage: 1
  },{
    label: '30 Day Delta',
    attrName: 'spreadDelta30',
    underlineAttrName: 'spreadDelta30',
    readyStage: 2
  },{
    label: 'Quote Count (48hrs)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3
  }
]