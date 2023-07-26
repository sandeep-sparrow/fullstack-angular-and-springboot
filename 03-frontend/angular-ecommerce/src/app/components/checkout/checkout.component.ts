import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

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

  states: String[] = 
  ["Andhra Pradesh",
   "Arunachal Pradesh",
   "Assam",
   "Bihar",
   "Chhattisgarh",
   "Goa",
   "Gujarat",
   "Haryana",
   "Himachal Pradesh",
   "Jammu and Kashmir",
   "Jharkhand",
   "Karnataka",
   "Kerala",
   "Madhya Pradesh",
   "Maharashtra",
   "Manipur",
   "Meghalaya",
   "Mizoram",
   "Nagaland",
   "Odisha",
   "Punjab",
   "Rajasthan",
   "Sikkim",
   "Tamil Nadu",
   "Telangana",
   "Tripura",
   "Uttarakhand",
   "Uttar Pradesh",
   "West Bengal",
   "Andaman and Nicobar Islands",
   "Chandigarh",
   "Dadra and Nagar Haveli",
   "Daman and Diu",
   "Delhi",
   "Lakshadweep",
   "Puducherry"];

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2CodeFormService: Luv2ShopFormService){}

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

    // populate the credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Current month: " + startMonth);

    this.luv2CodeFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    // populate the credit card years
    this.luv2CodeFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
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
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
  }

}
