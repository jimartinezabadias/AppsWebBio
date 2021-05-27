import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectTestComponent } from './select-test.component';

describe('SelectTestComponent', () => {
  let component: SelectTestComponent;
  let fixture: ComponentFixture<SelectTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
