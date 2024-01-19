import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './views/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from './shared/app-material/app-material.module';
import { HomeComponent } from './views/home/home.component';
import { SharedModule } from './shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InvestimentosComponent } from './views/investimentos/investimentos.component';
import { CadastroClienteComponent } from './views/cadastro-cliente/cadastro-cliente.component';
import { EmprestimoComponent } from './views/emprestimo/emprestimo.component';
import { FinanceiroComponent } from './views/financeiro/financeiro.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    InvestimentosComponent,
    CadastroClienteComponent,
    EmprestimoComponent,
    FinanceiroComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    AppMaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
