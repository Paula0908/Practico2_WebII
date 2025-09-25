import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MusicApi, Genero } from '../services/music-api';

@Component({
  selector: 'app-genre-create',
  standalone: true,
  templateUrl: './genre-create.page.html',
  styleUrls: ['./genre-create.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText,
    IonSelect, IonSelectOption,
    ReactiveFormsModule, NgIf, NgFor
  ]
})
export class GenreCreatePage implements OnInit {
  // listado para el select
  generos: Genero[] = [];

  // ----- Crear -----
  createLoading = false;
  createError: string | null = null;
  createSuccess: string | null = null;

  createForm = this.fb.group({
    nombre: ['', Validators.required]
  });

  // ----- Editar -----
  editLoading = false;
  editError: string | null = null;
  editSuccess: string | null = null;

  editForm = this.fb.group({
    generoId: [null as number | null, Validators.required],
    nombre: ['', Validators.required]
  });

  // ----- Eliminar -----
  deleteLoading = false;
  deleteError: string | null = null;
  deleteSuccess: string | null = null

  constructor(
    private fb: FormBuilder, 
    private api: MusicApi, 
    private router: Router,
    private alertCtrl: AlertController 
  ) {}

  ngOnInit(): void {
    this.loadGeneros();
  }
    ionViewWillEnter() {
    this.loadGeneros();
  }


  private loadGeneros() {
    this.api.getGeneros().subscribe({
      next: (gs) => this.generos = gs,
      error: () => {} // silencioso
    });
  }

  // ===== Crear =====
  submitCreate() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.createLoading = true;
    this.createError = null;
    this.createSuccess = null;

    this.api.createGenero(this.createForm.value.nombre!).subscribe({
      next: (g) => {
        this.createSuccess = 'Género creado :D';
        this.createLoading = false;
        this.createForm.reset();
        this.loadGeneros(); // refresca opciones del select para editar
      },
      error: (e) => {
        this.createError = e?.error?.error || 'Error creando género';
        this.createLoading = false;
      }
    });
  }

  get selectedGenero(): Genero | null {
    const id = this.editForm.value.generoId;
    return (id != null) ? (this.generos.find(g => g.id === id) ?? null) : null;
  }
  // cuando eligen un género del select, precargo su nombre actual
  prefillNombreDesdeSeleccion() {
    const g = this.selectedGenero;
    this.editForm.patchValue({ nombre: g?.nombre ?? '' });
  }

  // ===== Editar =====
  submitEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.editLoading = true;
    this.editError = null;
    this.editSuccess = null;

    const id = this.editForm.value.generoId!;
    const nombre = this.editForm.value.nombre!;

    this.api.updateGenero(id, nombre).subscribe({
      next: () => {
        this.editSuccess = 'Género actualizado :D';
        this.editLoading = false;
        // actualiza el array local para que el select muestre el nuevo nombre
        const idx = this.generos.findIndex(x => x.id === id);
        if (idx >= 0) this.generos[idx] = { ...this.generos[idx], nombre };
      },
      error: (e) => {
        this.editError = e?.error?.error || 'Error guardando cambios';
        this.editLoading = false;
      }
    });
  }

// ===== Eliminar =====
  private clearDeleteMsgs() {
    this.deleteError = this.deleteSuccess = null;
  }

    async confirmDeleteGenero() {
    const id = this.editForm.value.generoId;
    if (!id) {
      this.deleteError = 'Selecciona un género';
      return;
    }
    this.clearDeleteMsgs();

    const nombre = this.selectedGenero?.nombre || 'este género';
    const alert = await this.alertCtrl.create({
      header: 'Eliminar género',
      message: `¿Seguro que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.doDeleteGenero(id) }
      ]
    });
    await alert.present();
  }

  private doDeleteGenero(id: number) {
    this.deleteLoading = true;
    this.api.deleteGenero(id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.deleteSuccess = 'Género eliminado correctamente :3';
        // limpiar selección y actualizar lista
        this.editForm.patchValue({ generoId: null, nombre: '' });
        this.loadGeneros();
      },
      error: (e) => {
        this.deleteLoading = false;
        // Si el backend bloquea por relaciones (artistas/canciones asociados), aquí se verá el error
        this.deleteError = e?.error?.error || 'Error eliminando género';
      }
    });
  }
}
