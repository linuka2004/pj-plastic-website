package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CartProductDto;

import java.util.List;

public interface CartProductService {
    List<CartProductDto> loadCartProductDetails(Long cartId);

}
