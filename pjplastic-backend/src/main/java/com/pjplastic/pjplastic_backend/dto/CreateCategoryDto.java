package com.pjplastic.pjplastic_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCategoryDto {
    
    private String name;

    // Optional legacy field kept for backward compatibility
    public String categoryType;

    private String description;

    private String icon;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategoryType() {
        return categoryType;
    }

    public void setCategoryType(String categoryType) {
        this.categoryType = categoryType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
