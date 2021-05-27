import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreativeUserComponent } from './creative-user.component';

describe('CreativeUserComponent', () => {
  let component: CreativeUserComponent;
  let fixture: ComponentFixture<CreativeUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
