import { CommonParameters } from '@/queries/commonParameters';

export enum ModuleTypes {
  Vesla,
  Fmi,
  VeslaFmi,
}

export interface IAttributeModule {
  name: string;
  loading: boolean;
  isSelected: boolean;
  hasOptionsSelected: boolean; // This is always true if there are no options in the attribute module
  data: object[] | null;
  previewData: any[];
  rowCount: number;
  type: ModuleTypes;
  toggleSelected(): void;
  getData(params: CommonParameters): void;
  getAvailableVeslaSiteIds(params: CommonParameters): Promise<number[]>;
}
