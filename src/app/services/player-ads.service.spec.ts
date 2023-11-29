import { TestBed } from '@angular/core/testing';

import { PlayerAdsService } from './player-ads.service';

describe('PlayerAdsService', () => {
  let service: PlayerAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerAdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
