import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  previousKeyword: string = "";

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 100;

  constructor(private productService: ProductService, 
              private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    console.log(this.route.snapshot);
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log("Search mode:" + this.searchMode);
    if(this.searchMode){
      this.handleSearchProduct();
    }else{
      this.handleListProduct();
    }
  }

  handleSearchProduct() {
    const theSearchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have different keyword then previous one we set the page to 1
    if(this.previousKeyword != theSearchKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theSearchKeyword;

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theSearchKeyword).subscribe(this.processResult());
  }

  handleListProduct(){
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId = 1;
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber -1, 
                                               this.thePageSize, 
                                               this.currentCategoryId).subscribe(this.processResult());
  }

  updatePageSize(thePageSize: string) {
    this.thePageSize = +thePageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products,
      this.thePageNumber = data.page.number + 1,
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

}
