import { CommonParameters } from '@/queries/commonParameters';

export interface IAttributeModule {
  name: string;
  loading: boolean;
  isSelected: boolean;
  data: object[] | null;
  previewData: any[];
  rowCount: number;
  toggleSelected(): void;
  getData(params: CommonParameters): void;

}
