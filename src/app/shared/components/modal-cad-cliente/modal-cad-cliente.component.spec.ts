import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCadClienteComponent } from './modal-cad-cliente.component';

describe('ModalCadClienteComponent', () => {
  let component: ModalCadClienteComponent;
  let fixture: ComponentFixture<ModalCadClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCadClienteComponent]
    });
    fixture = TestBed.createComponent(ModalCadClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
