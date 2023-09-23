package com.dh.finduback.repository;

import com.dh.finduback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User,Long> {
    Optional<User> findUserByEmail(String email);
}
