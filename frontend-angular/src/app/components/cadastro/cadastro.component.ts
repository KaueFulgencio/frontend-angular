import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cadastro',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

    usuario = {
        nome: '',
        email: '',
        senha: ''
    };

    emailInvalido = false;

    constructor(private router: Router) { }

    validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    salvar() {
        this.emailInvalido = !this.validarEmail(this.usuario.email);

        if (this.emailInvalido) {
            return;
        }

        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        this.router.navigate(['/dados']);
    }
}
