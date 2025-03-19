import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NorthwindQBService } from './northwind-qb.service';

describe('NorthwindQBService', () => {
  let service: NorthwindQBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(NorthwindQBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
