// src/app/cancion-create/cancion-create.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText,
  IonSelect, IonSelectOption, IonThumbnail
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Cancion } from '../services/music-api';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cancion-create',
  standalone: true,
  templateUrl: './cancion-create.page.html',
  styleUrls: ['./cancion-create.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText,
    IonSelect, IonSelectOption, IonThumbnail,
    ReactiveFormsModule, NgIf, NgFor
  ]
})
export class CancionCreatePage implements OnInit {
  albumId!: number;

  // ===== CREAR =====
  createForm = this.fb.group({
    nombre: ['', Validators.required],
  });
  createAudioFile: File | null = null;  // obligatorio
  createImageFile: File | null = null;  // opcional
  createLoading = false;
  createError: string | null = null;
  createSuccess: string | null = null;

  // ===== EDITAR =====
  canciones: Cancion[] = [];
  selectedCancionId = this.fb.control<number | null>(null);
  cancionSeleccionada: Cancion | null = null;

  // Editar info (JSON)
  editInfoForm = this.fb.group({
    nombre: ['', Validators.required],
  });
  editInfoLoading = false;
  editInfoError: string | null = null;
  editInfoSuccess: string | null = null;

  // Cambiar imagen
  editImageFile: File | null = null;
  editImageLoading = false;
  editImageError: string | null = null;
  editImageSuccess: string | null = null;

  // Cambiar audio
  editAudioFile: File | null = null;
  editAudioLoading = false;
  editAudioError: string | null = null;
  editAudioSuccess: string | null = null;

