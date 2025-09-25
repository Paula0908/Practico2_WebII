import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { IonHeader, IonItem, IonLabel, IonText, IonList, IonContent, IonThumbnail, IonTitle, IonToolbar, IonSearchbar, IonButton, IonButtons, IonIcon, IonAccordion, IonAccordionGroup, IonItemSliding, IonItemOption, IonItemOptions } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';
import { MusicApi, Artista, Genero, SearchResponse } from '../services/music-api';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [ IonButtons, IonButton,
    IonHeader, IonItem, IonLabel, IonText, IonList, IonContent, IonThumbnail,
    IonTitle, IonToolbar, IonSearchbar, NgIf, NgFor, RouterLink]
})
export class HomePage implements OnInit, OnDestroy {
  // Listas iniciales
  artistas: Artista[] = [];
  generos: Genero[] = [];
  loadingA = false;
  loadingG = false;

  // Error general
  error: string | null = null;

  // Búsqueda
  searchTerm = '';
  searching = false;
  results: SearchResponse | null = null;
  private searchSub?: Subscription;
  private lastQuery = '';
  private readonly searchLimit = 10;

  constructor(private api: MusicApi) {}


  
  ngOnInit() {
    this.reload();
  }
  ionViewWillEnter() {
    this.reload();
  }

  reload() {
    this.error = null;
    this.loadArtistas();
    this.loadGeneros();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  loadArtistas() {
    this.loadingA = true;
    this.api.getArtistas().subscribe({
      next: (r) => { this.artistas = r; },
      error: (e) => { this.error = e?.error?.error || 'Error cargando artistas'; },
      complete: () => { this.loadingA = false; }
    });
  }

  loadGeneros() {
    this.loadingG = true;
    this.api.getGeneros().subscribe({
      next: (r) => { this.generos = r; },
      error: (e) => { this.error = e?.error?.error || 'Error cargando géneros'; },
      complete: () => { this.loadingG = false; }
    });
  }

  // Llamado por (ionInput) del ion-searchbar
  onSearch(ev: CustomEvent) {
    const term = ((ev as any).detail?.value ?? '').trim();
    this.searchTerm = term;

    // Si no hay texto, limpiamos resultados
    if (!term) {
      this.clearSearch();
      return;
    }

    // Evitar repetir misma query
    if (term === this.lastQuery) return;
    this.lastQuery = term;

    // Cancelar petición anterior si existe
    this.searchSub?.unsubscribe();

    this.searching = true;
    this.error = null;
    this.searchSub = this.api.searchAll(term, this.searchLimit).subscribe({
      next: (r) => { this.results = r; },
      error: (e) => {
        this.results = null;
        this.error = e?.error?.error || 'Error buscando';
      },
      complete: () => { this.searching = false; }
    });
  }

  // Llamado por (ionClear) o manualmente
  clearSearch() {
    this.searchSub?.unsubscribe();
    this.results = null;
    this.searchTerm = '';
    this.searching = false;
    this.error = null;
    this.lastQuery = '';
  }
}
