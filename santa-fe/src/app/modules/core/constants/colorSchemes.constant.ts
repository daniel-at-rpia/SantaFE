import { SecurityGroupPieChartColorSchemeBlock } from 'FEModels/frontend-blocks.interface';
import { ObligorChartCategoryColorSchemeStub } from 'FEModels/frontend-stub-models.interface';

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

export const ObligorChartCategoryColorScheme: ObligorChartCategoryColorSchemeStub = {
  categoryScheme: [{
    label: 'SR Fixed Bond', // Blue
    value: '#2980B9'
  },{
    label: 'SR Float Bond', // Blue
    value: '#16A085'
  },{
    label: 'SUB Float Bond', // Blue
    value: '#C15260'
  },{
    label: 'SUB Fixed Bond',
    value: '#F39C12' // Green
  },{
    label: 'SUB Fixed Cds',
    value: '#DC7633' // Green
  },{
    label: 'SUB Fixed Cds',
    value: '#DC7633'
  },{
    label: 'SR Fixed Cds',
    value: '#ED6FB7'
  },{
    label: 'SECURED Fixed Bond', // Red
    value: '#CB4335'
  },{
    label: 'SECURED Float Bond', // Red
    value: '#FF782D'
  },{
    label: 'SLA Float Bond', // Brown
    value: '#BE8B69'
  },{
    label: 'SLA Float Bond', // Brown
    value: '#886CE4'
  },{
    label: 'SLA Fixed Bond', // Brown
    value: '#FF1D47'
  }]
};