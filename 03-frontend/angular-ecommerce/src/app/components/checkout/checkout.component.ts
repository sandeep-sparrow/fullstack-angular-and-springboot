import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // add support for reactive forms - app.modules.ts under imports sections
  // define form here

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2CodeFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router){}

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        Luv2ShopValidators.notOnlyWhiteSpaces]),
        lastName: new FormControl('', [Validators.required, 
                                       Validators.minLength(2), 
                                       Luv2ShopValidators.notOnlyWhiteSpaces]),
        email: new FormControl('',
         [Validators.required, 
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), 
          Luv2ShopValidators.notOnlyWhiteSpaces])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, 
                                     Validators.minLength(2), 
                                     Luv2ShopValidators.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, 
                                   Validators.minLength(2), 
                                   Luv2ShopValidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpaces])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, 
                                     Validators.minLength(2), 
                                     Luv2ShopValidators.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, 
                                   Validators.minLength(2), 
                                   Luv2ShopValidators.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpaces])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required,
                                        Validators.minLength(2),
                                        Luv2ShopValidators.notOnlyWhiteSpaces]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate the credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Current month: " + startMonth);

    this.luv2CodeFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    // populate the credit card years
    this.luv2CodeFormService.getCreditCardYears().subscribe(
      data => {
        // console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    // populate the countries
    this.luv2CodeFormService.getCountries().subscribe(
      data => {
        // console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

    this.reviewCartDetails();
  }

  reviewCartDetails() {

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: Event){
     
    const ischecked = (<HTMLInputElement>event.target).checked;
    if(ischecked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = []
    }
  }

  onSubmit(){

    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log("The Shipping Address Country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The Shipping Address State is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log("The Billing Address Country is " + this.checkoutFormGroup.get('billingAddress')?.value.country.name);
    console.log("The Billing Address State is " + this.checkoutFormGroup.get('billingAddress')?.value.state.name);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart item
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping Address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing Address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billinhCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billinhCountry.name;

    // populate purchase - order and order Items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via checkout Service
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your Order has been recived .\n Order Tracking number: ${response.orderTrackingNumber}`)

          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an erro: ${err.message}`);
        }
      }
    );

  }

  resetCart() {
    
    // reset the cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form data
    this.checkoutFormGroup.reset();

    // navigate back to the forms page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // check if the current year equals the selected year, the start with current month
    let startMonth: number;
    if(selectedYear === currentYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.luv2CodeFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2CodeFormService.getStates(countryCode).subscribe(
      data => {
        // console.log("Retrieved states: " + JSON.stringify(data));
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }
        // select the first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

}
