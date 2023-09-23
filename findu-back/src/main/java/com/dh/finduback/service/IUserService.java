package com.dh.finduback.service;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.User;
import com.dh.finduback.error.exception.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IUserService {
    User update(Long id, User user) throws UserNotFoundException;
    Page<User> findAll(Pageable pageable);

    void toggleEventLike(String email, Long eventId);
    Page<Event> getLikedEvents(String email, Pageable pageable);
    List<Long> getLikedEventIds(String email);
}
