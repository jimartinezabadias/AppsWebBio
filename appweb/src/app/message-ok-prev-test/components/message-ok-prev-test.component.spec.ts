import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageOkPrevTestComponent } from './message-ok-prev-test.component';

describe('MessageOkPrevTestComponent', () => {
  let component: MessageOkPrevTestComponent;
  let fixture: ComponentFixture<MessageOkPrevTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageOkPrevTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageOkPrevTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
