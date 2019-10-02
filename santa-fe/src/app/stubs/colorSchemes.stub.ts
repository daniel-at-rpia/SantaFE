import { SecurityGroupPieChartColorSchemeDTO } from 'App/models/frontend/frontend-models.interface';

export const SecurityGroupRatingColorScheme: SecurityGroupPieChartColorSchemeDTO = {
  type: 'Rating',
  scheme: [{
    label: 'active',
    value: '#333'
  },{
    label: 'aaa',
    value: '#712f79'
  },{
    label: 'aa',
    value: '#293881'
  },{
    label: 'a',
    value: '#293881'
  },{
    label: 'bbb',
    value: '#0f8276'
  },{
    label: 'bb',
    value: '#968e7f'
  },{
    label: 'b',
    value: '#968e7f'
  },{
    label: 'ccctod',
    value: '#5e6c7c'
  }]
};

export const SecurityGroupSeniorityColorScheme: SecurityGroupPieChartColorSchemeDTO = {
  type: 'Seniority',
  scheme: [{
    label: 'active',
    value: '#333'
  },{
    label: '1',
    value: '#16c1ff'
  },{
    label: '2',
    value: '#adf7b6'
  },{
    label: '3',
    value: '#f7ff16'
  },{
    label: '4',
    value: '#ff167b'
  },{
    label: '5',
    value: '#ffffff'
  }]
};