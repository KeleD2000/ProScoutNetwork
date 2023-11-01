import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMainComponent } from './player-main.component';

describe('PlayerMainComponent', () => {
  let component: PlayerMainComponent;
  let fixture: ComponentFixture<PlayerMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerMainComponent]
    });
    fixture = TestBed.createComponent(PlayerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
