import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { Veiculo } from './sp-transit.service';
import { startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MockTransitService {

  private veiculos: Veiculo[] = this.gerarVeiculos(30);

  monitorarVeiculos(): Observable<Veiculo[]> {
    return interval(3000).pipe(
      startWith(0), 
      map(() => this.atualizarPosicoes())
    );
  }

  private gerarVeiculos(qtd: number): Veiculo[] {
    const baseLat = -23.5505;
    const baseLng = -46.6333;

    return Array.from({ length: qtd }, (_, i) => ({
      id: i + 1,
      letreiro: this.gerarLetreiro(),
      latitude: baseLat + this.randomOffset(),
      longitude: baseLng + this.randomOffset(),
      velocidade: this.randomInt(20, 45),
      direcao: this.randomDirecao(),
      dataHora: new Date().toISOString()
    }));
  }

  private atualizarPosicoes(): Veiculo[] {
    const deslocamento = 0.0003;

    return this.veiculos.map(v => ({
      ...v,
      latitude: v.latitude + deslocamento * this.randomSinal(),
      longitude: v.longitude + deslocamento * this.randomSinal(),
      dataHora: new Date().toISOString()
    }));
  }
  private randomOffset() {
    return (Math.random() - 0.5) * 0.01;
  }

  private randomSinal() {
    return Math.random() > 0.5 ? 1 : -1;
  }

  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomDirecao(): Veiculo['direcao'] {
    const dirs: Veiculo['direcao'][] = ['Norte', 'Sul', 'Leste', 'Oeste'];
    return dirs[Math.floor(Math.random() * dirs.length)];
  }

  private gerarLetreiro(): string {
    const linha = this.randomInt(1000, 9000);
    return `${linha}-${this.randomInt(10, 99)}`;
  }
}
