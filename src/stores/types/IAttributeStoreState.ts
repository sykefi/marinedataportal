import { SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';

export interface IAttributeStoreState {
  loading: boolean;
  isSelected: boolean;
  hasOptionsSelected: boolean; // This is always true if there are no options in the attribute module
  data: IResponseFormat[] | null;
  siteTypes: SiteTypes[];
}
