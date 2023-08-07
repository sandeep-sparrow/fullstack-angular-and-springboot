import { Injectable, OnInit } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {

  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  ngOnInit(): void { }

  addToCart(theCartItem: CartItem){
    
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
    // find the item in the cart based on the item id

    /* Old code refactored at line: 37
    for(let tempCartItem of this.cartItems){
      if(tempCartItem.id === theCartItem.id){
        existingCartItem = tempCartItem;
        break;
      }
    }
    */

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;
      // check we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }

    if(!alreadyExistsInCart){
      this.cartItems.push(theCartItem);
    }
    
    this.computeCartTotal();
  }

  computeCartTotal() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values... all subscriber will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log(`contents of cart`);

    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name}, 
                   quantity=${tempCartItem.quantity}, 
                   unitPrice=${tempCartItem.unitPrice}, 
                   subTotalPrice=${subTotalPrice}`)

      console.log(`totalPrice: ${totalPriceValue.toFixed(2)},
                   totalQuantity: ${totalQuantityValue}`);
      console.log(`---`);
    }
  }

  remove(cartItem: CartItem) {
    // get the index of item in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => cartItem.id == tempCartItem.id);

    // if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
    }
  }

}
