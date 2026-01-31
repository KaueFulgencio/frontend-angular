import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { OnibusService } from '../../services/onibus.service';
import { Veiculo } from '../../model/veiculo.model';
import { HttpClient } from '@angular/common/http';
import { MockTransitService } from '../../services/mock.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa-onibus.component.html',
  styleUrls: ['./mapa-onibus.component.css']
})
export class MapaOnibusComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map', { static: true })
  mapElement!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private markers = new Map<number, L.Marker>();
  private sub?: Subscription;
  private readonly API_URL = 'https://dados.prefeitura.sp.gov.br/api/3/action';

  private busIcon = L.icon({
    iconUrl: 'bus.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });


  constructor(private onibusService: MockTransitService, private http: HttpClient) { }

  ngAfterViewInit(): void {
    (L.Icon.Default.prototype as any)._getIconUrl = () => '';
    this.initMap();
    this.iniciarMonitoramento();
    this.buscarDadosAPI();
  }

  private initMap(): void {
    this.map = L.map(this.mapElement.nativeElement)
      .setView([-23.5505, -46.6333], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  private iniciarMonitoramento(): void {
    this.sub = this.onibusService.monitorarVeiculos()
      .subscribe(veiculos => {
         console.log('Recebidos:', veiculos.length);
        const idsAtuais = new Set(veiculos.map(v => v.id));

        veiculos.forEach(v => this.atualizarOuCriarMarker(v));

        this.markers.forEach((marker, id) => {
          if (!idsAtuais.has(id)) {
            this.map.removeLayer(marker);
            this.markers.delete(id);
          }
        });
      });
  }


  private atualizarOuCriarMarker(v: Veiculo): void {
    const pos: L.LatLngExpression = [v.latitude, v.longitude];

    if (this.markers.has(v.id)) {
      this.markers.get(v.id)!.setLatLng(pos);
      return;
    }

    const marker = L.marker(pos, {
      icon: this.busIcon
    })
      .addTo(this.map)
      .bindPopup(`
      <strong>${v.letreiro}</strong><br/>
      Velocidade: ${v.velocidade} km/h
    `);

    this.markers.set(v.id, marker);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.map?.remove();
  }

  private buscarDadosAPI(): void {
    this.http.get<any>(`${this.API_URL}/package_search?q=transporte`)
      .subscribe((data: any) => {
        console.log(data);
      });
  }

}
