export interface SearchShortcutStub {
  displayTitle: string;
  includedDefinitions: Array<SearchShortcutIncludedDefinitionStub>
}

interface SearchShortcutIncludedDefinitionStub {
  definitionKey: string;
  groupByActive: boolean;
  selectedOptions: Array<string>;
}

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

export interface SecurityDefinitionBundleStub {
  label: string;
  list: Array<SecurityDefinitionStub>;
}

export interface SecurityMetricOptionStub {
  label: string;
  backendDtoAttrName: string;
  deltaOptions: Array<string>
}

export interface SecurityTableQuoteMetric {
  isDoubleWidthColumn: boolean;
  isTripleWidthColumn: boolean;
  labelList: Array<string>;
  textOnly: boolean;
}

export interface SecurityTableMetricStub {
  label: string;
  attrName: string;
  underlineAttrName: string;
  readyStage: number;
  isFrontEndMetric?: boolean;
  isForQuantComparer?: boolean;
  pureText?: boolean;
}