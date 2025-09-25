import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumCreatePage } from './album-create.page';

describe('AlbumCreatePage', () => {
  let component: AlbumCreatePage;
  let fixture: ComponentFixture<AlbumCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
