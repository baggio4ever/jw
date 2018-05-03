import { TestBed, inject } from '@angular/core/testing';

import { JwHttpService } from './jw-http.service';

describe('JwHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwHttpService]
    });
  });

  it('should be created', inject([JwHttpService], (service: JwHttpService) => {
    expect(service).toBeTruthy();
  }));
});
