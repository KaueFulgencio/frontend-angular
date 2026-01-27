import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Veiculo {
    id: number;
    letreiro: string;
    latitude: number;
    longitude: number;
    velocidade: number;
    direcao: string;
    dataHora: string;
}

export interface Parada {
    id: number;
    nome: string;
    endereco: string;
    latitude: number;
    longitude: number;
}

export interface Linha {
    id: number;
    numero: string;
    nome: string;
    letreiro: string;
    descricaoSentido: string;
}

@Injectable({
    providedIn: 'root'
})
export class SPTransitService { 
    private readonly API_URL = environment.apiUrl;
    private token = '';
    private autenticado$ = new BehaviorSubject<boolean>(false);
    private veiculos$ = new BehaviorSubject<Veiculo[]>([]);

    constructor(private http: HttpClient) {
        this.inicializar();
    }

    private inicializar(): void {
        this.autenticar().subscribe();
    }

    autenticar(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(
            `${this.API_URL}/login`,
            { email: environment.apiEmail, senha: environment.apiSenha},
            { headers }
        ).pipe(
            tap((response) => {
                this.token = response.token;
                this.autenticado$.next(true);
                console.log('Autenticado na API SPTransit');
            }),
            catchError((error) => {
                console.error('Erro na autenticação:', error);
                this.autenticado$.next(false);
                return of(null);
            })
        );
    }

    obterLinhas(): Observable<Linha[]> {
        return this.http.get<Linha[]>(`${this.API_URL}/linhas`, {
            headers: { Cookie: `apikey=${this.token}` }
        }).pipe(
            catchError((error) => {
                console.error('Erro ao buscar linhas:', error);
                return of([]);
            })
        );
    }

    obterVeiculosDaLinha(linhaId: number): Observable<Veiculo[]> {
        return this.http.get<any>(
            `${this.API_URL}/linhas/${linhaId}/veiculos`,
            { headers: { Cookie: `apikey=${this.token}` } }
        ).pipe(
            tap((response) => {
                const veiculos: Veiculo[] = response.veiculos.map((v: any) => ({
                    id: v.id,
                    letreiro: v.letreiro,
                    latitude: v.latitude,
                    longitude: v.longitude,
                    velocidade: v.velocidade,
                    direcao: v.direcao,
                    dataHora: v.dataHora
                }));
                this.veiculos$.next(veiculos);
            }),
            catchError((error) => {
                console.error('Erro ao buscar veículos:', error);
                return of([]);
            })
        );
    }

    monitorarVeiculosEmTempoReal(linhaId: number): Observable<Veiculo[]> {
        return interval(5000).pipe(
            switchMap(() => this.obterVeiculosDaLinha(linhaId))
        );
    }

    obterParadas(linhaId: number): Observable<Parada[]> {
        return this.http.get<Parada[]>(
            `${this.API_URL}/linhas/${linhaId}/paradas`,
            { headers: { Cookie: `apikey=${this.token}` } }
        ).pipe(
            catchError((error) => {
                console.error('Erro ao buscar paradas:', error);
                return of([]);
            })
        );
    }

    getVeiculos$(): Observable<Veiculo[]> {
        return this.veiculos$.asObservable();
    }

    getAutenticado$(): Observable<boolean> {
        return this.autenticado$.asObservable();
    }
}