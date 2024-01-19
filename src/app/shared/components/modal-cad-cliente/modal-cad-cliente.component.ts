import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-cad-cliente',
  templateUrl: './modal-cad-cliente.component.html',
  styleUrls: ['./modal-cad-cliente.component.scss']
})
export class ModalCadClienteComponent {
  @Input() message: string = '';
  @Input() url: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() closeModalCard = new EventEmitter<void>();
  showModal = true;

  constructor(private router: Router) {}

  onCloseModal() {
    this.showModal = false;
    if (this.url.trim() !== '') {
      this.router.navigate([this.url.trim()]);
    }
    this.closeModal.emit();
  }
  onCloseModalCard(){
    this.showModal = false;
    this.closeModalCard.emit();
  }
}
