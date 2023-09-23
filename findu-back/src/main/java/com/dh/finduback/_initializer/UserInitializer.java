package com.dh.finduback._initializer;

import com.dh.finduback.entity.Role;
import com.dh.finduback.entity.User;
import com.dh.finduback.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserInitializer implements ApplicationListener<ContextRefreshedEvent> {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (userRepository.findUserByEmail("admin@example.com").isEmpty()) {
            var user = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("12345678"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(user);
        }
    }
}
