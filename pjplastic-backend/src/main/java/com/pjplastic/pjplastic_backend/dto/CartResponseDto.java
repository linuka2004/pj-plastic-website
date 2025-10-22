package com.pjplastic.pjplastic_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CartResponseDto {
    private Long id;
    private String cartName;
    private LocalDate cartDate;
    private LocalDate deliveryDate;
    private Long userId;
    private List<CartItemResponseDto> items;

    // Constructors
    public CartResponseDto() {}

    public CartResponseDto(Long id, String cartName, LocalDate cartDate, LocalDate deliveryDate, Long userId, List<CartItemResponseDto> items) {
        this.id = id;
        this.cartName = cartName;
        this.cartDate = cartDate;
        this.deliveryDate = deliveryDate;
        this.userId = userId;
        this.items = items;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCartName() {
        return cartName;
    }

    public void setCartName(String cartName) {
        this.cartName = cartName;
    }

    public LocalDate getCartDate() {
        return cartDate;
    }

    public void setCartDate(LocalDate cartDate) {
        this.cartDate = cartDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemResponseDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponseDto> items) {
        this.items = items;
    }
}
