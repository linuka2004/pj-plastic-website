package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.entity.CartEntity;
import com.pjplastic.pjplastic_backend.entity.CartItemEntity;
import com.pjplastic.pjplastic_backend.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    Optional<CartItemEntity> findByCartAndProduct(CartEntity cart, ProductEntity product);
    void deleteByCartAndProduct(CartEntity cart, ProductEntity product);
}
