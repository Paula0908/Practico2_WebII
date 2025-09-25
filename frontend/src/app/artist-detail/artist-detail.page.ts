import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonThumbnail, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Artista, Album } from '../services/music-api';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  templateUrl: './artist-detail.page.html',
  styleUrls: ['./artist-detail.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonThumbnail, IonButtons, IonBackButton,
    NgIf, NgFor, RouterLink
  ]
})
export class ArtistDetailPage implements OnInit {
  id!: number;
  artista?: Artista;
  albums: Album[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: MusicApi
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }
  ionViewWillEnter() {
    this.load();
  }


  load() {
    this.loading = true;
    this.error = null;

    this.api.getArtistaById(this.id).subscribe({
      next: (art) => this.artista = art,
      error: (e) => this.error = e?.error?.error || 'Error cargando artista',
      complete: () => this.loading = false
    });

    this.api.getAlbumsByArtista(this.id).subscribe({
      next: (albs) => this.albums = albs,
      error: (e) => this.error = e?.error?.error || 'Error cargando álbumes',
      complete: () => this.loading = false
    });

  }
}
