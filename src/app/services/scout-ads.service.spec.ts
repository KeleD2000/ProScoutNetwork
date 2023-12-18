import { TestBed } from '@angular/core/testing';

import { ScoutAdsService } from './scout-ads.service';

describe('ScoutAdsService', () => {
  let service: ScoutAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoutAdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
