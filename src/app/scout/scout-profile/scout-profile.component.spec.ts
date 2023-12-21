import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutProfileComponent } from './scout-profile.component';

describe('ScoutProfileComponent', () => {
  let component: ScoutProfileComponent;
  let fixture: ComponentFixture<ScoutProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutProfileComponent]
    });
    fixture = TestBed.createComponent(ScoutProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
