import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'artistas/:id',
    loadComponent: () => import('./artist-detail/artist-detail.page').then( m => m.ArtistDetailPage)
  },
  {
    path: 'albums/:id',
    loadComponent: () => import('./album-detail/album-detail.page').then( m => m.AlbumDetailPage)
  },
  {
    path: 'generos/:id',
    loadComponent: () => import('./genre-detail/genre-detail.page').then( m => m.GenreDetailPage)
  },
  {
    path: 'nuevo-genero',
    loadComponent: () => import('./genre-create/genre-create.page').then( m => m.GenreCreatePage)
  },
  {
    path: 'nuevo-artista',
    loadComponent: () => import('./artist-create/artist-create.page').then( m => m.ArtistCreatePage)
  },
  {
    path: 'artistas/:id/nuevo-album',
    loadComponent: () => import('./album-create/album-create.page').then( m => m.AlbumCreatePage)
  },
  {
    path: 'canciones/:id/nueva-cancion',
    loadComponent: () => import('./cancion-create/cancion-create.page').then( m => m.CancionCreatePage)
  },

  
];
