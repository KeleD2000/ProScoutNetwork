import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutBidComponent } from './scout-bid.component';

describe('ScoutBidComponent', () => {
  let component: ScoutBidComponent;
  let fixture: ComponentFixture<ScoutBidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutBidComponent]
    });
    fixture = TestBed.createComponent(ScoutBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
