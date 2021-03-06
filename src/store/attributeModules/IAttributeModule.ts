import { CommonParameters } from '@/queries/commonParameters';
import { SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';

export interface IAttributeModule {
  name: string;
  loading: boolean;
  isSelected: boolean;
  hasOptionsSelected: boolean; // This is always true if there are no options in the attribute module
  data: IResponseFormat[] | null;
  previewData: any[];
  rowCount: number;
  siteTypes: SiteTypes[];
  toggleSelected(): void;
  getData(params: CommonParameters): void;
  getAvailableVeslaSiteIds(params: CommonParameters): Promise<number[]>;
}
