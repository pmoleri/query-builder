import { TerritoryDto } from './territory-dto';

export interface TerritoryDtoPagedResultDto {
  items: TerritoryDto[];
  totalRecordsCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}
