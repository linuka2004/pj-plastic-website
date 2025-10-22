package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
    List<OrderItemEntity> findByOrderId(Long orderId);
    List<OrderItemEntity> findByProductId(Long productId);
    void deleteByOrderId(Long orderId);
}
