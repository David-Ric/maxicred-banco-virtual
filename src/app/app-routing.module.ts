import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './guards/auth-guard.service.service';
import { HomeComponent } from './views/home/home.component';
import { InvestimentosComponent } from './views/investimentos/investimentos.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full',
  },
  {
    path:'home',
    component: HomeComponent,
  },
  {
    path:'login',
    component: LoginComponent,
  },
  {
    path:'investimentos',
    component: InvestimentosComponent,
  },
  {
    path:'cadastro-cliente',
    loadChildren:() => import('./views/cadastro-cliente/cadastro-cliente.module').then(
      (m) => m.CadastroClienteModule
    ),
    canActivate: [AuthGuard]
  },

  {
    path:'emprestimos',
    loadChildren:() => import('./views/emprestimo/emprestimo.module').then(
      (m) => m.EmprestimoModule
    ),
    canActivate: [AuthGuard]
  },
  {
    path:'financeiro',
    loadChildren:() => import('./views/financeiro/financeiro.module').then(
      (m) => m.FinanceiroModule
    ),
    canActivate: [AuthGuard]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
