import { TestBed } from '@angular/core/testing';

import { DataDbService } from './data-db.service';

describe('DataDbService', () => {
  let service: DataDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
