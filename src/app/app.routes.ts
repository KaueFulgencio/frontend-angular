import { Routes } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { InformacoesComponent } from './components/informacoes/informacoes.component';
import { MapaOnibusComponent } from './components/mapa-onibus/mapa-onibus.component';

export const routes: Routes = [
	{ path: '', component: CadastroComponent },
	{ path: 'dados', component: InformacoesComponent },
	{ path: 'mapa', component: MapaOnibusComponent }
];
