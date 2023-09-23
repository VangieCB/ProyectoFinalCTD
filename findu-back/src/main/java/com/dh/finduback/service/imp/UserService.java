package com.dh.finduback.service.imp;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.User;
import com.dh.finduback.error.exception.UserNotFoundException;
import com.dh.finduback.repository.IUserRepository;
import com.dh.finduback.service.IEventService;
import com.dh.finduback.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final IEventService eventService;

    @Override
    public User update(Long id, User user) throws UserNotFoundException {
        Optional<User> userDBO = userRepository.findById(id);
        User userDB;

        if (userDBO.isEmpty()) {
            throw new UserNotFoundException("Usuario no encontrado.");
        } else {
            userDB = userDBO.get();
        }

        userDB.setRole(user.getRole());

        return userRepository.save(userDB);
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public void toggleEventLike(String email, Long eventId) {
        Optional<User> userDBO = userRepository.findUserByEmail(email);
        Optional<Event> eventDBO = eventService.findById(eventId);

        if (userDBO.isPresent() && eventDBO.isPresent()) {
            User userDB = userDBO.get();
            Event eventDB = eventDBO.get();

            if (userDB.getLikedEvents().contains(eventDB)) {
                userDB.getLikedEvents().remove(eventDB);
            } else {
                userDB.getLikedEvents().add(eventDB);
            }
            userRepository.save(userDB);
        }
    }

    @Override
    public Page<Event> getLikedEvents(String email, Pageable pageable) {
        Optional<User> userDBO = userRepository.findUserByEmail(email);
        return userDBO.map(user -> eventService.findByUsersLikedAndActiveTrue(user, pageable)).orElse(Page.empty(pageable));
    }

    @Override
    public List<Long> getLikedEventIds(String email) {
        Optional<User> userDBO = userRepository.findUserByEmail(email);

        return userDBO.map(user -> eventService.findByUsersLikedAndActiveTrue(user).stream()
                .map(Event::getId)
                .toList()).orElseGet(ArrayList::new);
    }
}
