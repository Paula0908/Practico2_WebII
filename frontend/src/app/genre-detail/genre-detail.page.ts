import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonText
} from '@ionic/angular/standalone';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Artista, Genero } from '../services/music-api';

@Component({
  selector: 'app-genre-detail',
  standalone: true,
  templateUrl: './genre-detail.page.html',
  styleUrls: ['./genre-detail.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonText,
    NgIf, NgFor, RouterLink
  ]
})
export class GenreDetailPage implements OnInit {
  id!: number;
  genero?: Genero;
  artistas: Artista[] = [];
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private api: MusicApi) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.api.getGeneroById(this.id).subscribe({
      next: (g) => (this.genero = g),
      error: (e) => (this.error = e?.error?.error || 'Error cargando género'),
    });

    this.api.getArtistasByGenero(this.id).subscribe({
      next: (arts) => (this.artistas = arts),
      error: (e) => (this.error = e?.error?.error || 'Error cargando artistas'),
      complete: () => (this.loading = false),
    });
  }
}
