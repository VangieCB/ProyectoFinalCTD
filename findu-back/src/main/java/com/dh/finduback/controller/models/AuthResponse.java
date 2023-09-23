package com.dh.finduback.controller.models;

import com.dh.finduback.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}
