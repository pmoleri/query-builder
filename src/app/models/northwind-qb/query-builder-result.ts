import { TerritoryDto } from './territory-dto';
import { AddressDto } from './address-dto';
import { SupplierDto } from './supplier-dto';
import { OrderDetailDto } from './order-detail-dto';
import { RegionDto } from './region-dto';
import { CategoryDto } from './category-dto';
import { ProductDto } from './product-dto';
import { CustomerDto } from './customer-dto';
import { OrderDto } from './order-dto';
import { ShipperDto } from './shipper-dto';
import { EmployeeDto } from './employee-dto';

export interface QueryBuilderResult {
  addresses: AddressDto[];
  categories: CategoryDto[];
  products: ProductDto[];
  regions: RegionDto[];
  territories: TerritoryDto[];
  employees: EmployeeDto[];
  customers: CustomerDto[];
  orders: OrderDto[];
  orderDetails: OrderDetailDto[];
  shippers: ShipperDto[];
  suppliers: SupplierDto[];
}
