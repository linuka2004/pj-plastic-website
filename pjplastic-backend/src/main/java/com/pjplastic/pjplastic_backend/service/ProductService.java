package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CreateProductDto;
import com.pjplastic.pjplastic_backend.dto.UpdateProductDto;
import com.pjplastic.pjplastic_backend.entity.ProductEntity;

import java.util.List;

public interface ProductService {
    List<ProductEntity> getAllProducts();
    ProductEntity getProductById(Long id);
    ProductEntity createProduct(CreateProductDto createProductDto);
    ProductEntity updateProduct(Long id, UpdateProductDto updateProductDto);
    List<ProductEntity> getProductByCategory(Long id);
    boolean deleteProduct(Long id);
    ProductEntity uploadProductImage(Long id, org.springframework.web.multipart.MultipartFile file);
}
