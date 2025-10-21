package com.pjplastic.pjplastic_backend.security.jwt;



import com.pjplastic.pjplastic_backend.entity.UserEntity;
import com.pjplastic.pjplastic_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByUsername(username).orElse(null);

        if(userEntity == null) {
            throw new UsernameNotFoundException("User not found with the given username");
        }

        // Assign role based on user's role field
        String role = "ROLE_" + userEntity.getRole().name();

        return org.springframework.security.core.userdetails.User.builder()
                .username(userEntity.getUsername())
                .password(userEntity.getPassword())
                .authorities(role)
                .build();
    }

}
