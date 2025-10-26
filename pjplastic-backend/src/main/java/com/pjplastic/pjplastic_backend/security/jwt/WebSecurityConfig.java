//package com.pjplastic.pjplastic_backend.security.jwt;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@EnableMethodSecurity
//@Configuration
//public class WebSecurityConfig {
//    @Autowired
//    private UserDetailServiceImpl userDetailsService;
//
//
//    @Autowired
//    private AuthEntryPoint unauthorizedHandler;
//
//    @Bean
//    public UserDetailsService userDetailsService() {
//        return userDetailsService;
//    }
//
//    @Bean
//    public AuthTokenFilter authenticationJwTokenFilter() {
//        return new AuthTokenFilter();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public DaoAuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//
//        authProvider.setUserDetailsService(userDetailsService);
//        authProvider.setPasswordEncoder(passwordEncoder());
//
//
//        return authProvider;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
//        return authConfig.getAuthenticationManager();
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .cors(cors -> {})                         // or configure a CorsConfigurationSource bean
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/auth/register",
//                                "/auth/login",
//                                "/auth/check-existence"
//                        ).permitAll()
//                        // Product endpoints - POST, PUT, DELETE require ADMIN role
//                        .requestMatchers("POST", "/products").hasRole("ADMIN")
//                        .requestMatchers("PUT", "/products/**").hasRole("ADMIN")
//                        .requestMatchers("DELETE", "/products/**").hasRole("ADMIN")
//                        // Category endpoints - POST, PUT, DELETE require ADMIN role
//                        .requestMatchers("POST", "/categories").hasRole("ADMIN")
//                        .requestMatchers("PUT", "/categories/**").hasRole("ADMIN")
//                        .requestMatchers("DELETE", "/categories/**").hasRole("ADMIN")
//                        // All other requests require authentication
//                        .anyRequest().authenticated()
//                );
//        http.authenticationProvider(authenticationProvider());
//        http.addFilterBefore(authenticationJwTokenFilter(), UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }
//}
//
//
//
//

package com.pjplastic.pjplastic_backend.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableMethodSecurity
@Configuration
public class WebSecurityConfig {
    @Autowired
    private UserDetailServiceImpl userDetailsService;


    @Autowired
    private AuthEntryPoint unauthorizedHandler;

    private final AuthTokenFilter authTokenFilter;

    public WebSecurityConfig(UserDetailServiceImpl userDetailsService, AuthEntryPoint unauthorizedHandler, JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        // Create the filter with its required dependencies
        this.authTokenFilter = new AuthTokenFilter(jwtUtils, userDetailsService);
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());


        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})                         // use CorsConfigurationSource bean below
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
            // Always allow CORS preflight
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/auth/register",
                                "/auth/login",
                                "/auth/check-existence"
                        ).permitAll()
            .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                        // Product endpoints - POST, PUT, DELETE require ADMIN role
                        .requestMatchers(HttpMethod.POST, "/products").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")
                        // Category endpoints - POST, PUT, DELETE require ADMIN role
                        .requestMatchers(HttpMethod.POST, "/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN")
            // Orders endpoints - allow placing orders without login; keep other operations protected
            .requestMatchers(HttpMethod.POST, "/orders").permitAll()
            .requestMatchers(HttpMethod.POST, "/orders/**").authenticated()
            .requestMatchers(HttpMethod.GET, "/orders/**").authenticated()
            .requestMatchers(HttpMethod.PUT, "/orders/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/orders/**").authenticated()
            // Cart endpoints - require authentication
            .requestMatchers(HttpMethod.GET, "/cart/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/cart/**").authenticated()
            .requestMatchers(HttpMethod.PUT, "/cart/**").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/cart/**").authenticated()
                        // Public read access for catalog endpoints
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        // All other requests require authentication
                        .anyRequest().authenticated()
                );
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
    // Allow typical dev/prod frontend origins; patterns are compatible with allowCredentials(true)
    configuration.setAllowedOriginPatterns(java.util.Arrays.asList(
        "http://localhost:*",
        "http://127.0.0.1:*",
        "http://192.168.*.*:*",
        "https://*"
    ));
        configuration.setAllowedHeaders(java.util.Arrays.asList(
                "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"
        ));
        configuration.setExposedHeaders(java.util.Arrays.asList("Authorization"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}




