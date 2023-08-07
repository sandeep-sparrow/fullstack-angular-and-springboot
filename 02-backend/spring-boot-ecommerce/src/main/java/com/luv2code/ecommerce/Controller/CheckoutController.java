package com.luv2code.ecommerce.Controller;

import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.service.CheckoutServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    protected static final Logger logger = Logger.getLogger(CheckoutController.class.getName());

    private final CheckoutServiceImpl checkoutService;

    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponse> placeNewOrder(@RequestBody Purchase purchase){

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return new ResponseEntity<>(purchaseResponse, HttpStatus.CREATED);
    }


}
