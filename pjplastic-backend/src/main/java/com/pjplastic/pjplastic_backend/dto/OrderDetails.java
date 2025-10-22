package com.pjplastic.pjplastic_backend.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class OrderDetails {
    private Long id;
    private LocalDateTime orderTime;
    private String name;
    private Double total;
    private String fullName;

    public OrderDetails(Long id, LocalDateTime orderTime, String name, Double total, String fullName) {
        this.id = id;
        this.orderTime = orderTime;
        this.name = name;
        this.total = total;
        this.fullName = fullName;
    }

}
