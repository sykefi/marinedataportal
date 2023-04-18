import { IResponseFormat } from '@/queries/IResponseFormat';
import { CommonParameters } from '@/queries/commonParameters';
import { SiteTypes } from '@/queries/site';
import 'pinia';

declare module 'pinia' {
  export interface IAttributeStoreProperties {
    name: string;
    previewData: any[];
    loading: boolean;
    isSelected: boolean;
    hasOptionsSelected: boolean; // This is always true if there are no options in the attribute module
    data: IResponseFormat[] | null;
    siteTypes: SiteTypes[];
    rowCount: number;
    selectedIds?: number[];
    availableOptions?: any[];
    toggleSelected: () => void;
    selectAll?: () => void;
    deSelectAll?: () => void;
    getOptions?: () => void;
    getAvailableVeslaSiteIds?: (params: CommonParameters) => Promise<number[]>;
    getData?: (params: CommonParameters) => Promise<void>;
    setSelectedOptions?: (ids: number[]) => void;
  }
}
