package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    
    @Query("SELECT o FROM OrderEntity o WHERE o.userId = :userId")
    List<OrderEntity> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT o FROM OrderEntity o JOIN OrderItemEntity oi ON o.id = oi.orderId WHERE oi.productId = :productId")
    List<OrderEntity> findByProductId(@Param("productId") Long productId);
}