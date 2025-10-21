package com.pjplastic.pjplastic_backend.dto;

import com.pjplastic.pjplastic_backend.entity.Role;

public class UpdateUserDto {
    public String Email;
    public String Password;
    public String Mobile;
    public String Address;
    public String FullName;
    public Boolean IsAdmin;
    public Role Role;
}
