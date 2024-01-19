import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { EMPRESTIMO_ROUTES } from './emprestimo.routing';
import { CookieService } from 'ngx-cookie-service';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(EMPRESTIMO_ROUTES),
    ReactiveFormsModule,
  ],
  providers: [CookieService]
})
export class EmprestimoModule { }
