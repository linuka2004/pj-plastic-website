package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    
    @Query("SELECT o FROM OrderEntity o WHERE o.userId = :userId")
    List<CartEntity> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT o FROM CartEntity o JOIN CartItemEntity oi ON o.id = oi.cartId WHERE oi.productId = :productId")
    List<CartEntity> findByProductId(@Param("productId") Long productId);
}