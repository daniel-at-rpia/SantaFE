export interface SecurityDefinitionStub {
  key: string;
  displayName: string;
  icon: string;
  optionList: Array<string>,
  isStacked?: boolean;
  stackedIcon?: string;
  locked?: boolean;
}