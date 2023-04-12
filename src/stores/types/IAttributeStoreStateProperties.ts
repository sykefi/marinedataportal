import { IResponseFormat } from '@/queries/IResponseFormat';
import { CommonParameters } from '@/queries/commonParameters';
import { SiteTypes } from '@/queries/site';
import 'pinia';

declare module 'pinia' {
  export interface IAttributeStoreStateProperties {
    loading: boolean;
    isSelected: boolean;
    hasOptionsSelected: boolean; // This is always true if there are no options in the attribute module
    data: IResponseFormat[] | null;
    siteTypes: SiteTypes[];
    getOptions?: () => void;
    getAvailableVeslaSiteIds?: (params: CommonParameters) => Promise<number[]>;
    getData?: (params: CommonParameters) => Promise<void>;
  }
}
