package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CreateCartDto;
import com.pjplastic.pjplastic_backend.dto.CartResponseDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCartDto;

import java.util.List;

public interface CartService {
    List<CartResponseDto> getAllCarts();
    CartResponseDto getCartById(Long id);
    CartResponseDto createCart(CreateCartDto createCartDto);
    CartResponseDto updateCart(Long id, UpdateCartDto updateCartDto);
    boolean deleteCart(Long id);
    List<CartResponseDto> getCartsByUserId(Long userId);
    List<CartResponseDto> getCartsByProductId(Long productId);
}