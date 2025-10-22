package com.pjplastic.pjplastic_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CartDetails {
    private Long id;
    private LocalDateTime cartTime;
    private String name;
    private Double total;
    private String fullName;

    public CartDetails(Long id, LocalDateTime cartTime, String name, Double total, String fullName) {
        this.id = id;
        this.cartTime = cartTime;
        this.name = name;
        this.total = total;
        this.fullName = fullName;
    }
}
