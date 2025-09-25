// src/app/services/music-api.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface SearchResponse {
  artistas: Artista[];
  generos: Genero[];
  albums:  Album[];
  canciones: Cancion[];
}

@Injectable({ providedIn: 'root' })
export class MusicApi {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000';

  getCancionById(id: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.base}/canciones/${id}`);
  }

  //home page
  getArtistas(): Observable<Artista[]> { return this.http.get<Artista[]>(`${this.base}/artistas`); }
  getGeneros(): Observable<Genero[]> { return this.http.get<Genero[]>(`${this.base}/generos`); }

  searchAll(q: string, limit = 30): Observable<SearchResults> {
    const params = new HttpParams().set('q', q).set('limit', String(limit));
    return this.http
      .get<{ q: string; limit: number; resultados: SearchResults }>(`${this.base}/search`, { params })
      .pipe(map(res => res.resultados));
  }
  //artist detail page
  getArtistaById(id: number): Observable<Artista> {
  return this.http.get<Artista>(`${this.base}/artistas/${id}`);

}
  getAlbumsByArtista(artistaId: number): Observable<Album[]> {
    // requiere endpoint GET /artistas/:id/albums
    return this.http.get<Album[]>(`${this.base}/artistas/${artistaId}/albums`);
  }
  getAlbumById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.base}/albums/${id}`);
  }
  getCancionesByAlbum(albumId: number): Observable<Cancion[]> {
    // requiere endpoint GET /albums/:id/canciones
    return this.http.get<Cancion[]>(`${this.base}/albums/${albumId}/canciones`);
  }

  //genre detail page
  getGeneroById(id: number): Observable<Genero> {
  return this.http.get<Genero>(`${this.base}/generos/${id}`);
}

getArtistasByGenero(id: number): Observable<Artista[]> {
  return this.http.get<Artista[]>(`${this.base}/generos/${id}/artistas`);
}

  //create artista y genero
  createArtista(data: { nombre: string; descripcion?: string }, imagen?: File) {
  const fd = new FormData();
  fd.append('nombre', data.nombre);
  if (data.descripcion) fd.append('descripcion', data.descripcion);
  if (imagen) fd.append('imagen', imagen);
  return this.http.post<Artista>(`${this.base}/artistas`, fd);
  }

  createGenero(nombre: string) {
    return this.http.post<Genero>(`${this.base}/generos`, { nombre });
  }


  updateGenero(id: number, nombre: string) {
    return this.http.put<Genero>(`${this.base}/generos/${id}`, { nombre });
  }

  updateArtistaInfo(id: number, data: { nombre?: string; descripcion?: string }) {
  return this.http.patch<Artista>(`${this.base}/artistas/${id}`, data);
  }

  updateArtistaImagen(id: number, imagen: File) {
    const fd = new FormData();
    fd.append('imagen', imagen); // <-- el backend espera campo 'imagen'
    return this.http
      .post<{ artista: Artista }>(`${this.base}/artistas/${id}/imagen`, fd) // <-- POST (no PATCH)
      .pipe(map(r => r.artista));

  }
  putArtistaGeneros(artistaId: number, ids: number[]) {
    return this.http.put<Genero[]>(`${this.base}/artistas/${artistaId}/generos`, { ids });
  }
  addGeneroAArtista(artistaId: number, generoId: number) {
    return this.http.post(`${this.base}/artistas/${artistaId}/generos`, { generoId });
  }
  removeGeneroDeArtista(artistaId: number, generoId: number) {
    return this.http.delete(`${this.base}/artistas/${artistaId}/generos/${generoId}`);
  }
  deleteArtista(id: number) {
  return this.http.delete<{ message: string }>(`${this.base}/artistas/${id}`);
  }
  deleteGenero(id: number) {
  return this.http.delete<{ message: string }>(`${this.base}/generos/${id}`);
  }



  //create album
  createAlbum(data: { nombre: string; artistaId: number }, imagen?: File) {
  const fd = new FormData();
  fd.append('nombre', data.nombre);
  fd.append('artistaId', String(data.artistaId));
  if (imagen) fd.append('imagen', imagen);

  return this.http
    .post<any>(`${this.base}/albums`, fd)
    .pipe(map(r => r?.album ?? r as Album));
  }

  updateAlbum(id: number, data: UpdateAlbumDTO) {
    return this.http.patch<Album>(`${this.base}/albums/${id}`, data);
  }

  updateAlbumImage(id: number, imagen: File) {
    const fd = new FormData();
    fd.append('imagen', imagen);
    // el backend puede devolver { album } o el álbum plano
    return this.http.post<any>(`${this.base}/albums/${id}/imagen`, fd).pipe(map(r => r?.album ?? r as Album));
  }


  // src/app/services/music-api.ts
  deleteAlbum(id: number) {
    return this.http.delete<{ message: string }>(`${this.base}/albums/${id}`);
  }



  //create cancion
    createCancion(
    data: { nombre: string; albumId: number },
    archivoAudio: File,              // obligatorio
    imagen?: File                    // opcional
  ) {
    const fd = new FormData();
    fd.append('nombre', data.nombre);
    fd.append('albumId', String(data.albumId));
    fd.append('archivo', archivoAudio);
    if (imagen) fd.append('imagen', imagen);
    return this.http.post<Cancion>(`${this.base}/canciones`, fd);
  }

  updateCancion(id: number, body: { nombre?: string; albumId?: number }) {
    return this.http.patch<Cancion>(`${this.base}/canciones/${id}`, body);
  }

  updateCancionImage(id: number, imagen: File) {
    const fd = new FormData();
    fd.append('imagen', imagen);
    return this.http.post<{ cancion: Cancion }>(`${this.base}/canciones/${id}/imagen`, fd);
  }

  updateCancionArchivo(id: number, archivo: File) {
    const fd = new FormData();
    fd.append('archivo', archivo);
    return this.http.post<{ cancion: Cancion }>(`${this.base}/canciones/${id}/archivo`, fd);
  }

  // src/app/services/music-api.ts
  deleteCancion(id: number) {
    return this.http.delete<{ message: string }>(`${this.base}/canciones/${id}`);
  }




}

export interface Artista { 
  id:number; 
  nombre:string;
  imagen: string;
  descripcion?:string|null; 
  imagenUrl?:string; 
  generos?: Genero[]; 
}

export interface Genero { 
  id:number; 
  nombre:string; 
}
export interface UpdateArtistaDTO { 
  nombre?: string; 
  descripcion?: string; 
}
export interface UpdateGeneroDTO  { 
  nombre?: string; 
}

export interface Album  { 
  id:number; 
  nombre:string; 
  imagen: string;
  imagenUrl?:string; 
  artistaId:number; 
}

export interface UpdateAlbumDTO { 
  nombre?: string; 
  artistaId?: number; 
}

export interface Cancion{ 
  id:number; 
  nombre:string;
  imagen: string;
  archivo: string; 
  imagenUrl?:string; 
  archivoUrl?:string; 
  albumId:number; 
}

export interface SearchResults {
  artistas: Artista[];
  generos: Genero[];
  albums: Album[];
  canciones: Cancion[];
}
