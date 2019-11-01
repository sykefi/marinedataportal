import { CommonParameters } from '@/queries/commonParameters';

export interface IAttributeModule {
  loading: boolean;
  isSelected: boolean;
  toggleSelected(): void;
  getData(params: CommonParameters): void;
}
