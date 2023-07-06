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

  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetProductsResponse>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetProductsResponse>(searchUrl);
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

  searchProductsPaginate(thePage: number, 
                         thePageSize: number, 
                         theKeyword: string): Observable<GetProductsResponse> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetProductsResponse>(searchUrl);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetProductCategoryResponse{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
