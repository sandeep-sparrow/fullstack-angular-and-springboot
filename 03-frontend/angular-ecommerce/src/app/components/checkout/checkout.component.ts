import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  copyShippingAddressToBillingAddress(event: Event){
     
    const ischecked = (<HTMLInputElement>event.target).checked;
    if(ischecked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit(){
    console.log("Handling the subit buttin");
    console.log("Customer information: " + this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("Shipping address information: " + this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log("Billing address information: " + this.checkoutFormGroup.get('billingAddress')?.value);
    console.log("Credit card information:" + this.checkoutFormGroup.get('creditCard ')?.value);
  }

}
