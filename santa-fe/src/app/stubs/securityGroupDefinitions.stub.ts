export const SecurityGroupDefinitionMap: Array<SecurityDefinitionStub> = [
  {
    name: 'Rating',
    icon: 'fal fa-star'
  },{
    name: 'Currency',
    icon: 'fal fa-dollar-sign'
  },{
    name: 'Tenor',
    icon: 'fal fa-history'
  },{
    name: 'Bail-in Status',
    icon: 'fas fa-shield-alt'
  },{
    name: 'Coupon Type',
    icon: 'fas fa-ticket-alt'
  },{
    name: 'Industry',
    icon: 'fal fa-city'
  },{
    name: 'Issuer',
    icon: 'fas fa-user-tie'
  },{
    name: 'Rating Bucket',
    icon: 'fas fa-trash',
    isStacked: true,
    stackedIcon: 'fal fa-star'
  },{
    name: 'Sector',
    icon: 'fal fa-chart-pie'
  },{
    name: 'Senority',
    icon: 'fal fa-gavel'
  },{
    name: 'Sub-Industry',
    icon: 'fal fa-building'
  },{
    name: 'Bond Type',
    icon: 'fal fa-shapes'
  }
];

export interface SecurityDefinitionStub {
  name: string;
  icon: string;
  isStacked?: boolean;
  stackedIcon?: string;
}