package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.CreateCategoryDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCategoryDto;
import com.pjplastic.pjplastic_backend.entity.CategoryEntity;
import com.pjplastic.pjplastic_backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryEntity> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryEntity> createCategory(@RequestBody CreateCategoryDto createCategoryDto){
        try {
            CategoryEntity createdCategory = categoryService.createCategory(createCategoryDto);
            return ResponseEntity.status(201).body(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @GetMapping("/{id}")
    public CategoryEntity getCategoryById(@PathVariable Long id){
        return categoryService.findCategoryById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryEntity> updateCategory(@PathVariable Long id, @RequestBody UpdateCategoryDto updateCategoryDto){
        try {
            CategoryEntity updatedCategory = categoryService.updateCategory(id, updateCategoryDto);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Category not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(400).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteCategory(@PathVariable Long id) {
        boolean isDeleted = categoryService.deleteCategory(id);

        if (isDeleted) {
            return "Category deleted successfully";
        } else {
            return "Category not found or unable to delete";
        }
    }

}
