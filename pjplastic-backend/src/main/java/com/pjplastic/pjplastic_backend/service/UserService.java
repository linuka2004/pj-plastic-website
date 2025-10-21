package com.pjplastic.pjplastic_backend.service;


import com.pjplastic.pjplastic_backend.dto.UpdateUserDto;
import com.pjplastic.pjplastic_backend.dto.UserDto;
import com.pjplastic.pjplastic_backend.dto.UserPasswordDto;
import com.pjplastic.pjplastic_backend.entity.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {
    List<UserEntity> getAllUsers();
    UserEntity createUser(UserDto userDto);
    UserEntity getUserById(Long id);
    UserEntity changePassword(Long id, UserPasswordDto userPasswordDto);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<UserEntity> getUserByUsername(String username);
    UserEntity updateUser(UpdateUserDto updateUserDto, Long userId);
    boolean deleteUser(Long userId);
    List<UserEntity> getAllCustomers();

}
