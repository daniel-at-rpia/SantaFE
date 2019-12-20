import { SecurityGroupPieChartColorSchemeBlock,ObligorChartCategoryColorSchemeBlock } from 'FEModels/frontend-blocks.interface';

export const SecurityGroupRatingColorScheme: SecurityGroupPieChartColorSchemeBlock = {
  type: 'Rating',
  scheme: [{
    label: 'active',
    value: '#333'
  },{
    label: 'AAA',
    value: '#712f79'
  },{
    label: 'AA',
    value: '#293881'
  },{
    label: 'A',
    value: '#293881'
  },{
    label: 'BBB',
    value: '#0f8276'
  },{
    label: 'BB',
    value: '#968e7f'
  },{
    label: 'B',
    value: '#968e7f'
  },{
    label: 'CCCtoD',
    value: '#5e6c7c'
  }]
};

export const SecurityGroupSeniorityColorScheme: SecurityGroupPieChartColorSchemeBlock = {
  type: 'Seniority',
  scheme: [{
    label: 'active',
    value: '#333'
  },{
    label: '1st Lien Secured | 1st lien | 2nd lien Secured | 2nd lien',
    value: '#16c1ff'
  },{
    label: 'Secured | Asset Backed | Sr Unsecured',
    value: '#adf7b6'
  },{
    label: 'Sr Subordinated | Subordinated | Jr Subordinated',
    value: '#f7ff16'
  },{
    label: 'Sr Preferred | Preferred | Sr Non Preferred | Unsecured',
    value: '#ff167b'
  },{
    label: 'Unmapped',
    value: '#ffffff'
  }]
};

export const ObligorChartCategoryColorScheme: ObligorChartCategoryColorSchemeBlock = {
  categoryScheme: [{
    label: 'SR Fixed Bond',
    value: '#e600ac'
  },{
    label: 'SR Float Bond',
    value: '#8c1aff'
  },{
    label: 'SUB Fixed Bond',
    value: '#3333cc'
  },{
    label: 'SUB Fixed Cds',
    value: '#00cc99'
  },{
    label: 'SUB Fixed Cds',
    value: '#00cc44'
  },{
    label: 'SECURED Fixed Bond',
    value: '#bf4080'
  },{
    label: 'SECURED Float Bond',
    value: '#7575a3'
  }]
};