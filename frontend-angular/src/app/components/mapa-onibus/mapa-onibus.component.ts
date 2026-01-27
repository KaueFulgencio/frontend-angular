import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SPTransitService, Veiculo, Linha } from '../../services/sp-transit.service';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-mapa-onibus',
  templateUrl: './mapa-onibus.component.html',
  styleUrls: ['./mapa-onibus.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class MapaOnibusComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  mapa!: L.Map;
  markers: Map<number, L.Marker> = new Map();
  linhas: Linha[] = [];
  veiculosAtivos: Veiculo[] = [];
  linhaIdSelecionada: any = '';
  carregando = false;

  private subscriptions: Subscription[] = [];

  constructor(private spTransitService: SPTransitService) {}

  ngOnInit(): void {
    this.inicializarMapa();
    this.carregarLinhas();
  }

  private inicializarMapa(): void {
    const centro = [-23.5505, -46.6333];
    setTimeout(() => {
      this.mapa = L.map(this.mapContainer.nativeElement).setView([centro[0], centro[1]], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.mapa);
    }, 100);
  }

  private carregarLinhas(): void {
    this.carregando = true;
    const sub = this.spTransitService.obterLinhas().subscribe({
      next: (linhas) => {
        this.linhas = linhas.slice(0, 50);
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
    this.subscriptions.push(sub);
  }

  onLinhaChange(): void {
    if (!this.linhaIdSelecionada) return;
    this.carregando = true;
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();
    const sub = this.spTransitService
      .monitorarVeiculosEmTempoReal(this.linhaIdSelecionada)
      .subscribe({
        next: (veiculos) => {
          this.veiculosAtivos = veiculos;
          this.atualizarMapa(veiculos);
          this.carregando = false;
        },
        error: () => {
          this.carregando = false;
        }
      });
    this.subscriptions.push(sub);
  }

  private atualizarMapa(veiculos: Veiculo[]): void {
    if (!this.mapa) return;
    veiculos.forEach((veiculo) => {
      const lat = veiculo.latitude;
      const lng = veiculo.longitude;
      if (this.markers.has(veiculo.id)) {
        const marker = this.markers.get(veiculo.id)!;
        marker.setLatLng([lat, lng]);
      } else {
        const icone = L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNYRCBMAAB0PSJzdHJ1Y3QiIHgxPSI2IiB5MT0iMjYiIHgyPSIyNiIgeTI9IjYiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRkZCQzAwIi8+Cjwvc3ZnPg==',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });
        const marker = L.marker([lat, lng], { icon: icone })
          .bindPopup(`
            <strong>${veiculo.letreiro}</strong><br/>
            Velocidade: ${veiculo.velocidade} km/h<br/>
            Direção: ${veiculo.direcao}
          `)
          .addTo(this.mapa);
        this.markers.set(veiculo.id, marker);
      }
    });
    if (this.markers.size > 0) {
      const group = new L.FeatureGroup(Array.from(this.markers.values()));
      this.mapa.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}