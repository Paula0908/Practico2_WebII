import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea,
  IonButton, IonText, IonSelect, IonSelectOption, IonThumbnail, IonCheckbox
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Artista, Genero } from '../services/music-api';

@Component({
  selector: 'app-artist-create',
  standalone: true,
  templateUrl: './artist-create.page.html',
  styleUrls: ['./artist-create.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea,
    IonButton, IonText, IonSelect, IonSelectOption, IonThumbnail,
    ReactiveFormsModule, NgIf, NgFor,   IonCheckbox
  ]
})
export class ArtistCreatePage implements OnInit {
  // listado para el select
  artistas: Artista[] = [];
  artistaSeleccionado: Artista | null = null;

  // selección compartida para ambos formularios de edición
  selectedArtistaId = new FormControl<number | null>(null, { nonNullable: false });

  // ---- Crear ----
  createLoading = false;
  createError: string | null = null;
  createSuccess: string | null = null;
  createImagenFile: File | null = null;

  createForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  // ---- Editar Info (JSON) ----
  editInfoLoading = false;
  editInfoError: string | null = null;
  editInfoSuccess: string | null = null;

  editInfoForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  // ----- Géneros -----
  allGeneros: Genero[] = [];
  selectedGeneroIds = new Set<number>();

  editGenerosLoading = false;
  editGenerosError: string | null = null;
  editGenerosSuccess: string | null = null;

  // ---- Cambiar Imagen (FormData) ----
  editImageLoading = false;
  editImageError: string | null = null;
  editImageSuccess: string | null = null;
  editImageFile: File | null = null;

