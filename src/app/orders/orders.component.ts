import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGX_DIALOG_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxButtonDirective, IgxRippleDirective } from 'igniteui-angular';
import { Subject, take, takeUntil } from 'rxjs';
import { QueryBuilderResult } from '../models/northwind-qb/query-builder-result';
import { ProductDto } from '../models/northwind-qb/product-dto';
import { EmployeeDto } from '../models/northwind-qb/employee-dto';
import { NorthwindQBService } from '../services/northwind-qb.service';

@Component({
  selector: 'app-orders',
  imports: [IGX_DIALOG_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxButtonDirective, IgxRippleDirective],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  private _ordersQueryExpression: string = '{"filteringOperands":[{"fieldName":"employeeId","condition":{"name":"equals","isUnary":false,"iconName":"filter_equal"},"conditionName":"equals","searchVal":{"id":"employeeId","name":"employeeId","type":"bound","value":"employeeId","valueType":"number","propertyType":"Meta","context":{"type":4,"targetId":"f29bf2b0-303f-45c7-8228-d1b5238f079d"}},"searchTree":null,"ignoreCase":true},{"fieldName":"orderId","condition":{"name":"inQuery","isUnary":false,"isNestedQuery":true,"iconName":"in"},"conditionName":"inQuery","searchVal":null,"searchTree":{"filteringOperands":[{"fieldName":"productId","condition":{"name":"equals","isUnary":false,"iconName":"filter_equal"},"conditionName":"equals","searchVal":{"id":"productId","name":"productId","type":"bound","value":"productId","valueType":"number","propertyType":"Meta","context":{"type":4,"targetId":"ffd18576-91fa-40b6-85d5-f876ea08e70a"}},"searchTree":null,"ignoreCase":true}],"operator":0,"entity":"orderDetails","returnFields":["orderId"]},"ignoreCase":true}],"operator":0,"entity":"orders","returnFields":["orderId","customerId","employeeId","shipperId","orderDate","requiredDate","freight","shipName","completed"]}';
  public get ordersQueryExpression(): string {
    return this._ordersQueryExpression;
  }
  public set ordersQueryExpression(value: string) {
    this._ordersQueryExpression = value;
    this.ordersQuery$.next();
  }
  public ordersQuery: QueryBuilderResult[] = [];
  public ordersQuery$: Subject<void> = new Subject<void>();

  public selectedEmployee?: EmployeeDto;
  public selectedProduct?: ProductDto;
  public northwindQBEmployeeDto: EmployeeDto[] = [];
  public northwindQBProductDto: ProductDto[] = [];

  constructor(
    private northwindQBService: NorthwindQBService,
  ) {}


  ngOnInit() {
    this.northwindQBService.postQueryBuilderResult().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.ordersQuery = data
    );
    this.ordersQuery$.pipe(takeUntil(this.destroy$)).subscribe(
      () => { this.northwindQBService.postQueryBuilderResult().pipe(take(1)).subscribe(
        data => this.ordersQuery = data
    )});
    this.northwindQBService.getEmployeeDtoList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindQBEmployeeDto = data
    );
    this.northwindQBService.getProductDtoList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindQBProductDto = data
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.ordersQuery$.complete();
  }
}
