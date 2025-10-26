package com.pjplastic.pjplastic_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDtos {
    public static class CartItem {
        public Long productId;
        public String name;
        public Double price;
        public Integer quantity;
    }

    public static class CartResponse {
        public Long id;
        public Long userId;
        public List<CartItem> items = new ArrayList<>();
        public Double subtotal;
    }

    public static class UpdateItemRequest {
        public Long productId;
        public Integer quantity; // if <=0 then remove
    }
}
