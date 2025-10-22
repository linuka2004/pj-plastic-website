package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.CreateCartDto;
import com.pjplastic.pjplastic_backend.dto.CartResponseDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCartDto;
import com.pjplastic.pjplastic_backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartResponseDto>> getAllcarts() {
        try {
            List<CartResponseDto> carts = cartService.getAllcarts();
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(@RequestBody CreateCartDto createCartDto) {
        try {
            CartResponseDto createdCart = cartService.createCart(createCartDto);
            return ResponseEntity.status(201).body(createdOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartResponseDto> getCartById(@PathVariable Long id) {
        try {
            CartResponseDto cart = cartService.getCartById(id);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Cart not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(400).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<CartResponseDto> updateCart(@PathVariable Long id, @RequestBody UpdateCartDto updateCartDto) {
        try {
            CartResponseDto updatedCart = cartService.updateCart(id, updateCartDto);
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Cart not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Product not found") || e.getMessage().contains("User not found")) {
                return ResponseEntity.status(400).body(null);
            } else {
                return ResponseEntity.status(400).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable Long id) {
        try {
            boolean deleted = cartService.deleteCart(id);
            
            if (deleted) {
                return ResponseEntity.ok("Cart deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Cart not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(500).body("Failed to delete cart: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete cart: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartResponseDto>> getCartsByUserId(@PathVariable Long userId) {
        try {
            List<CartResponseDto> carts = cartService.getCartsByUserId(userId);
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CartResponseDto>> getCartsByProductId(@PathVariable Long productId) {
        try {
            List<CartResponseDto> carts = cartService.getCartsByProductId(productId);
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
