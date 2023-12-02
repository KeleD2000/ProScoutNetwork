import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnAdsComponent } from './own-ads.component';

describe('OwnAdsComponent', () => {
  let component: OwnAdsComponent;
  let fixture: ComponentFixture<OwnAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnAdsComponent]
    });
    fixture = TestBed.createComponent(OwnAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
