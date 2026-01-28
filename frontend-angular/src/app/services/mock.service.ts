import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { Veiculo } from './sp-transit.service';

@Injectable({ providedIn: 'root' })
export class MockTransitService {

  private veiculos: Veiculo[] = [
    {
      id: 1,
      letreiro: '2004-10',
      latitude: -23.5505,
      longitude: -46.6333,
      velocidade: 30,
      direcao: 'Norte',
      dataHora: new Date().toISOString()
    },
    {
      id: 2,
      letreiro: '875A-10',
      latitude: -23.5605,
      longitude: -46.6433,
      velocidade: 25,
      direcao: 'Sul',
      dataHora: new Date().toISOString()
    }
  ];

  monitorarVeiculos(): Observable<Veiculo[]> {
    return interval(3000).pipe(
      map(() => this.atualizarPosicoes())
    );
  }

  private atualizarPosicoes(): Veiculo[] {
    // Movimento realista: ~30 metros por atualização
    const deslocamento = 0.0003; // ~30 metros
    return this.veiculos.map(v => {
      // Simula movimento contínuo, alternando direção
      const deltaLat = deslocamento * (Math.random() > 0.5 ? 1 : -1);
      const deltaLng = deslocamento * (Math.random() > 0.5 ? 1 : -1);
      return {
        ...v,
        latitude: v.latitude + deltaLat,
        longitude: v.longitude + deltaLng,
        dataHora: new Date().toISOString()
      };
    });
  }
}
