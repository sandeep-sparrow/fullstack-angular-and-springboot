import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    // whitespace validation
    static notOnlyWhiteSpaces(control: FormControl) : ValidationErrors | null {

        if((control.value != null) && (control.value.trim().length === 0)){
            return { 'notOnlyWhitespaces': true};
        }
        else{
            return null;
        }
    }
}
