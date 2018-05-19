import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwObservatoryListPageComponent } from './jw-observatory-list-page.component';

describe('JwObservatoryListPageComponent', () => {
  let component: JwObservatoryListPageComponent;
  let fixture: ComponentFixture<JwObservatoryListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwObservatoryListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwObservatoryListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
