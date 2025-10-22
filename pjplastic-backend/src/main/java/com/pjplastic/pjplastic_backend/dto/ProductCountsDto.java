package com.pjplastic.pjplastic_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductCountsDto {
    private Long countOfTotalProducts;
    private Long countOutOfStock;
    private Long countQtyLessThan10;
}
