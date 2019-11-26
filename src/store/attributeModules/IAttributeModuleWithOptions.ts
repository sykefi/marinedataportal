import { IAttributeModule } from './IAttributeModule';

export interface IAttributeModuleWithOptions extends IAttributeModule {
  availableOptions: any[];
  selectedIds: number[];
  setSelectedOptions(ids: number[]): void;
  selectAll(): void;
  deSelectAll(): void;
  getOptions(): void;
}
