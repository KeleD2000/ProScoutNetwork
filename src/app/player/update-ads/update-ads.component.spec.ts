import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdsComponent } from './update-ads.component';

describe('UpdateAdsComponent', () => {
  let component: UpdateAdsComponent;
  let fixture: ComponentFixture<UpdateAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAdsComponent]
    });
    fixture = TestBed.createComponent(UpdateAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
