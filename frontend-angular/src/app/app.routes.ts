import { Routes } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { InformacoesComponent } from './components/informacoes/informacoes.component';

export const routes: Routes = [
	{ path: '', component: CadastroComponent },
	{ path: 'dados', component: InformacoesComponent }
];
