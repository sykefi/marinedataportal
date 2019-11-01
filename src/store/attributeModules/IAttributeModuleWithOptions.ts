import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeModule } from './IAttributeModule';

export interface IAttributeModuleWithOptions extends IAttributeModule {
  availableOptions: any[];
  selectedIds: number[];
  toggleSelectedOption(id: number): void;
  selectAll(): void;
  deSelectAll(): void;
  getOptions(): void;
}
