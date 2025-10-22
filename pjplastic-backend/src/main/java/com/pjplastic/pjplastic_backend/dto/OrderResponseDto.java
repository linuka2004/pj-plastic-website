package com.pjplastic.pjplastic_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderResponseDto {
    private Long id;
    private String orderName;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private Long userId;
    private String senderName;
    private String senderMobile;
    private String deliveryAddress;
    private String status;
    private Double subtotal;
    private Double tax;
    private Double total;
    private String paymentMethod;
    private List<OrderItemResponseDto> items;

    // Constructors
    public OrderResponseDto() {}

    public OrderResponseDto(Long id, String orderName, LocalDate orderDate, LocalDate deliveryDate, Long userId, String senderName, String senderMobile, String deliveryAddress, String status, Double subtotal, Double tax, Double total, String paymentMethod, List<OrderItemResponseDto> items) {
        this.id = id;
        this.orderName = orderName;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.userId = userId;
        this.senderName = senderName;
        this.senderMobile = senderMobile;
        this.deliveryAddress = deliveryAddress;
        this.status = status;
        this.subtotal = subtotal;
        this.tax = tax;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.items = items;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
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

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getSenderMobile() { return senderMobile; }
    public void setSenderMobile(String senderMobile) { this.senderMobile = senderMobile; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<OrderItemResponseDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponseDto> items) {
        this.items = items;
    }
}
