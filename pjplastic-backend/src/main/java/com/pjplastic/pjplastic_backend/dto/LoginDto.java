package com.pjplastic.pjplastic_backend.dto;


import lombok.Getter;
import org.springframework.stereotype.Service;

@Getter
@Service
public class LoginDto {
    private String username;

    private String password;

    public String getUsername()
    {
        return username;
    }

    public String getPassword()
    {
        return password;
    }
}
