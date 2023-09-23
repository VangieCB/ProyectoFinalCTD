package com.dh.finduback.service.imp;

import com.dh.finduback.config.JwtService;
import com.dh.finduback.controller.models.AuthRequest;
import com.dh.finduback.controller.models.AuthResponse;
import com.dh.finduback.controller.models.RegisterRequest;
import com.dh.finduback.entity.Role;
import com.dh.finduback.entity.User;
import com.dh.finduback.error.exception.UserBadRequestException;
import com.dh.finduback.repository.IUserRepository;
import com.dh.finduback.service.IAuthService;
import com.dh.finduback.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final IEmailService emailService;

    @Override
    public AuthResponse register(RegisterRequest request) throws UserBadRequestException {
        if (userRepository.findUserByEmail(request.getEmail()).isPresent()) {
            throw new UserBadRequestException("El correo electrónico ya está en uso.");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        emailService.sendRegistrationEmail(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findUserByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
