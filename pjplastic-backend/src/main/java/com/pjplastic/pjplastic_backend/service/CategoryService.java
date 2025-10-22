package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CreateCategoryDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCategoryDto;
import com.pjplastic.pjplastic_backend.entity.CategoryEntity;

import java.util.List;

public interface CategoryService {
    List<CategoryEntity> getAllCategories();
    CategoryEntity findCategoryById(Long id);
    CategoryEntity createCategory(CreateCategoryDto createCategoryDto);
    CategoryEntity updateCategory(Long id, UpdateCategoryDto updateCategoryDto);
    boolean deleteCategory(Long id);

}
