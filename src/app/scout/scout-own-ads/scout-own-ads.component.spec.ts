import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutOwnAdsComponent } from './scout-own-ads.component';

describe('ScoutOwnAdsComponent', () => {
  let component: ScoutOwnAdsComponent;
  let fixture: ComponentFixture<ScoutOwnAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutOwnAdsComponent]
    });
    fixture = TestBed.createComponent(ScoutOwnAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
