package com.pjplastic.pjplastic_backend.service.impl;

import com.pjplastic.pjplastic_backend.dto.CreateOrderDto;
import com.pjplastic.pjplastic_backend.dto.Item;
import com.pjplastic.pjplastic_backend.dto.OrderItemResponseDto;
import com.pjplastic.pjplastic_backend.dto.OrderResponseDto;
import com.pjplastic.pjplastic_backend.dto.UpdateOrderDto;
import com.pjplastic.pjplastic_backend.entity.OrderEntity;
import com.pjplastic.pjplastic_backend.entity.OrderItemEntity;
import com.pjplastic.pjplastic_backend.entity.ProductEntity;
import com.pjplastic.pjplastic_backend.repository.UserRepository;
import com.pjplastic.pjplastic_backend.repository.OrderItemRepository;
import com.pjplastic.pjplastic_backend.repository.OrderRepository;
import com.pjplastic.pjplastic_backend.repository.ProductRepository;
import com.pjplastic.pjplastic_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Helper method to convert OrderEntity to OrderResponseDto
    private OrderResponseDto convertToOrderResponseDto(OrderEntity order) {
        List<OrderItemEntity> orderItems = orderItemRepository.findByOrderId(order.getId());
    List<OrderItemResponseDto> itemDtos = orderItems.stream()
                .map(item -> new OrderItemResponseDto(item.getId(), item.getProductId(), item.getQuantity()))
                .collect(Collectors.toList());
    
    return new OrderResponseDto(
                order.getId(),
                order.getOrderName(),
                order.getOrderDate(),
                order.getDeliveryDate(),
        order.getUserId(),
        order.getSenderName(),
        order.getSenderMobile(),
        order.getDeliveryAddress(),
        order.getStatus(),
        order.getSubtotal(),
        order.getTax(),
        order.getTotal(),
        order.getPaymentMethod(),
                itemDtos
        );
    }

    // Helper method to verify product availability
    private void verifyProductAvailability(List<Item> items) {
        for (Item item : items) {
            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            Integer availableQty = product.getQty();
            if (availableQty == null || availableQty < item.getQuantity()) {
                throw new RuntimeException("Insufficient quantity for product '" + product.getName() + 
                        "' (ID: " + item.getProductId() + "). Available: " + 
                        (availableQty == null ? 0 : availableQty) + ", Requested: " + item.getQuantity());
            }
        }
    }

    // Reduce product quantities
    private void reduceProductQuantities(List<Item> items) {
        for (Item item : items) {
            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            int currentQty = product.getQty() == null ? 0 : product.getQty();
            product.setQty(currentQty - item.getQuantity());
            productRepository.save(product);
        }
    }

    // Restore product quantities
    private void restoreProductQuantities(List<Item> items) {
        for (Item item : items) {
            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            int currentQty = product.getQty() == null ? 0 : product.getQty();
            product.setQty(currentQty + item.getQuantity());
            productRepository.save(product);
        }
    }

    @Override
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToOrderResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDto getOrderById(Long id) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToOrderResponseDto(order);
    }

    @Override
    @Transactional
    public OrderResponseDto createOrder(CreateOrderDto createOrderDto) {
        // Prefer deriving the user from the authenticated JWT principal; if not present, fall back to DTO.userId
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;
        if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
            String username = auth.getName();
            userId = userRepository.findByUsername(username)
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
        } else if (createOrderDto.getUserId() != null) {
            Long dtoUserId = createOrderDto.getUserId();
            boolean exists = userRepository.existsById(dtoUserId);
            if (!exists) {
                throw new RuntimeException("User not found with id: " + dtoUserId);
            }
            userId = dtoUserId;
        } else {
            throw new RuntimeException("Login required or provide a valid userId");
        }
        
        // Validate order must contain at least one item
        if (createOrderDto.getItems() == null || createOrderDto.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }
        
        // Verify all products exist and have sufficient quantities
        verifyProductAvailability(createOrderDto.getItems());
        
        // Reduce product quantities from inventory
        reduceProductQuantities(createOrderDto.getItems());
        
    // Create the order
        OrderEntity order = new OrderEntity();
        order.setOrderName(createOrderDto.getOrderName());
        order.setOrderDate(createOrderDto.getOrderDate());
    order.setDeliveryDate(createOrderDto.getDeliveryDate());
    order.setUserId(userId);
    // Legacy schema support: set customer_id same as user_id if present
    order.setCustomerId(userId);
    order.setSenderName(createOrderDto.getSenderName());
    order.setSenderMobile(createOrderDto.getSenderMobile());
    order.setDeliveryAddress(createOrderDto.getDeliveryAddress());
    order.setPaymentMethod(createOrderDto.getPaymentMethod());

    // Compute totals from items and product prices
    double subtotal = 0.0;
    for (Item item : createOrderDto.getItems()) {
        ProductEntity product = productRepository.findById(item.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
        double price = product.getPrice() == null ? 0.0 : product.getPrice();
        subtotal += price * item.getQuantity();
    }
    double tax = subtotal * 0.10; // 10% tax to mirror UI
    double total = subtotal + tax;
    order.setSubtotal(subtotal);
    order.setTax(tax);
    order.setTotal(total);
    String method = createOrderDto.getPaymentMethod();
    String status = (method != null && method.equalsIgnoreCase("online")) ? "payment_pending" : "confirmed";
    order.setStatus(status);
        
        OrderEntity savedOrder = orderRepository.save(order);
        
        // Create order items
        for (Item item : createOrderDto.getItems()) {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(item.getProductId());
            orderItem.setQuantity(item.getQuantity());
            
            orderItemRepository.save(orderItem);
        }
        
        return convertToOrderResponseDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrder(Long id, UpdateOrderDto updateOrderDto) {

        OrderEntity existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        if (updateOrderDto.getOrderName() != null) {
            existing.setOrderName(updateOrderDto.getOrderName());
        }
        if (updateOrderDto.getOrderDate() != null) {
            existing.setOrderDate(updateOrderDto.getOrderDate());
        }
        if (updateOrderDto.getDeliveryDate() != null) {
            existing.setDeliveryDate(updateOrderDto.getDeliveryDate());
        }
        if (updateOrderDto.getUserId() != null) {
            if (!userRepository.existsById(updateOrderDto.getUserId())) {
                throw new RuntimeException("User not found with id: " + updateOrderDto.getUserId());
            }
            existing.setUserId(updateOrderDto.getUserId());
        }
        if (updateOrderDto.getSenderName() != null) {
            existing.setSenderName(updateOrderDto.getSenderName());
        }
        if (updateOrderDto.getSenderMobile() != null) {
            existing.setSenderMobile(updateOrderDto.getSenderMobile());
        }
        if (updateOrderDto.getDeliveryAddress() != null) {
            existing.setDeliveryAddress(updateOrderDto.getDeliveryAddress());
        }
        if (updateOrderDto.getStatus() != null) {
            existing.setStatus(updateOrderDto.getStatus());
        }
        
        // Update order items if provided
        if (updateOrderDto.getItems() != null) {
            // Get existing order items to restore their quantities
            List<OrderItemEntity> existingOrderItems = orderItemRepository.findByOrderId(id);
            List<Item> existingItems = existingOrderItems.stream()
                    .map(item -> {
                        Item dto = new Item();
                        dto.setProductId(item.getProductId());
                        dto.setQuantity(item.getQuantity());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            // Restore quantities from existing order items back to inventory
            if (!existingItems.isEmpty()) {
                restoreProductQuantities(existingItems);
            }
            
            // Verify new quantities are available
            verifyProductAvailability(updateOrderDto.getItems());
            
            // Reduce new quantities from inventory
            reduceProductQuantities(updateOrderDto.getItems());
            
            // Delete existing order items
            orderItemRepository.deleteByOrderId(id);
            
            // Create new order items
            for (Item item : updateOrderDto.getItems()) {
                OrderItemEntity orderItem = new OrderItemEntity();
                orderItem.setOrderId(id);
                orderItem.setProductId(item.getProductId());
                orderItem.setQuantity(item.getQuantity());
                
                orderItemRepository.save(orderItem);
            }
        }
        if (updateOrderDto.getPaymentMethod() != null) {
            existing.setPaymentMethod(updateOrderDto.getPaymentMethod());
        }
        
        OrderEntity updatedOrder = orderRepository.save(existing);
        return convertToOrderResponseDto(updatedOrder);
    }

    @Override
    @Transactional
    public boolean deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        
        try {
            // Get existing order items to restore their quantities
            List<OrderItemEntity> existingOrderItems = orderItemRepository.findByOrderId(id);
            List<Item> existingItems = existingOrderItems.stream()
                    .map(item -> {
                        Item dto = new Item();
                        dto.setProductId(item.getProductId());
                        dto.setQuantity(item.getQuantity());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            // Restore quantities back to inventory before deleting
            if (!existingItems.isEmpty()) {
                restoreProductQuantities(existingItems);
            }
            
            // Delete order items first
            orderItemRepository.deleteByOrderId(id);
            // Then delete the order
            orderRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete order with id " + id + ": " + e.getMessage(), e);
        }
    }

    @Override
    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToOrderResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDto> getOrdersByProductId(Long productId) {
        return orderRepository.findByProductId(productId).stream()
                .map(this::convertToOrderResponseDto)
                .collect(Collectors.toList());
    }
}

