package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.dto.UpdateUserDto;
import com.pjplastic.pjplastic_backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
    
    List<UserEntity> findByIsAdmin(Boolean isAdmin);

}



