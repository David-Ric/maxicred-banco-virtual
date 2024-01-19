
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {
  @Input() message: string = '';
  @Input() url: string = '';
  @Output() closeModal = new EventEmitter<void>();
  showModal = true;

  constructor(private router: Router) {}

  onCloseModal() {
    this.showModal = false;
    if (this.url.trim() !== '') {
      this.router.navigate([this.url.trim()]);
    }
    this.closeModal.emit();
  }
}


