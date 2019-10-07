import { SecurityDefinitionStub } from 'App/models/frontend/frontend-stub-models.interface';


const FilterOptionsBoolean = [
  'True',
  'False'
];

const FilterOptionsBailInStatus = [
  'Bail In',
  'Not Bail In'
];

const FilterOptionsCurrency = [
  'CAD',
  'USD',
  'EUR',
  'GBP'
];

const FilterOptionsCouponType = [
  'Float',
  'None',
  'Fixed for Life',
  'Fixed-to-Float'
];

const FilterOptionsRating = [
  'AAA',
  'AA+',
  'AA',
  'AA-',
  'A+',
  'A',
  'A-',
  'BBB+',
  'BBB',
  'BBB-',
  'BB+',
  'BB',
  'BB-',
  'B+',
  'B',
  'B-',
  'CCC+',
  'CCC',
  'CCC-',
  'CC+',
  'CC',
  'CC-',
  'C',
  'D',
  'NR'
];

const FilterOptionsRatingBucket = [
  'Xover',
  'IG',
  'HY',
  'NR'
];

const FilterOptionsTenor = [
  '0.25Y',
  '0.5Y',
  '0.75Y',
  '1Y',
  '2Y',
  '3Y',
  '4Y',
  '5Y',
  '6Y',
  '7Y',
  '8Y',
  '9Y',
  '10Y',
  '15Y',
  '20Y',
  '25Y',
  '30Y',
  '40Y',
  '50Y'
];

const FilterOptionsSecurityType = [
  'Bond',
  'CDS'
];

const FilterOptionsTempPlaceholder = [
  'Option 1',
  'Option 2',
  'Option 3'
]

export const SecurityGroupDefinitionMap: Array<SecurityDefinitionStub> = [
  {
    key: 'Security_TYPE',
    displayName: 'Security Type',
    icon: 'fal fa-shapes',
    optionList: FilterOptionsSecurityType
  },{
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fal fa-star',
    optionList: FilterOptionsRating
  },{
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fal fa-dollar-sign',
    optionList: FilterOptionsCurrency
  },{
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor
  },{
    key: 'BAIL_IN_STATUS',
    displayName: 'Bail-in Status',
    icon: 'fas fa-shield-alt',
    optionList: FilterOptionsBailInStatus
  },{
    key: 'COUPON_TYPE',
    displayName: 'Coupon Type',
    icon: 'fas fa-ticket-alt',
    optionList: FilterOptionsCouponType
  },{
    key: 'INDUSTRY',
    displayName: 'Industry',
    icon: 'fal fa-city',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'ISSUER',
    displayName: 'Issuer',
    icon: 'fas fa-user-tie',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'RATING_BUCKET',
    displayName: 'Rating Bucket',
    icon: 'fas fa-trash',
    optionList: FilterOptionsRatingBucket,
    isStacked: true,
    stackedIcon: 'fal fa-star'
  },{
    key: 'SECTOR',
    displayName: 'Sector',
    icon: 'fal fa-chart-pie',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'SENORITY',
    displayName: 'Senority',
    icon: 'fal fa-gavel',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'SUB_INDUSTRY',
    displayName: 'Sub-Industry',
    icon: 'fal fa-building',
    optionList: FilterOptionsTempPlaceholder
  }
];