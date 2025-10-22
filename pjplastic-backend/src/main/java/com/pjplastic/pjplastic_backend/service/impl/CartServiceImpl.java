package com.pjplastic.pjplastic_backend.service.impl;

import com.pjplastic.pjplastic_backend.dto.CreateCartDto;
import com.pjplastic.pjplastic_backend.dto.Item;
import com.pjplastic.pjplastic_backend.dto.CartItemResponseDto;
import com.pjplastic.pjplastic_backend.dto.CartResponseDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCartDto;
import com.pjplastic.pjplastic_backend.entity.CartEntity;
import com.pjplastic.pjplastic_backend.entity.CartItemEntity;
import com.pjplastic.pjplastic_backend.entity.ProductEntity;
import com.pjplastic.pjplastic_backend.repository.UserRepository;
import com.pjplastic.pjplastic_backend.repository.CartItemRepository;
import com.pjplastic.pjplastic_backend.repository.CartRepository;
import com.pjplastic.pjplastic_backend.repository.ProductRepository;
import com.pjplastic.pjplastic_backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Helper method to convert CartEntity to CartResponseDto
    private CartResponseDto convertToCartResponseDto(CartEntity cart) {
        List<CartItemEntity> cartItems = cartItemRepository.findByCartId(cart.getId());
        List<CartItemResponseDto> itemDtos = cartItems.stream()
                .map(item -> new CartItemResponseDto(item.getId(), item.getProductId(), item.getQuantity()))
                .collect(Collectors.toList());
        
        return new CartResponseDto(
                cart.getId(),
                cart.getCartName(),
                cart.getCreatedDate(),
                cart.getUpdatedDate(),
                cart.getUserId(),
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
    public List<CartResponseDto> getAllCarts() {
        return cartRepository.findAll().stream()
                .map(this::convertToCartResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public CartResponseDto getCartById(Long id) {
        CartEntity cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + id));
        return convertToCartResponseDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDto createCart(CreateCartDto createCartDto) {

        // Determine userId either from DTO or from authenticated token
        Long userId = createCartDto.getUserId();
        if (userId == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                String username = auth.getName();
                if (username != null && !"anonymousUser".equals(username)) {
                    userId = userRepository.findByUsername(username)
                            .map(u -> u.getId())
                            .orElse(null);
                }
            }
        }

        // Validate user exists
        if (userId == null || !userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        // Validate cart must contain at least one item
        if (createCartDto.getItems() == null || createCartDto.getItems().isEmpty()) {
            throw new RuntimeException("Cart must contain at least one item");
        }
        
        // Verify all products exist and have sufficient quantities
        verifyProductAvailability(createCartDto.getItems());
        
        // Reduce product quantities from inventory
        reduceProductQuantities(createCartDto.getItems());
        
        // Create the cart
        CartEntity cart = new CartEntity();
        cart.setCartName(createCartDto.getCartName());
        cart.setCreatedDate(createCartDto.getCreatedDate());
        cart.setUpdatedDate(createCartDto.getUpdatedDate());
        cart.setUserId(userId);
        
        CartEntity savedCart = cartRepository.save(cart);
        
        // Create cart items
        for (Item item : createCartDto.getItems()) {
            CartItemEntity cartItem = new CartItemEntity();
            cartItem.setCartId(savedCart.getId());
            cartItem.setProductId(item.getProductId());
            cartItem.setQuantity(item.getQuantity());
            
            cartItemRepository.save(cartItem);
        }
        
        return convertToCartResponseDto(savedCart);
    }

    @Override
    @Transactional
    public CartResponseDto updateCart(Long id, UpdateCartDto updateCartDto) {

        CartEntity existing = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + id));
        
        if (updateCartDto.getCartName() != null) {
            existing.setCartName(updateCartDto.getCartName());
        }
        if (updateCartDto.getCreatedDate() != null) {
            existing.setCreatedDate(updateCartDto.getCreatedDate());
        }
        if (updateCartDto.getUpdatedDate() != null) {
            existing.setUpdatedDate(updateCartDto.getUpdatedDate());
        }
        if (updateCartDto.getUserId() != null) {
            if (!userRepository.existsById(updateCartDto.getUserId())) {
                throw new RuntimeException("User not found with id: " + updateCartDto.getUserId());
            }
            existing.setUserId(updateCartDto.getUserId());
        }
        
        // Update cart items if provided
        if (updateCartDto.getItems() != null) {
            // Get existing cart items to restore their quantities
            List<CartItemEntity> existingCartItems = cartItemRepository.findByCartId(id);
            List<Item> existingItems = existingCartItems.stream()
                    .map(item -> {
                        Item dto = new Item();
                        dto.setProductId(item.getProductId());
                        dto.setQuantity(item.getQuantity());
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            // Restore quantities from existing cart items back to inventory
            if (!existingItems.isEmpty()) {
                restoreProductQuantities(existingItems);
            }
            
            // Verify new quantities are available
            verifyProductAvailability(updateCartDto.getItems());
            
            // Reduce new quantities from inventory
            reduceProductQuantities(updateCartDto.getItems());
            
            // Delete existing cart items
            cartItemRepository.deleteByCartId(id);
            
            // Create new cart items
            for (Item item : updateCartDto.getItems()) {
                CartItemEntity cartItem = new CartItemEntity();
                cartItem.setCartId(id);
                cartItem.setProductId(item.getProductId());
                cartItem.setQuantity(item.getQuantity());
                
                cartItemRepository.save(cartItem);
            }
        }
        
        CartEntity updatedCart = cartRepository.save(existing);
        return convertToCartResponseDto(updatedCart);
    }

    @Override
    @Transactional
    public boolean deleteCart(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new RuntimeException("Cart not found with id: " + id);
        }
        
        try {
            // Get existing cart items to restore their quantities
            List<CartItemEntity> existingCartItems = cartItemRepository.findByCartId(id);
            List<Item> existingItems = existingCartItems.stream()
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
            
            // Delete cart items first
            cartItemRepository.deleteByCartId(id);
            // Then delete the cart
            cartRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete cart with id " + id + ": " + e.getMessage(), e);
        }
    }

    @Override
    public List<CartResponseDto> getCartsByUserId(Long userId) {
        return cartRepository.findByUserId(userId).stream()
                .map(this::convertToCartResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartResponseDto> getCartsByProductId(Long productId) {
        return cartRepository.findByProductId(productId).stream()
                .map(this::convertToCartResponseDto)
                .collect(Collectors.toList());
    }
}
