import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { TerritoryDtoPagedResultDto } from '../models/northwind-qb/territory-dto-paged-result-dto';
import { QueryBuilderResult } from '../models/northwind-qb/query-builder-result';
import { ProductDto } from '../models/northwind-qb/product-dto';
import { EmployeeDto } from '../models/northwind-qb/employee-dto';
import { ErrorHandlerService } from './error-handler.service';

const API_ENDPOINT = 'https://data-northwind.indigo.design';

@Injectable({
  providedIn: 'root'
})
export class NorthwindQBService {
  constructor(
    private http: HttpClient
  ) { }

  public postQueryBuilderResult(body: string): Observable<QueryBuilderResult | undefined> {
        return this.http.post<QueryBuilderResult | undefined>(`${API_ENDPOINT}/QueryBuilder/ExecuteQuery`, body)
      .pipe(catchError(ErrorHandlerService.handleError<QueryBuilderResult | undefined>('postQueryBuilderResult', undefined)));
  }

  public getEmployeeDtoList(): Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(`${API_ENDPOINT}/Employees`)
      .pipe(catchError(ErrorHandlerService.handleError<EmployeeDto[]>('getEmployeeDtoList', [])));
  }

  public getProductDtoList(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${API_ENDPOINT}/Products`)
      .pipe(catchError(ErrorHandlerService.handleError<ProductDto[]>('getProductDtoList', [])));
  }

  public getTerritoryDtoPagedResultDto(pageIndex: number, size: number, orderBy: string): Observable<TerritoryDtoPagedResultDto | undefined> {
    const params = new HttpParams()
      .append('pageIndex', pageIndex)
      .append('size', size)
      .append('orderBy', orderBy);
    const options = {
      params,
    };
    return this.http.get<TerritoryDtoPagedResultDto | undefined>(`${API_ENDPOINT}/Territories/GetPagedTerritoriesWithPage`, options)
      .pipe(catchError(ErrorHandlerService.handleError<TerritoryDtoPagedResultDto | undefined>('getTerritoryDtoPagedResultDto', undefined)));
  }
}
