package com.pjplastic.pjplastic_backend.service.impl;

import com.pjplastic.pjplastic_backend.dto.UpdateUserDto;
import com.pjplastic.pjplastic_backend.dto.UserDto;
import com.pjplastic.pjplastic_backend.dto.UserPasswordDto;
import com.pjplastic.pjplastic_backend.entity.Role;
import com.pjplastic.pjplastic_backend.entity.UserEntity;
import com.pjplastic.pjplastic_backend.repository.UserRepository;
import com.pjplastic.pjplastic_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity createUser(UserDto userDto) {
        UserEntity user = new UserEntity();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setMobile(userDto.getMobile());
        user.setAddress(userDto.getAddress());
        user.setFullName(userDto.getFullName());
        
        // Handle role - prioritize role over isAdmin
        if (userDto.getRole() != null) {
            user.setRole(userDto.getRole());
            user.setIsAdmin(userDto.getRole() == Role.ADMIN);
        } else if (userDto.getIsAdmin() != null) {
            user.setIsAdmin(userDto.getIsAdmin());
            user.setRole(userDto.getIsAdmin() ? Role.ADMIN : Role.CUSTOMER);
        } else {
            user.setIsAdmin(false);
            user.setRole(Role.CUSTOMER);
        }
        
        return userRepository.save(user);
    }

    @Override
    public UserEntity updateUser(UpdateUserDto updateUserDto, Long userId){
        UserEntity existingUser = getUserById(userId);
        
        if (existingUser == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        if (updateUserDto.Address != null) {
            existingUser.setAddress(updateUserDto.Address);
        }
        
        if (updateUserDto.Email != null && !updateUserDto.Email.equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(updateUserDto.Email)) {
                throw new RuntimeException("Email already exists");
            }
            existingUser.setEmail(updateUserDto.Email);
        }
        
        if (updateUserDto.Password != null && !updateUserDto.Password.trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updateUserDto.Password));
        }
        
        if (updateUserDto.Mobile != null) {
            existingUser.setMobile(updateUserDto.Mobile);
        }
        
        if (updateUserDto.FullName != null) {
            existingUser.setFullName(updateUserDto.FullName);
        }
        
        // Handle role updates - prioritize Role over IsAdmin
        if (updateUserDto.Role != null) {
            existingUser.setRole(updateUserDto.Role);
            existingUser.setIsAdmin(updateUserDto.Role == Role.ADMIN);
        } else if (updateUserDto.IsAdmin != null) {
            existingUser.setIsAdmin(updateUserDto.IsAdmin);
            existingUser.setRole(updateUserDto.IsAdmin ? Role.ADMIN : Role.CUSTOMER);
        }

        return userRepository.save(existingUser);
    }

    @Override
    public UserEntity getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public UserEntity changePassword(Long id, UserPasswordDto userPasswordDto) {
        Optional<UserEntity> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(userPasswordDto.getNewPassword()));
            return userRepository.save(user);
        }
        return null;
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public Optional<UserEntity> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        try {
            userRepository.deleteById(userId);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user with id " + userId + ": " + e.getMessage(), e);
        }
    }

    @Override
    public List<UserEntity> getAllCustomers() {
        return userRepository.findByIsAdmin(false);
    }

}
