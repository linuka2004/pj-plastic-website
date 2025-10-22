package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.CreateOrderDto;
import com.pjplastic.pjplastic_backend.dto.OrderResponseDto;
import com.pjplastic.pjplastic_backend.dto.UpdateOrderDto;
import com.pjplastic.pjplastic_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        try {
            List<OrderResponseDto> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderDto createOrderDto) {
        try {
            OrderResponseDto createdOrder = orderService.createOrder(createOrderDto);
            return ResponseEntity.status(201).body(createdOrder);
        } catch (RuntimeException e) {
            // Surface validation/availability errors to client
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Failed to create order"));
        }
    }

    // Lightweight endpoint to verify that authentication works for orders
    @GetMapping("/auth-check")
    public ResponseEntity<?> authCheck(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(java.util.Map.of("status", "unauthenticated"));
        }
        return ResponseEntity.ok(java.util.Map.of(
                "status", "ok",
                "principal", auth.getName(),
                "authorities", auth.getAuthorities()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            OrderResponseDto order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Order not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Failed to fetch order"));
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody UpdateOrderDto updateOrderDto) {
        try {
            OrderResponseDto updatedOrder = orderService.updateOrder(id, updateOrderDto);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Order not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Product not found") || e.getMessage().contains("User not found")) {
                return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
            } else {
                return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Failed to update order"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            boolean deleted = orderService.deleteOrder(id);
            
            if (deleted) {
                return ResponseEntity.ok("Order deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Order not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(500).body("Failed to delete order: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete order: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable Long userId) {
        try {
            List<OrderResponseDto> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Failed to fetch user orders"));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getOrdersByProductId(@PathVariable Long productId) {
        try {
            List<OrderResponseDto> orders = orderService.getOrdersByProductId(productId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Failed to fetch product orders"));
        }
    }
}
