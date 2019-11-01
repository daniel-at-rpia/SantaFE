export interface SecurityDefinitionStub {
  key: string;
  backendDtoAttrName?: string;
  displayName: string;
  icon: string;
  optionList: Array<string>,
  secondaryIcon?: string;
  locked?: boolean;
  urlForGetLongOptionListFromServer?: string;
}

export interface SecurityMetricOptionStub {
  label: string;
  backendDtoAttrName: string;
  deltaOptions: Array<string>
}