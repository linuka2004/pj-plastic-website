package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.LoginDto;
import com.pjplastic.pjplastic_backend.dto.UserDto;
import com.pjplastic.pjplastic_backend.repository.UserRepository;
import com.pjplastic.pjplastic_backend.security.jwt.JwtUtils;
import com.pjplastic.pjplastic_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto user) {

        if(userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already in use");
        }

        if(userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        return ResponseEntity.ok(userService.createUser(user));

    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(jwt);

    }

    @GetMapping("/auth/check-existence")
    public ResponseEntity<Map<String, Boolean>> checkExistence(@RequestParam String username, @RequestParam String email) {

        Map<String, Boolean> existenceMap = new HashMap<>();
        existenceMap.put("usernameExists", userService.existsByUsername(username));
        existenceMap.put("emailExists", userService.existsByEmail(email));

        return ResponseEntity.ok().body(existenceMap);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "unauthorized"));
        }
        Object principal = authentication.getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = String.valueOf(principal);
        }
        Map<String, Object> info = new HashMap<>();
        info.put("username", username);
        info.put("authorities", authentication.getAuthorities());
        return ResponseEntity.ok(info);
    }
}