  // Borrar canción
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
    // ruta sugerida: /albums/:id/canciones/manage
    this.albumId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCanciones();
  }

  // -------- CREAR --------
  onCreateAudioChange(ev: Event) {
    this.createAudioFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }
  onCreateImageChange(ev: Event) {
    this.createImageFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitCreate() {
    if (this.createForm.invalid || !this.createAudioFile) {
      this.createForm.markAllAsTouched();
      if (!this.createAudioFile) this.createError = 'Debes seleccionar un archivo de audio';
      return;
    }
    this.createLoading = true;
    this.createError = null;
    this.createSuccess = null;

    this.api.createCancion(
      { nombre: this.createForm.value.nombre!, albumId: this.albumId },
      this.createAudioFile!,
      this.createImageFile || undefined
    ).subscribe({
      next: () => {
        this.createLoading = false;
        this.createSuccess = 'Canción creada correctamente';
        this.createForm.reset();
        this.createAudioFile = null;
        this.createImageFile = null;
        this.loadCanciones();
      },
      error: (e) => {
        this.createLoading = false;
        this.createError = e?.error?.error || 'Error creando canción';
      }
    });
  }

  // -------- LISTAR / SELECCIONAR --------
  loadCanciones() {
    this.api.getCancionesByAlbum(this.albumId).subscribe({
      next: (r) => {
        this.canciones = r || [];
        if (!this.selectedCancionId.value && this.canciones.length) {
          this.selectedCancionId.setValue(this.canciones[0].id);
        }
        this.prefillDesdeSeleccion();
      },
      error: (e) => {
        this.createError = e?.error?.error || 'Error cargando canciones';
      }
    });
  }

  prefillDesdeSeleccion() {
    this.clearMessages();

    const id = this.selectedCancionId.value;
    this.cancionSeleccionada = id ? (this.canciones.find(c => c.id === id) || null) : null;

    if (this.cancionSeleccionada) {
      this.editInfoForm.patchValue({
        nombre: this.cancionSeleccionada.nombre || '',
      });
    } else {
      this.editInfoForm.reset();
    }

    this.editImageFile = null;
    this.editAudioFile = null;
  }

  // -------- EDITAR INFO --------
  submitEditInfo() {
    if (!this.cancionSeleccionada) {
      this.editInfoError = 'Selecciona una canción';
      return;
    }
    if (this.editInfoForm.invalid) {
      this.editInfoForm.markAllAsTouched();
      return;
    }

    this.editInfoLoading = true;
    this.editInfoError = null;
    this.editInfoSuccess = null;

    this.api.updateCancion(this.cancionSeleccionada.id, {
      nombre: this.editInfoForm.value.nombre!,
      // Si quisieras mover de álbum: albumId: this.albumId
    }).subscribe({
      next: () => {
        this.editInfoLoading = false;
        this.editInfoSuccess = 'Información actualizada';
        this.loadCanciones();
      },
      error: (e) => {
        this.editInfoLoading = false;
        this.editInfoError = e?.error?.error || 'Error actualizando canción';
      }
    });
  }

  // -------- CAMBIAR IMAGEN --------
  onEditImageChange(ev: Event) {
    this.editImageFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitEditImage() {
    if (!this.cancionSeleccionada) {
      this.editImageError = 'Selecciona una canción';
      return;
    }
    if (!this.editImageFile) {
      this.editImageError = 'Selecciona una imagen';
      return;
    }

    this.editImageLoading = true;
    this.editImageError = null;
    this.editImageSuccess = null;

    this.api.updateCancionImage(this.cancionSeleccionada.id, this.editImageFile).subscribe({
      next: () => {
        this.editImageLoading = false;
        this.editImageSuccess = 'Imagen actualizada';
        this.editImageFile = null;
        this.loadCanciones();
      },
      error: (e) => {
        this.editImageLoading = false;
        this.editImageError = e?.error?.error || 'Error cambiando imagen';
      }
    });
  }

  // -------- CAMBIAR AUDIO --------
  onEditAudioChange(ev: Event) {
    this.editAudioFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitEditAudio() {
    if (!this.cancionSeleccionada) {
      this.editAudioError = 'Selecciona una canción';
      return;
    }
    if (!this.editAudioFile) {
      this.editAudioError = 'Selecciona un archivo de audio';
      return;
    }

    this.editAudioLoading = true;
    this.editAudioError = null;
    this.editAudioSuccess = null;

    this.api.updateCancionArchivo(this.cancionSeleccionada.id, this.editAudioFile).subscribe({
      next: () => {
        this.editAudioLoading = false;
        this.editAudioSuccess = 'Audio actualizado';
        this.editAudioFile = null;
        this.loadCanciones();
      },
      error: (e) => {
        this.editAudioLoading = false;
        this.editAudioError = e?.error?.error || 'Error cambiando audio';
      }
    });
  }

  // -------- BORRAR CANCIÓN --------
  private clearDeleteMsgs() {
  this.deleteError = this.deleteSuccess = null;
}

// Abre el diálogo de confirmación
async confirmDelete() {
  if (!this.cancionSeleccionada) {
    this.deleteError = 'Selecciona una canción';
    return;
  }
  this.clearDeleteMsgs();

  const alert = await this.alertCtrl.create({
    header: 'Eliminar canción',
    message: `¿Seguro que deseas eliminar "${this.cancionSeleccionada.nombre}"? Esta acción no se puede deshacer D:`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Eliminar', role: 'destructive', handler: () => this.doDelete() }
    ]
  });
  await alert.present();
}

// Ejecuta la eliminación
private doDelete() {
  if (!this.cancionSeleccionada) return;

  this.deleteLoading = true;
  this.api.deleteCancion(this.cancionSeleccionada.id).subscribe({
    next: () => {
      this.deleteLoading = false;
      this.deleteSuccess = 'Canción eliminada correctamente';
      // refrescar lista y limpiar selección
      this.selectedCancionId.setValue(null);
      this.cancionSeleccionada = null;
      this.loadCanciones();
    },
    error: (e) => {
      this.deleteLoading = false;
      this.deleteError = e?.error?.error || 'Error eliminando canción';
    }
  });
}

  // -------- helpers --------
  goBackToAlbum() {
    this.router.navigateByUrl(`/albums/${this.albumId}`);
  }

  private clearMessages() {
    this.editInfoError = this.editInfoSuccess = null;
    this.editImageError = this.editImageSuccess = null;
    this.editAudioError = this.editAudioSuccess = null;
  }
}
