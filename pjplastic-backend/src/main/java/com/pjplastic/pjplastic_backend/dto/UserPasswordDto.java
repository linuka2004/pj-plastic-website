package com.pjplastic.pjplastic_backend.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPasswordDto {

    private String newPassword;

    public String getNewPassword(){
        return this.newPassword;
    }
}
