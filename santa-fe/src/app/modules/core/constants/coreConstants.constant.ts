import {
  SecurityTableMetricStub
} from 'FEModels/frontend-stub-models.interface';

export const SecurityTableMetrics: Array<SecurityTableMetricStub> = [
  {
    label: 'Security',
    attrName: null,
    underlineAttrName: null,
    readyStage: 1,
    isForQuantComparer: false,
    pureText: true
  },
  {
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isForQuantComparer: true,
    pureText: false
  },
  {
    label: 'Position',
    attrName: 'positionInMM',
    underlineAttrName: 'position',
    readyStage: 1,
    isForQuantComparer: false,
    pureText: false
  }
]