import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScoutAdsComponent } from './update-scout-ads.component';

describe('UpdateScoutAdsComponent', () => {
  let component: UpdateScoutAdsComponent;
  let fixture: ComponentFixture<UpdateScoutAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateScoutAdsComponent]
    });
    fixture = TestBed.createComponent(UpdateScoutAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
