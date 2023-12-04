import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMessagesComponent } from './player-messages.component';

describe('PlayerMessagesComponent', () => {
  let component: PlayerMessagesComponent;
  let fixture: ComponentFixture<PlayerMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerMessagesComponent]
    });
    fixture = TestBed.createComponent(PlayerMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
