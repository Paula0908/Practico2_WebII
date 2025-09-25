import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonThumbnail, IonButtons, IonBackButton, IonButton, IonText } from '@ionic/angular/standalone';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Album, Cancion } from '../services/music-api';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  templateUrl: './album-detail.page.html',
  styleUrls: ['./album-detail.page.scss'],
  imports: [ IonText, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonThumbnail, IonButtons, IonBackButton, IonButton,
    NgIf, NgFor, CommonModule, RouterLink
  ]
})
export class AlbumDetailPage implements OnInit {
  id!: number;
  album?: Album;
  canciones: Cancion[] = [];
  loading = false;
  error: string | null = null;

  // cuál canción está “abierta” con el <audio>
  playingId: number | null = null;

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

    this.api.getAlbumById(this.id).subscribe({
      next: (al) => this.album = al,
      error: (e) => this.error = e?.error?.error || 'Error cargando álbum',
    });

    this.api.getCancionesByAlbum(this.id).subscribe({
      next: (cs) => this.canciones = cs,
      error: (e) => this.error = e?.error?.error || 'Error cargando canciones',
      complete: () => this.loading = false
    });
  }

  toggleAudio(c: Cancion) {
    // si ya está abierta, la cerramos; si no, la abrimos
    this.playingId = (this.playingId === c.id) ? null : c.id;
  }
}
