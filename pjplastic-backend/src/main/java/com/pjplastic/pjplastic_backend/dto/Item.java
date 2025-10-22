package com.pjplastic.pjplastic_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Item {
    private Long productId;
    private int quantity;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
