package com.dh.finduback.controller;

import com.dh.finduback.converter.EventConverter;
import com.dh.finduback.converter.UserConverter;
import com.dh.finduback.dto.EventDTO;
import com.dh.finduback.dto.UserDTO;
import com.dh.finduback.entity.User;
import com.dh.finduback.error.exception.UserNotFoundException;
import com.dh.finduback.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final UserConverter userConverter;
    private final EventConverter eventConverter;

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO
    ) throws UserNotFoundException {
        User user = userConverter.fromDTO(userDTO);
        userDTO = userConverter.fromEntity(userService.update(id, user));
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping
    public ResponseEntity<Page<UserDTO>> findAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<UserDTO> usersDTO = userConverter.fromEntities(userService.findAll(pageable));
        return ResponseEntity.ok(usersDTO);
    }

    @PostMapping("/toggle-event-like")
    public ResponseEntity<?> toggleEventLike(@RequestBody Map<String,Object> data) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        userService.toggleEventLike(auth.getName(), ((Number) data.get("eventId")).longValue());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/liked-events")
    public ResponseEntity<Page<EventDTO>> getLikedEvents(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Pageable pageable = PageRequest.of(page-1, size);
        Page<EventDTO> eventsDTO = eventConverter.fromEntities(userService.getLikedEvents(auth.getName(), pageable));
        return ResponseEntity.ok(eventsDTO);
    }

    @GetMapping("/liked-event-ids")
    public ResponseEntity<List<Long>> getLikedEventIds() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<Long> eventIds = userService.getLikedEventIds(auth.getName());
        return ResponseEntity.ok(eventIds);
    }
}
