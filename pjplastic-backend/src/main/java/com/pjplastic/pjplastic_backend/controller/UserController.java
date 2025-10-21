package com.pjplastic.pjplastic_backend.controller;


import com.pjplastic.pjplastic_backend.dto.UpdateUserDto;
import com.pjplastic.pjplastic_backend.dto.UserDto;
import com.pjplastic.pjplastic_backend.dto.UserPasswordDto;
import com.pjplastic.pjplastic_backend.entity.UserEntity;
import com.pjplastic.pjplastic_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserEntity> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/customers")
    public List<UserEntity> getAllCustomers(){
        return userService.getAllCustomers();
    }

    @PostMapping
    public UserEntity createUser(@RequestBody UserDto userDto){
        return userService.createUser(userDto);
    }

    @PostMapping("/change-password/{id}")
    public ResponseEntity<UserEntity> changeUserPassword(@PathVariable Long id, @RequestBody UserPasswordDto userPasswordDto) {
        return ResponseEntity.ok().body(userService.changePassword(id, userPasswordDto));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserEntity> getUserByUsername(@PathVariable String username){
        Optional<UserEntity> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long userId){
        UserEntity user = userService.getUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}")
    public UserEntity updateUser(@PathVariable Long  userId, @RequestBody UpdateUserDto updateUserDto)
    {
        return userService.updateUser(updateUserDto, userId);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            boolean deleted = userService.deleteUser(userId);
            
            if (deleted) {
                return ResponseEntity.ok("User deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete user: " + e.getMessage());
        }
    }
}
