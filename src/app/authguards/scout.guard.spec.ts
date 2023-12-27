import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { scoutGuard } from './scout.guard';

describe('scoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => scoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
