import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistCreatePage } from './artist-create.page';

describe('ArtistCreatePage', () => {
  let component: ArtistCreatePage;
  let fixture: ComponentFixture<ArtistCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
