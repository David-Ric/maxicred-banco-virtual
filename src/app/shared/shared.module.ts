import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importe o RouterModule
import { AppMaterialModule } from './app-material/app-material.module';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PhoneFormatPipe } from './pipes/phone/phone-format.pipe';
import { CpfFormatPipe } from './pipes/cpf/cpf-format.pipe';
import { CpfFormatDirective } from './diretivas/cpf/cpf-format.directive';
import { PhoneFormatDirective } from './diretivas/phone/phone-format.directive';
import { ModalCadClienteComponent } from './components/modal-cad-cliente/modal-cad-cliente.component';
import { CepFormatDirective } from './diretivas/cep/cep-format.directiv';
import { CurrencyFormatDirective } from './diretivas/moeda/currency-format.directive';
import { ModalCambioComponent } from './components/modal-cambio/modal-cambio.component';
import { MoedaPipe } from './pipes/moeda/moeda.pipe';

@NgModule({
  declarations: [
    PhoneFormatPipe,
    CpfFormatPipe,
    CpfFormatDirective,
    PhoneFormatDirective,
    CepFormatDirective,
    CurrencyFormatDirective,
    LoadingModalComponent,
    ModalConfirmComponent,
    NavBarComponent,
    FooterComponent,
    ModalCadClienteComponent,
    ModalCambioComponent,
    MoedaPipe
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule,
  ],
  exports:[
    PhoneFormatPipe,
    CpfFormatPipe,
    LoadingModalComponent,
    ModalConfirmComponent,
    CpfFormatDirective,
    PhoneFormatDirective,
    CepFormatDirective,
    CurrencyFormatDirective,
    NavBarComponent,
    FooterComponent,
    AppMaterialModule,
    ModalCadClienteComponent,
    ModalCambioComponent,
    MoedaPipe
  ]
})
export class SharedModule { }
