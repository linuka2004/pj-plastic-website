package com.pjplastic.pjplastic_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@ToString
@Table(name = "cart")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cart_name", nullable = false)
    private String cartName;

    @Column(name = "cart_date", nullable = false)
    private LocalDate cartDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Long getId() {
        return id;
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
}
