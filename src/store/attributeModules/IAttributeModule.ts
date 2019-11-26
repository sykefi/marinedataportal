import { CommonParameters } from '@/queries/commonParameters';

export interface IAttributeModule {
  name: string;
  loading: boolean;
  isSelected: boolean;
  hasOptionsSelected: boolean; // This is always true if there are no options in the attribute module
  data: object[] | null;
  previewData: any[];
  rowCount: number;
  toggleSelected(): void;
  getData(params: CommonParameters): void;
  getAvailableSiteIds(params: CommonParameters): Promise<number[]>;
}
