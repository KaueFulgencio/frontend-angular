import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import * as L from 'leaflet';

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

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (this.map) return;

    this.map = L.map(this.mapElement.nativeElement).setView(
      [-23.5505, -46.6333], // São Paulo
      12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Marker de teste
    L.marker([-23.5505, -46.6333])
      .addTo(this.map)
      .bindPopup('Mapa funcionando 🚀')
      .openPopup();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
