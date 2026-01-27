import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaOnibusComponent } from './mapa-onibus.component';

describe('MapaOnibusComponent', () => {
  let component: MapaOnibusComponent;
  let fixture: ComponentFixture<MapaOnibusComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaOnibusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaOnibusComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
