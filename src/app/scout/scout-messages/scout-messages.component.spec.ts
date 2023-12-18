import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutMessagesComponent } from './scout-messages.component';

describe('ScoutMessagesComponent', () => {
  let component: ScoutMessagesComponent;
  let fixture: ComponentFixture<ScoutMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutMessagesComponent]
    });
    fixture = TestBed.createComponent(ScoutMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
