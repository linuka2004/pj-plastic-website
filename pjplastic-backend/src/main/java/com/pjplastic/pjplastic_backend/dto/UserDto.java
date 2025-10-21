package com.pjplastic.pjplastic_backend.dto;


import com.pjplastic.pjplastic_backend.entity.Role;
import lombok.Getter;
import org.springframework.stereotype.Service;

@Getter
@Service
public class UserDto {
    private String username;
    private String email;
    private String password;
    private String mobile;
    private String address;
    private String fullName;
    private Boolean isAdmin;
    private Role role;

    public String getUsername() {
        return username;
    }

    public String getEmail(){
        return email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getMobile() {
        return this.mobile;
    }

    public String getAddress() {
        return this.address;
    }

    public String getFullName() {
        return this.fullName;
    }

    public Boolean getIsAdmin() {
        return this.isAdmin;
    }

    public Role getRole() {
        return this.role;
    }

}
