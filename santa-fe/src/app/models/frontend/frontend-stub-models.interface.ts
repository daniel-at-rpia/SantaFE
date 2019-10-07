export interface SecurityDefinitionStub {
  key: string;
  displayName: string;
  icon: string;
  optionList: Array<string>,
  isStacked?: boolean;
  secondaryIcon?: string;
  locked?: boolean;
}