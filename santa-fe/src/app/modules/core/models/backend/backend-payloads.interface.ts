export interface PayloadGetSantaGroups {
  source: string;
  yyyyMMdd: number;
  santaGroupDefinition: object;
  santaGroupFilters: object;
  tenorOptions: Array<string>;
}