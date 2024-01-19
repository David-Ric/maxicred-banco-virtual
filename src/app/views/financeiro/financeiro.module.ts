import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FINANC_ROUTES } from './financeiro.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(FINANC_ROUTES),
    ReactiveFormsModule,
  ],
  providers: [CookieService]
})
export class FinanceiroModule { }
