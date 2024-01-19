import { TestBed } from '@angular/core/testing';

import { ContaCorrenteService } from './conta-corrente.service';

describe('ContaCorrenteService', () => {
  let service: ContaCorrenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContaCorrenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
