import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-product-form',
  imports: [
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du produit';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;
    this.loading = true;

    if (this.isEditMode && this.productId) {
      product.productId = this.productId;
      this.productService.updateProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/product']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour du produit';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.productService.addProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/product']);
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'ajout du produit';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
