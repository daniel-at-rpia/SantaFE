import { SecurityGroupPieChartColorSchemeBlock } from 'FEModels/frontend-blocks.interface';

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
    label: '1st Lien Secured | 1st lien | 2nd lien',
    value: '#16c1ff'
  },{
    label: 'Secured | Sr Unsecured',
    value: '#adf7b6'
  },{
    label: 'Sr Subordinated | Subordinated | Jr Subordinated | Sr Preferred | Preferred | Sr Non Preferred',
    value: '#f7ff16'
  },{
    label: 'Unsecured',
    value: '#ff167b'
  },{
    label: 'Unmapped',
    value: '#ffffff'
  }]
};