import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-informacoes',
    templateUrl: './informacoes.component.html',
    styleUrls: ['./informacoes.component.css']
})
export class InformacoesComponent implements OnInit {

    usuario: any;

    ngOnInit() {
        const dados = localStorage.getItem('usuario');
        if (dados) {
            this.usuario = JSON.parse(dados);
        }
    }
}
