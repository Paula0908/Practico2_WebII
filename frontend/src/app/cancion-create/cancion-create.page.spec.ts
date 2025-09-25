import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancionCreatePage } from './cancion-create.page';

describe('CancionCreatePage', () => {
  let component: CancionCreatePage;
  let fixture: ComponentFixture<CancionCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
