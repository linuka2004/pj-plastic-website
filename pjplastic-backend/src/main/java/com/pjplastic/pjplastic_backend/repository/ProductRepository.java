package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {

    @Query("SELECT p FROM ProductEntity p WHERE p.categoryId = :categoryId")
    List<ProductEntity> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT COUNT(p) FROM ProductEntity p")
    Long countAllProducts();

    @Query("SELECT COUNT(p) FROM ProductEntity p WHERE p.qty = 0")
    Long countOutOfStockProducts();

    @Query("SELECT COUNT(p) FROM ProductEntity p WHERE p.qty < 10")
    Long countProductsQtyLessThan10();

}
