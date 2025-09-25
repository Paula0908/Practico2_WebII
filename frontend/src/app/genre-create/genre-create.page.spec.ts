import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenreCreatePage } from './genre-create.page';

describe('GenreCreatePage', () => {
  let component: GenreCreatePage;
  let fixture: ComponentFixture<GenreCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
