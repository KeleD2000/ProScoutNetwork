import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutMainComponent } from './scout-main.component';

describe('ScoutMainComponent', () => {
  let component: ScoutMainComponent;
  let fixture: ComponentFixture<ScoutMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutMainComponent]
    });
    fixture = TestBed.createComponent(ScoutMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
