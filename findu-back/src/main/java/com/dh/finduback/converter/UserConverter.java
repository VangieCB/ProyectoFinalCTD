package com.dh.finduback.converter;

import com.dh.finduback.dto.UserDTO;
import com.dh.finduback.entity.User;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class UserConverter extends AbstractConverter<User,UserDTO> {
    @Override
    public UserDTO fromEntity(User entity) {
        if (Objects.isNull(entity)) return null;

        return UserDTO.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .role(entity.getRole())
                .build();
    }

    @Override
    public User fromDTO(UserDTO dto) {
        if (Objects.isNull(dto)) return null;

        return User.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .role(dto.getRole())
                .build();
    }
}
