package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.CartDtos;
import com.pjplastic.pjplastic_backend.entity.UserEntity;
import com.pjplastic.pjplastic_backend.repository.UserRepository;
import com.pjplastic.pjplastic_backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private Long currentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        String username = (principal instanceof UserDetails)
                ? ((UserDetails) principal).getUsername()
                : String.valueOf(principal);
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<CartDtos.CartResponse> getCart(Authentication authentication) {
        Long userId = currentUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(cartService.getCartForUser(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDtos.CartResponse> addItem(
            Authentication authentication,
            @RequestBody CartDtos.UpdateItemRequest req
    ) {
        Long userId = currentUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        if (req == null || req.productId == null) return ResponseEntity.badRequest().build();
        Integer qty = (req.quantity == null || req.quantity <= 0) ? 1 : req.quantity;
        return ResponseEntity.ok(cartService.addItem(userId, req.productId, qty));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartDtos.CartResponse> updateItem(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> body
    ) {
        Long userId = currentUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        Integer quantity = body != null ? body.getOrDefault("quantity", 0) : 0;
        return ResponseEntity.ok(cartService.updateItem(userId, productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartDtos.CartResponse> removeItem(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        Long userId = currentUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(Authentication authentication) {
        Long userId = currentUserId(authentication);
        if (userId == null) return ResponseEntity.status(401).build();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
