export interface SecurityDefinitionStub {
  key: string;
  displayName: string;
  icon: string;
  optionList: Array<string>,
  secondaryIcon?: string;
  locked?: boolean;
}