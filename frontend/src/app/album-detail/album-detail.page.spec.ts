import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumDetailPage } from './album-detail.page';

describe('AlbumDetailPage', () => {
  let component: AlbumDetailPage;
  let fixture: ComponentFixture<AlbumDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
