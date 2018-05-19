import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwRankingPageComponent } from './jw-ranking-page.component';

describe('JwRankingPageComponent', () => {
  let component: JwRankingPageComponent;
  let fixture: ComponentFixture<JwRankingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwRankingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwRankingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
