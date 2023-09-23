package com.dh.finduback.service;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.entity.User;
import com.dh.finduback.error.exception.EventBadRequestException;
import com.dh.finduback.error.exception.EventNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IEventService {
    Event create(Event event, MultipartFile file1, Set<MultipartFile> additionalFiles) throws EventBadRequestException;
    Event update(Long id, Event event) throws EventNotFoundException;
    Page<Event> findByDeletedFalse(Pageable pageable);
    Page<Event> findActiveRandoms(Pageable pageable);
    Page<Event> findByEventTypeAndActiveTrue(EventType eventType, Pageable pageable);
    List<Event> findByActiveTrue();
    Optional<Event> findById(Long id);
    int softDeleteById(Long id);

    Page<Event> findActiveEventsByFilters(LocalDate fromDate, LocalDate toDate, String searchText, Pageable pageable);

    List<Event> findByEventType(EventType eventType);

    Page<Event> findByUsersLikedAndActiveTrue(User user, Pageable pageable);
    List<Event> findByUsersLikedAndActiveTrue(User user);
}
