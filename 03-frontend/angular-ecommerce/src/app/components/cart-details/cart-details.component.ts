import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartSerivce: CartService){}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to the cartItems
    this.cartItems = this.cartSerivce.cartItems;

    // subs to the cart totalPrice
    this.cartSerivce.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // sub to the cart totalQuantity
    this.cartSerivce.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute the total price and quantity
    this.cartSerivce.computeCartTotal();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartSerivce.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem) {

    cartItem.quantity--;

    if(cartItem.quantity === 0){
      this.cartSerivce.remove(cartItem)
    }else{
      this.cartSerivce.computeCartTotal();
    }
  }
}