    // ----- Eliminar artista -----
  deleteLoading = false;
  deleteError: string | null = null;
  deleteSuccess: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private api: MusicApi, 
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadArtistas();
    this.loadGeneros(); 
  }

  private loadArtistas() {
    this.api.getArtistas().subscribe({
      next: (as) => this.artistas = as,
      error: () => {}
    });
  }
    private loadGeneros() {
    this.api.getGeneros().subscribe({
      next: (gs) => this.allGeneros = gs,
      error: () => {}
    });
  }

  // ===== Crear =====
  onFileChangeCreate(ev: Event) {
    this.createImagenFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.createLoading = true;
    this.createError = null;
    this.createSuccess = null;

    const { nombre, descripcion } = this.createForm.value;
    this.api.createArtista(
      { nombre: nombre!, descripcion: descripcion || '' },
      this.createImagenFile || undefined
    ).subscribe({
      next: (a) => {
        this.createSuccess = 'Artista creado :3';
        this.createLoading = false;
        this.createForm.reset();
        this.createImagenFile = null;
        this.loadArtistas(); // refrescar select
      },
      error: (e) => {
        this.createError = e?.error?.error || 'Error creando artista';
        this.createLoading = false;
      }
    });
  }

  // ===== Selección para edición =====
  prefillDesdeSeleccion() {
    const id = this.selectedArtistaId.value!;
    const a = this.artistas.find(x => x.id === id) || null;
    this.artistaSeleccionado = a;

    this.editInfoForm.patchValue({
      nombre: a?.nombre ?? '',
      descripcion: a?.descripcion ?? ''
    });
      this.selectedGeneroIds.clear();
    (a?.generos || []).forEach(g => this.selectedGeneroIds.add(g.id));
    this.editGenerosError = this.editGenerosSuccess = null;

    this.editImageFile = null;
    this.editInfoError = this.editInfoSuccess = null;
    this.editImageError = this.editImageSuccess = null;
  }

  // ===== Editar información (JSON) =====
  submitEditInfo() {
    if (!this.artistaSeleccionado || this.editInfoForm.invalid) {
      this.editInfoForm.markAllAsTouched();
      return;
    }
    this.editInfoLoading = true;
    this.editInfoError = null;
    this.editInfoSuccess = null;

    const payload = {
      nombre: this.editInfoForm.value.nombre!,
      descripcion: this.editInfoForm.value.descripcion || ''
    };

    this.api.updateArtistaInfo(this.artistaSeleccionado.id, payload).subscribe({
      next: (updated) => {
        this.editInfoLoading = false;
        this.editInfoSuccess = 'Información actualizada :3';

        const idx = this.artistas.findIndex(x => x.id === updated.id);
        if (idx >= 0) this.artistas[idx] = { ...this.artistas[idx], ...updated };
        if (this.artistaSeleccionado?.id === updated.id) {
          this.artistaSeleccionado = { ...(this.artistaSeleccionado || {}), ...updated };
        }
      },
      error: (e) => {
        this.editInfoError = e?.error?.error || 'Error guardando cambios';
        this.editInfoLoading = false;
      }
    });
  }

  // ===== Checkbox handler para géneros =====
  toggleGenero(g: Genero, ev: CustomEvent) {
    const checked = (ev as any).detail?.checked === true;
    if (checked) this.selectedGeneroIds.add(g.id);
    else this.selectedGeneroIds.delete(g.id);
  }

  // ===== Guardar géneros (PUT /artistas/:id/generos) =====
  submitEditGeneros() {
    if (!this.artistaSeleccionado) return;

    this.editGenerosLoading = true;
    this.editGenerosError = null;
    this.editGenerosSuccess = null;

    const ids = Array.from(this.selectedGeneroIds);

    this.api.putArtistaGeneros(this.artistaSeleccionado.id, ids).subscribe({
      next: (generosActualizados) => {
        this.editGenerosLoading = false;
        this.editGenerosSuccess = 'Géneros actualizados :3';

        // sincróniza en memoria (lista y seleccionado)
        if (this.artistaSeleccionado) {
          this.artistaSeleccionado = {
            ...this.artistaSeleccionado,
            generos: generosActualizados
          };
        }
        const idx = this.artistas.findIndex(x => x.id === this.artistaSeleccionado?.id);
        if (idx >= 0) {
          this.artistas[idx] = {
            ...this.artistas[idx],
            generos: generosActualizados
          };
        }
      },
      error: (e) => {
        this.editGenerosError = e?.error?.error || 'Error guardando géneros';
        this.editGenerosLoading = false;
      }
    });
  }
  // ===== Cambiar imagen (FormData) =====
  onFileChangeEditImage(ev: Event) {
    this.editImageFile = (ev.target as HTMLInputElement).files?.[0] || null;
  }

  submitEditImage() {
    if (!this.artistaSeleccionado || !this.editImageFile) return;

    this.editImageLoading = true;
    this.editImageError = null;
    this.editImageSuccess = null;

    this.api.updateArtistaImagen(this.artistaSeleccionado.id, this.editImageFile).subscribe({
      next: (updated) => {
        this.editImageLoading = false;
        this.editImageSuccess = 'Imagen actualizada :3';
        this.editImageFile = null;

        // sincroniza en memoria (para que cambie la miniatura)
        const idx = this.artistas.findIndex(x => x.id === updated.id);
        if (idx >= 0) this.artistas[idx] = { ...this.artistas[idx], ...updated };
        if (this.artistaSeleccionado?.id === updated.id) {
          this.artistaSeleccionado = { ...(this.artistaSeleccionado || {}), ...updated };
        }
      },
      error: (e) => {
        this.editImageError = e?.error?.error || 'Error subiendo imagen';
        this.editImageLoading = false;
      }
    });
  }
  // ====== Eliminar ======
  private clearDeleteMsgs() {
    this.deleteError = this.deleteSuccess = null;
  }

  async confirmDeleteArtista() {
    if (!this.artistaSeleccionado) {
      this.deleteError = 'Selecciona un artista';
      return;
    }
    this.clearDeleteMsgs();

    const alert = await this.alertCtrl.create({
      header: 'Eliminar artista',
      message: `¿Seguro que deseas eliminar "${this.artistaSeleccionado.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.doDeleteArtista() }
      ]
    });
    await alert.present();
  }

  private doDeleteArtista() {
    if (!this.artistaSeleccionado) return;

    this.deleteLoading = true;
    this.api.deleteArtista(this.artistaSeleccionado.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.deleteSuccess = 'Artista eliminado correctamente';

        // limpiar selección y formularios
        this.selectedArtistaId.setValue(null);
        this.artistaSeleccionado = null;

        this.editInfoForm.reset();
        this.editImageFile = null;

        // refrescar lista del select
        this.loadArtistas();
      },
      error: (e) => {
        this.deleteLoading = false;
        this.deleteError = e?.error?.error || 'Error eliminando artista';
      }
    });
  }
}
