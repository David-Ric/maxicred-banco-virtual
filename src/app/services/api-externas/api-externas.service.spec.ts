import { TestBed } from '@angular/core/testing';

import { ApiExternasService } from './api-externas.service';

describe('ApiExternasService', () => {
  let service: ApiExternasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiExternasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
