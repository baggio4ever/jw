import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwNotFoundPageComponent } from './jw-not-found-page.component';

describe('JwNotFoundPageComponent', () => {
  let component: JwNotFoundPageComponent;
  let fixture: ComponentFixture<JwNotFoundPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwNotFoundPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwNotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
