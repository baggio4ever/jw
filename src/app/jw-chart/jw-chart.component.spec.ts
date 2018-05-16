import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwChartComponent } from './jw-chart.component';

describe('JwChartComponent', () => {
  let component: JwChartComponent;
  let fixture: ComponentFixture<JwChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
