import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScoutProfileComponent } from './update-scout-profile.component';

describe('UpdateScoutProfileComponent', () => {
  let component: UpdateScoutProfileComponent;
  let fixture: ComponentFixture<UpdateScoutProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateScoutProfileComponent]
    });
    fixture = TestBed.createComponent(UpdateScoutProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
