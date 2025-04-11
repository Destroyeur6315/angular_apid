import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-gestion-product',
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
    MatDialogModule],
  templateUrl: './gestion-product.component.html',
  styleUrl: './gestion-product.component.scss'
})
export class GestionProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchControl = new FormControl('');
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();

    // Ecoute la recherche
    this.searchControl.valueChanges.pipe(
      debounceTime(300) // attendre 300ms après que l'utilisateur tape
    ).subscribe(searchText => {
      this.filteredProducts = this.filterProducts(searchText || '');
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterProducts(searchText: string): Product[] {
    if (!searchText) {
      return this.products;
    }

    const lowerText = searchText.toLowerCase();

    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerText) ||
      product.description.toLowerCase().includes(lowerText)
    );
  }

  deleteProduct(id: number): void {
    console.log ("id à supprimer : ", id);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.productId !== id);
          this.filteredProducts = this.filteredProducts.filter(p => p.productId !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du produit';
          console.error(err);
        }
      });
    }
  }

  modifProduct(id:number): void {
    this.router.navigate(['/product/', id, 'edit']);
  }

}