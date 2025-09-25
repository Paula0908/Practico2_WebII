// src/app/album-create/album-create.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText,
  IonSelect, IonSelectOption, IonThumbnail
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Album } from '../services/music-api';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-album-create',
  standalone: true,
  templateUrl: './album-create.page.html',
  styleUrls: ['./album-create.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText,
    IonSelect, IonSelectOption, IonThumbnail,
    ReactiveFormsModule, NgIf, NgFor
  ]
})
export class AlbumCreatePage implements OnInit {
  artistaId!: number;

  // ===== CREAR =====
  createForm = this.fb.group({
    nombre: ['', Validators.required],
  });
  createLoading = false;
  createError: string | null = null;
  createSuccess: string | null = null;
  createImageFile: File | null = null;

  // ===== EDITAR (selección + info) =====
  albums: Album[] = [];
  selectedAlbumId = this.fb.control<number | null>(null);
  albumSeleccionado: Album | null = null;

  editInfoForm = this.fb.group({
    nombre: ['', Validators.required],
  });
  editInfoLoading = false;
  editInfoError: string | null = null;
  editInfoSuccess: string | null = null;

  // ===== CAMBIAR IMAGEN =====
  editImageFile: File | null = null;
  editImageLoading = false;
  editImageError: string | null = null;
  editImageSuccess: string | null = null;

  // ===== ELIMINAR =====
  deleteLoading = false;
  deleteError: string | null = null;
  deleteSuccess: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: MusicApi,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // esta page cuelga de /artistas/:id/albums/manage
    this.artistaId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAlbums();
  }

  // ---------- CREAR ----------
  onFileChangeCreate(ev: Event) {
    this.createImageFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.createLoading = true;
    this.createError = null;
    this.createSuccess = null;

    this.api.createAlbum(
      { nombre: this.createForm.value.nombre!, artistaId: this.artistaId },
      this.createImageFile || undefined
    ).subscribe({
      next: () => {
        this.createLoading = false;
        this.createSuccess = 'Álbum creado correctamente';
        this.createForm.reset();
        this.createImageFile = null;
        this.loadAlbums();
      },
      error: (e) => {
        this.createLoading = false;
        this.createError = e?.error?.error || 'Error creando álbum';
      }
    });
  }

  // ---------- CARGAR Y SELECCIONAR ----------
  loadAlbums() {
    this.api.getAlbumsByArtista(this.artistaId).subscribe({
      next: (r) => {
        this.albums = r || [];
        // autoseleccionar el primero si no hay selección
        if (!this.selectedAlbumId.value && this.albums.length) {
          this.selectedAlbumId.setValue(this.albums[0].id);
          this.prefillDesdeSeleccion();
        } else {
          // si ya había selección, refrescar datos del seleccionado
          this.prefillDesdeSeleccion();
        }
      },
      error: (e) => {
        this.createError = e?.error?.error || 'Error cargando álbumes';
      }
    });
  }

  prefillDesdeSeleccion() {
    this.limpiarMensajesSecundarios();

    const id = this.selectedAlbumId.value;
    this.albumSeleccionado = id ? (this.albums.find(a => a.id === id) || null) : null;

    // Prellenar el form de info
    if (this.albumSeleccionado) {
      this.editInfoForm.patchValue({
        nombre: this.albumSeleccionado.nombre || '',
      });
    } else {
      this.editInfoForm.reset();
    }

    // Reset del file de imagen al cambiar selección
    this.editImageFile = null;
  }

  // ---------- EDITAR INFO ----------
  submitEditInfo() {
    if (!this.albumSeleccionado) {
      this.editInfoError = 'Selecciona un álbum';
      return;
    }
    if (this.editInfoForm.invalid) {
      this.editInfoForm.markAllAsTouched();
      return;
    }

    this.editInfoLoading = true;
    this.editInfoError = null;
    this.editInfoSuccess = null;

    this.api.updateAlbum(this.albumSeleccionado.id, {
      nombre: this.editInfoForm.value.nombre!,
    }).subscribe({
      next: () => {
        this.editInfoLoading = false;
        this.editInfoSuccess = 'Información actualizada :3';
        this.loadAlbums();
      },
      error: (e) => {
        this.editInfoLoading = false;
        this.editInfoError = e?.error?.error || 'Error actualizando álbum';
      }
    });
  }

  // ---------- CAMBIAR IMAGEN ----------
  onFileChangeEditImage(ev: Event) {
    this.editImageFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitEditImage() {
    if (!this.albumSeleccionado) {
      this.editImageError = 'Selecciona un álbum';
      return;
    }
    if (!this.editImageFile) {
      this.editImageError = 'Selecciona una imagen';
      return;
    }

    this.editImageLoading = true;
    this.editImageError = null;
    this.editImageSuccess = null;

    this.api.updateAlbumImage(this.albumSeleccionado.id, this.editImageFile).subscribe({
      next: () => {
        this.editImageLoading = false;
        this.editImageSuccess = 'Imagen actualizada :D';
        this.editImageFile = null;
        this.loadAlbums();
      },
      error: (e) => {
        this.editImageLoading = false;
        this.editImageError = e?.error?.error || 'Error cambiando imagen';
      }
    });
  }

  // ---------- ELIMINAR ----------
  private clearDeleteMsgs() {
    this.deleteError = this.deleteSuccess = null;
  }

  async confirmDeleteAlbum() {
    if (!this.albumSeleccionado) {
      this.deleteError = 'Selecciona un álbum';
      return;
    }
    this.clearDeleteMsgs();

    const alert = await this.alertCtrl.create({
      header: 'Eliminar álbum',
      message: `¿Seguro que deseas eliminar "${this.albumSeleccionado.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.doDeleteAlbum() }
      ]
    });
    await alert.present();
  }

  private doDeleteAlbum() {
    if (!this.albumSeleccionado) return;

    this.deleteLoading = true;
    this.api.deleteAlbum(this.albumSeleccionado.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.deleteSuccess = 'Álbum eliminado correctamente';

        // limpiar selección y formularios
        this.selectedAlbumId.setValue(null);
        this.albumSeleccionado = null;

        this.editInfoForm.reset();
        this.editImageFile = null;

        // refrescar lista de álbumes
        this.loadAlbums();
      },
      error: (e) => {
        this.deleteLoading = false;
        // Si hay FK con canciones, el backend/DB puede rechazar el delete
        this.deleteError = e?.error?.error || 'Error eliminando álbum';
      }
    });
  }

  // ---------- helpers ----------
  goBackToArtist() {
    this.router.navigateByUrl(`/artistas/${this.artistaId}`);
  }

  private limpiarMensajesSecundarios() {
    this.editInfoError = null;
    this.editInfoSuccess = null;
    this.editImageError = null;
    this.editImageSuccess = null;
  }
}
