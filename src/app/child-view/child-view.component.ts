import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGX_GRID_DIRECTIVES } from 'igniteui-angular';
import { Subject, takeUntil } from 'rxjs';
import { TerritoryDtoPagedResultDto } from '../models/northwind-qb/territory-dto-paged-result-dto';
import { NorthwindQBService } from '../services/northwind-qb.service';

@Component({
  selector: 'app-child-view',
  imports: [IGX_GRID_DIRECTIVES],
  templateUrl: './child-view.component.html',
  styleUrls: ['./child-view.component.scss']
})
export class ChildViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public northwindQBTerritoryDtoPagedResultDto?: TerritoryDtoPagedResultDto;

  constructor(
    private northwindQBService: NorthwindQBService,
  ) {}


  ngOnInit() {
    this.northwindQBService.getTerritoryDtoPagedResultDto(NaN, NaN, '').pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindQBTerritoryDtoPagedResultDto = data
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
