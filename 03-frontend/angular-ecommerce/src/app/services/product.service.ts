import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { Product } from '../common/product';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient)
  { }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetProductCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProduct(theSearchKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theSearchKeyword}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetProductsResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  
}

interface GetProductsResponse{
  _embedded: {
    products: Product[];
  }
}

interface GetProductCategoryResponse{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
