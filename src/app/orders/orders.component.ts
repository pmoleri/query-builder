import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGX_DIALOG_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxButtonDirective, IgxQueryBuilderComponent, IgxRippleDirective } from 'igniteui-angular';
import { BehaviorSubject, combineLatest, Subject, take, takeUntil } from 'rxjs';
import { QueryBuilderResult } from '../models/northwind-qb/query-builder-result';
import { ProductDto } from '../models/northwind-qb/product-dto';
import { EmployeeDto } from '../models/northwind-qb/employee-dto';
import { NorthwindQBService } from '../services/northwind-qb.service';

@Component({
  selector: 'app-orders',
  imports: [IGX_DIALOG_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxButtonDirective, IgxRippleDirective, IgxQueryBuilderComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  protected ordersQueryEntities = JSON.parse('[{"name":"addresses","fields":[{"field":"street","dataType":"string"},{"field":"city","dataType":"string"},{"field":"region","dataType":"string"},{"field":"postalCode","dataType":"string"},{"field":"country","dataType":"string"},{"field":"phone","dataType":"string"}]},{"name":"categories","fields":[{"field":"categoryId","dataType":"number"},{"field":"description","dataType":"string"},{"field":"name","dataType":"string"}]},{"name":"products","fields":[{"field":"productId","dataType":"number"},{"field":"productName","dataType":"string"},{"field":"supplierId","dataType":"number"},{"field":"categoryId","dataType":"number"},{"field":"quantityPerUnit","dataType":"string"},{"field":"unitPrice","dataType":"number"},{"field":"unitsInStock","dataType":"number"},{"field":"unitsOnOrder","dataType":"number"},{"field":"reorderLevel","dataType":"number"},{"field":"discontinued","dataType":"boolean"}]},{"name":"regions","fields":[{"field":"regionId","dataType":"number"},{"field":"regionDescription","dataType":"string"}]},{"name":"territories","fields":[{"field":"territoryId","dataType":"string"},{"field":"territoryDescription","dataType":"string"},{"field":"regionId","dataType":"number"}]},{"name":"employees","fields":[{"field":"employeeId","dataType":"number"},{"field":"lastName","dataType":"string"},{"field":"firstName","dataType":"string"},{"field":"title","dataType":"string"},{"field":"titleOfCourtesy","dataType":"string"},{"field":"birthDate","dataType":"date"},{"field":"hireDate","dataType":"date"},{"field":"addressId","dataType":"string"},{"field":"notes","dataType":"string"},{"field":"avatarUrl","dataType":"string"},{"field":"reportsTo","dataType":"number"}]},{"name":"customers","fields":[{"field":"customerId","dataType":"string"},{"field":"companyName","dataType":"string"},{"field":"contactName","dataType":"string"},{"field":"contactTitle","dataType":"string"}]},{"name":"orders","fields":[{"field":"orderId","dataType":"number"},{"field":"customerId","dataType":"string"},{"field":"employeeId","dataType":"number"},{"field":"shipperId","dataType":"number"},{"field":"orderDate","dataType":"date"},{"field":"requiredDate","dataType":"date"},{"field":"shipVia","dataType":"string"},{"field":"freight","dataType":"number"},{"field":"shipName","dataType":"string"},{"field":"completed","dataType":"boolean"}]},{"name":"orderDetails","fields":[{"field":"orderId","dataType":"number"},{"field":"productId","dataType":"number"},{"field":"unitPrice","dataType":"number"},{"field":"quantity","dataType":"number"},{"field":"discount","dataType":"number"}]},{"name":"shippers","fields":[{"field":"shipperId","dataType":"number"},{"field":"companyName","dataType":"string"},{"field":"phone","dataType":"string"}]},{"name":"suppliers","fields":[{"field":"supplierId","dataType":"number"},{"field":"companyName","dataType":"string"},{"field":"contactName","dataType":"string"},{"field":"contactTitle","dataType":"string"},{"field":"address","dataType":"string"},{"field":"city","dataType":"string"},{"field":"region","dataType":"string"},{"field":"postalCode","dataType":"string"},{"field":"country","dataType":"string"},{"field":"phone","dataType":"string"},{"field":"fax","dataType":"string"},{"field":"homePage","dataType":"string"}]}]');

  private _ordersQueryExpression: any;
  public get ordersQueryExpression(): any {
    return this._ordersQueryExpression;
  }
  public set ordersQueryExpression(value: any) {
    this._ordersQueryExpression = value;
    this.ordersQuery$.next();
  }
  public ordersQuery: QueryBuilderResult['orders'] = [];
  public ordersQuery$: Subject<void> = new Subject<void>();

  public _selectedEmployee$ = new BehaviorSubject<EmployeeDto | undefined>(undefined);
  public get selectedEmployee() {
    return this._selectedEmployee$.value;
  }
  public set selectedEmployee(value: EmployeeDto | undefined) {
    this._selectedEmployee$.next(value);
  }

  public _selectedProduct$ = new BehaviorSubject<ProductDto | undefined>(undefined);
  public get selectedProduct() {
    return this._selectedProduct$.value;
  }
  public set selectedProduct(value: ProductDto | undefined) {
    this._selectedProduct$.next(value);
  }

  public northwindQBEmployeeDto: EmployeeDto[] = [];
  public northwindQBProductDto: ProductDto[] = [];

  constructor(
    private northwindQBService: NorthwindQBService,
  ) {}

  protected getQueryExpression() {
    return {
      "filteringOperands": [
        {
          "fieldName":"employeeId",
          "condition":{"name":"equals","isUnary":false,"iconName":"filter_equal"},
          "conditionName":"equals",
          "searchVal":this.selectedEmployee?.employeeId,
          "searchTree":null,
          "ignoreCase":true
        },
        {
          "fieldName":"orderId",
          "condition":{"name":"inQuery","isUnary":false,"isNestedQuery":true,"iconName":"in"},
          "conditionName":"inQuery",
          "searchVal":null,
          "searchTree":{
            "filteringOperands":[{
              "fieldName":"productId",
              "conditionName":"equals",
              "searchVal":this.selectedProduct?.productId,
              "searchTree":null,
              "ignoreCase":true
            }],
            "operator":0,
            "entity":"orderDetails",
            "returnFields":["orderId"]
          },
          "ignoreCase":true
        }
      ],
      "operator":0,
      "entity":"orders",
      "returnFields": ["orderId","customerId","employeeId","shipperId","orderDate","requiredDate","freight","shipName","completed"]
    };
  }

  ngOnInit() {
    this.northwindQBService.postQueryBuilderResult(this.ordersQueryExpression).pipe(takeUntil(this.destroy$)).subscribe(
      data => this.ordersQuery = data?.orders ?? [],
    );
    this.ordersQuery$.pipe(takeUntil(this.destroy$)).subscribe(
      () => { this.northwindQBService.postQueryBuilderResult(this.ordersQueryExpression).pipe(take(1)).subscribe(
        data => this.ordersQuery = data?.orders ?? [],
    )});
    this.northwindQBService.getEmployeeDtoList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindQBEmployeeDto = data
    );
    this.northwindQBService.getProductDtoList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindQBProductDto = data
    );
    combineLatest([this._selectedEmployee$, this._selectedProduct$]).pipe(takeUntil(this.destroy$)).subscribe(
      () => this.ordersQueryExpression = this.getQueryExpression()
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.ordersQuery$.complete();
  }
}
