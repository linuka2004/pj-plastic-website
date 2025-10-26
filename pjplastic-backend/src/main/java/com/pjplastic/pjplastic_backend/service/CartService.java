package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CartDtos;

public interface CartService {
    CartDtos.CartResponse getCartForUser(Long userId);
    CartDtos.CartResponse addItem(Long userId, Long productId, Integer quantity);
    CartDtos.CartResponse updateItem(Long userId, Long productId, Integer quantity);
    CartDtos.CartResponse removeItem(Long userId, Long productId);
    void clearCart(Long userId);
}
