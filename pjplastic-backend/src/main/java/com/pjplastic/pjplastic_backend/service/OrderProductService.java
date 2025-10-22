package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.OrderProductDto;

import java.util.List;

public interface OrderProductService {
    List<OrderProductDto> loadOrderProductDetails(Long orderId);

}
