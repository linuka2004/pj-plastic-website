package com.pjplastic.pjplastic_backend.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderDto {
    private List<Item> products;
    private Long userId;
  
}
