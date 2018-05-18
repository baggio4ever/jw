import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwObservatoryComponent } from './jw-observatory.component';

describe('JwObservatoryComponent', () => {
  let component: JwObservatoryComponent;
  let fixture: ComponentFixture<JwObservatoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwObservatoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwObservatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
