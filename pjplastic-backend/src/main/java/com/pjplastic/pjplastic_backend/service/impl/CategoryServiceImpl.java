package com.pjplastic.pjplastic_backend.service.impl;

import com.pjplastic.pjplastic_backend.dto.CreateCategoryDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCategoryDto;
import com.pjplastic.pjplastic_backend.entity.CategoryEntity;
import com.pjplastic.pjplastic_backend.repository.CategoryRepository;
import com.pjplastic.pjplastic_backend.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public CategoryEntity findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public CategoryEntity createCategory(CreateCategoryDto createCategoryDto) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setName(createCategoryDto.getName());
        categoryEntity.setCategoryType(createCategoryDto.getCategoryType());
        // New fields (optional)
        if (createCategoryDto.getDescription() != null) {
            categoryEntity.setDescription(createCategoryDto.getDescription());
        }
        if (createCategoryDto.getIcon() != null) {
            categoryEntity.setIcon(createCategoryDto.getIcon());
        }
        return categoryRepository.save(categoryEntity);
    }

    @Override
    public CategoryEntity updateCategory(Long id, UpdateCategoryDto updateCategoryDto) {

        CategoryEntity existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        if (updateCategoryDto.getName() != null) {
            existing.setName(updateCategoryDto.getName());
        }

        if(updateCategoryDto.getCategoryType() != null) {
            existing.setCategoryType((updateCategoryDto.getCategoryType()));
        }
        if (updateCategoryDto.getDescription() != null) {
            existing.setDescription(updateCategoryDto.getDescription());
        }
        if (updateCategoryDto.getIcon() != null) {
            existing.setIcon(updateCategoryDto.getIcon());
        }
        
        return categoryRepository.save(existing);
    }

    @Override
    public boolean deleteCategory(Long id) {
        if(!categoryRepository.existsById((id))){
            throw new RuntimeException("Category not found with id: " + id);
        }
        try{
            categoryRepository.deleteById(id);
            return true;
        }catch (Exception e)
        {
            throw new RuntimeException("Failed to delete Category with id " + id + ": " + e.getMessage(), e);
        }
    }
}
