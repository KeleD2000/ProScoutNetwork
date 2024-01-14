import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBidComponent } from './player-bid.component';

describe('PlayerBidComponent', () => {
  let component: PlayerBidComponent;
  let fixture: ComponentFixture<PlayerBidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerBidComponent]
    });
    fixture = TestBed.createComponent(PlayerBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
