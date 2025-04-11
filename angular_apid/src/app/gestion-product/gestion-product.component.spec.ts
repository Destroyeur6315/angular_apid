import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProductComponent } from './gestion-product.component';

describe('GestionProductComponent', () => {
  let component: GestionProductComponent;
  let fixture: ComponentFixture<GestionProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
