package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.CreateProductDto;
import com.pjplastic.pjplastic_backend.dto.UpdateProductDto;
import com.pjplastic.pjplastic_backend.entity.ProductEntity;
import com.pjplastic.pjplastic_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @GetMapping("/products")
    public ResponseEntity<List<ProductEntity>> getAllProducts(){
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAllProducts());
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductEntity> createProduct(@RequestBody CreateProductDto createProductDto){
        try {
            ProductEntity createdProduct = productService.createProduct(createProductDto);
            return ResponseEntity.status(201).body(createdProduct);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Category not found")) {
                return ResponseEntity.status(400).body(null);
            } else {
                return ResponseEntity.status(400).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductEntity> getProductById(@PathVariable Long id) {
        ProductEntity productEntity = productService.getProductById(id);

        if(productEntity != null) {
            return ResponseEntity.status(200).body(productEntity);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductEntity> updateProduct(@PathVariable Long id, @RequestBody UpdateProductDto updateProductDto){
        try {
            ProductEntity updatedProduct = productService.updateProduct(id, updateProductDto);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Product not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Category not found")) {
                return ResponseEntity.status(400).body(null);
            } else {
                return ResponseEntity.status(400).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<List<ProductEntity>> getProductByCategory(@PathVariable Long id){
        return ResponseEntity.ok().body(productService.getProductByCategory(id));
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            boolean deleted = productService.deleteProduct(id);
            
            if (deleted) {
                return ResponseEntity.ok("Product deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Product not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(500).body("Failed to delete product: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete product: " + e.getMessage());
        }
    }

    @PostMapping(value = "/products/{id}/image", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(400).body(java.util.Map.of("message", "No file uploaded"));
            }
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                return ResponseEntity.status(400).body(java.util.Map.of("message", "Only image files are allowed"));
            }
            ProductEntity updated = productService.uploadProductImage(id, file);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            log.error("Upload failed: {}", e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().contains("Product not found")) {
                return ResponseEntity.status(404).body(java.util.Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(400).body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during image upload", e);
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Unexpected error during image upload"));
        }
    }

}
