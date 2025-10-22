package com.pjplastic.pjplastic_backend.service.impl;

import com.pjplastic.pjplastic_backend.dto.CreateProductDto;
import com.pjplastic.pjplastic_backend.dto.UpdateProductDto;
import com.pjplastic.pjplastic_backend.entity.ProductEntity;
import com.pjplastic.pjplastic_backend.repository.CategoryRepository;
import com.pjplastic.pjplastic_backend.repository.ProductRepository;
import com.pjplastic.pjplastic_backend.service.ProductService;
import com.pjplastic.pjplastic_backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public ProductEntity getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public ProductEntity createProduct(CreateProductDto createProductDto) {

        if (!categoryRepository.existsById(createProductDto.getCategoryId())) {
            throw new RuntimeException("Category not found with id: " + createProductDto.getCategoryId());
        }

        ProductEntity product = new ProductEntity();
        product.setName(createProductDto.getName());
        product.setPrice(createProductDto.getPrice());
        product.setQty(createProductDto.getQty());
        product.setCategoryId(createProductDto.getCategoryId());
    product.setImageUrl(null);
        
        return productRepository.save(product);
    }

    @Override
    public ProductEntity updateProduct(Long id, UpdateProductDto updateProductDto) {

        ProductEntity existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (updateProductDto.getName() != null) {
            existing.setName(updateProductDto.getName());
        }
        if (updateProductDto.getPrice() != null) {
            existing.setPrice(updateProductDto.getPrice());
        }
        if (updateProductDto.getQty() != null) {
            existing.setQty(updateProductDto.getQty());
        }
        if (updateProductDto.getCategoryId() != null) {
            if (!categoryRepository.existsById(updateProductDto.getCategoryId())) {
                throw new RuntimeException("Category not found with id: " + updateProductDto.getCategoryId());
            }
            existing.setCategoryId(updateProductDto.getCategoryId());
        }
        
        return productRepository.save(existing);
    }

    @Override
    public List<ProductEntity> getProductByCategory(Long id) {
        return productRepository.findByCategoryId(id);
    }

    @Override
    public boolean deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        try {
            productRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product with id " + id + ": " + e.getMessage(), e);
        }
    }

    @Override
    public ProductEntity uploadProductImage(Long id, org.springframework.web.multipart.MultipartFile file) {
        ProductEntity existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        String imageUrl = cloudinaryService.uploadImage(file, "products");
        existing.setImageUrl(imageUrl);
        return productRepository.save(existing);
    }

}
