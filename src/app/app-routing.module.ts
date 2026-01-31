import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComponent } from '../app/components/cadastro/cadastro.component';
import { InformacoesComponent } from './components/informacoes/informacoes.component';

const routes: Routes = [
    { path: '', component: CadastroComponent },
    { path: 'dados', component: InformacoesComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
