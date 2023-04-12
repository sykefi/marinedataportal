import { IResponseFormat } from '@/queries/IResponseFormat';
import { SiteTypes } from '@/queries/site';

export interface IAttributeStoreStateWithOptions {
  loading: boolean;
  isSelected: boolean;
  data: IResponseFormat[] | null;
  siteTypes: SiteTypes[];
  availableOptions: any[];
  selectedIds: number[];
}
