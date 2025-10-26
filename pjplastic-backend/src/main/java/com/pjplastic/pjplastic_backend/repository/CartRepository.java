package com.pjplastic.pjplastic_backend.repository;

import com.pjplastic.pjplastic_backend.entity.CartEntity;
import com.pjplastic.pjplastic_backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findByUser(UserEntity user);
}
