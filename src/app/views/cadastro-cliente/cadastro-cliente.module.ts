import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLIENTE_ROUTES } from './cadastro-cliente.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(CLIENTE_ROUTES),
    ReactiveFormsModule,

  ],
  providers: [CookieService]
})
export class CadastroClienteModule { }
