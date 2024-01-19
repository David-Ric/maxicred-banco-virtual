import { Component, EventEmitter, Inject, Output } from '@angular/core';

@Component({
  selector: 'app-modal-cambio',
  templateUrl: './modal-cambio.component.html',
  styleUrls: ['./modal-cambio.component.scss']
})
export class ModalCambioComponent {
  @Output() closeModalCambio = new EventEmitter<void>();

  modalCambio = true;

  onCloseModalCambio() {
    this.modalCambio = false;
 console.log("fechar modal")
    this.closeModalCambio.emit();
  }
}
