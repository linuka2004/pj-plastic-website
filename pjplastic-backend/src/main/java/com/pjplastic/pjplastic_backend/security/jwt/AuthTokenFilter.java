package com.pjplastic.pjplastic_backend.security.jwt;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailServiceImpl userDetailsService;

    public AuthTokenFilter(JwtUtils jwtUtils, UserDetailServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        try {
            String jwt = parseJwt(request);
            System.out.println("JWT Token: " + (jwt != null ? "Present" : "NULL"));

            if(jwt != null && jwtUtils.validateToken(jwt)) {
                System.out.println("JWT Token is valid");
                String username = jwtUtils.getUsernameFromToken(jwt);
                System.out.println("Username from token: " + username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("UserDetails loaded successfully for: " + userDetails.getUsername());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Authentication set successfully");

            } else {
                System.out.println("JWT Token is NULL or INVALID");
            }
        } catch (Exception e) {
            System.err.println("Cannot set user Auth: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);

    }

    private String parseJwt(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader)) {
            // Be tolerant of casing and stray whitespace
            String header = authHeader.trim();
            if (header.regionMatches(true, 0, "Bearer ", 0, 7)) {
                return header.substring(7).trim();
            }
        }

        return null;
    }



}
