package com.pjplastic.pjplastic_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderProductDto {
    private String product;
    private Integer qty;
    private Double price;


}
