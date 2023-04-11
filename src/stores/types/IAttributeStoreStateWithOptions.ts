import { IAttributeStoreState } from './IAttributeStoreState';

export interface IAttributeStoreStateWithOptions extends IAttributeStoreState {
  availableOptions: any[];
  selectedIds: number[];
}
