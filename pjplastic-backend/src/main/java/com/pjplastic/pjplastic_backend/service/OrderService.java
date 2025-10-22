package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CreateOrderDto;
import com.pjplastic.pjplastic_backend.dto.OrderResponseDto;
import com.pjplastic.pjplastic_backend.dto.UpdateOrderDto;

import java.util.List;

public interface OrderService {
    List<OrderResponseDto> getAllOrders();
    OrderResponseDto getOrderById(Long id);
    OrderResponseDto createOrder(CreateOrderDto createOrderDto);
    OrderResponseDto updateOrder(Long id, UpdateOrderDto updateOrderDto);
    boolean deleteOrder(Long id);
    List<OrderResponseDto> getOrdersByUserId(Long userId);
    List<OrderResponseDto> getOrdersByProductId(Long productId);
}