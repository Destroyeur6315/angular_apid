import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../model/product.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../service/product.service';
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
  selector: 'app-product-edit',
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
    MatOptionModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;  // Formulaire réactif
  productId?: number ;  // ID du produit à modifier
  product: Product | undefined;  // Objet produit à modifier
  errorMessage: string | undefined;  // Message d'erreur

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    // Initialisation du formulaire avec des valeurs par défaut
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      unitInStock: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID du produit à partir de l'URL
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  // Charger le produit à partir de l'API
  loadProduct(): void {
    this.productService.getProduct(this.productId || 0).subscribe(
      (product) => {
        this.product = product;
        this.productForm.patchValue(product); 
      },
      (error) => {
        this.errorMessage = 'Produit non trouvé';
      }
    );
  }

  // Soumettre le formulaire pour modifier le produit
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;  // Si le formulaire est invalide, ne rien faire
    }

    // Créer un objet produit avec les nouvelles données
    const updatedProduct: Product = {
      ...this.productForm.value,
      productId: this.productId
    };

    // Appeler le service pour mettre à jour le produit
    this.productService.updateProduct(updatedProduct).subscribe(
      () => {
        // Rediriger l'utilisateur après la modification réussie
        this.router.navigate(['/product']);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du produit';
      }
    );
  }

}
