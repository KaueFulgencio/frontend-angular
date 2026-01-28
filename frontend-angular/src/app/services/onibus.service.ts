import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { Veiculo } from '../model/veiculo.model';

@Injectable({ providedIn: 'root' })
export class OnibusService {

  private veiculos: Veiculo[] = [
    {
      id: 1,
      latitude: -23.5505,
      longitude: -46.6333,
      letreiro: '2004-10',
      velocidade: 35
    },
    {
      id: 2,
      latitude: -23.5535,
      longitude: -46.6400,
      letreiro: '875A-10',
      velocidade: 28
    }
  ];

  monitorar(): Observable<Veiculo[]> {
    return interval(2000).pipe(
      map(() => {
        this.veiculos = this.veiculos.map(v => ({
          ...v,
          latitude: v.latitude + (Math.random() - 0.5) * 0.001,
          longitude: v.longitude + (Math.random() - 0.5) * 0.001
        }));

        return this.veiculos;
      })
    );
  }
}
