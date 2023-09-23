package com.dh.finduback.controller;

import com.dh.finduback.converter.EventConverter;
import com.dh.finduback.dto.EventDTO;
import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.error.exception.EventBadRequestException;
import com.dh.finduback.error.exception.EventNotFoundException;
import com.dh.finduback.service.IEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private IEventService eventService;
    @Autowired
    private EventConverter eventConverter;

    @PostMapping
    public ResponseEntity<EventDTO> create(
            @ModelAttribute EventDTO eventDTO,
            @RequestParam(required = false) MultipartFile file1,
            @RequestParam(required = false) Set<MultipartFile> additionalFiles
    ) throws EventBadRequestException {
        Event event = eventConverter.fromDTO(eventDTO);
        eventDTO = eventConverter.fromEntity(eventService.create(event, file1, additionalFiles));
        return ResponseEntity.ok(eventDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> update(
            @PathVariable Long id,
            @RequestBody EventDTO eventDTO
    ) throws EventNotFoundException {
        Event event = eventConverter.fromDTO(eventDTO);
        eventDTO = eventConverter.fromEntity(eventService.update(id, event));
        return ResponseEntity.ok(eventDTO);
    }

    @GetMapping
    public ResponseEntity<Page<EventDTO>> findByDeletedFalse(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<EventDTO> eventsDTO = eventConverter.fromEntities(eventService.findByDeletedFalse(pageable));
        return ResponseEntity.ok(eventsDTO);
    }

    @GetMapping("/randoms")
    public ResponseEntity<Page<EventDTO>> findActiveRandoms(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<EventDTO> eventsDTO = eventConverter.fromEntities(eventService.findActiveRandoms(pageable));
        return ResponseEntity.ok(eventsDTO);
    }

    @GetMapping("/event-type/{eventTypeId}")
    public ResponseEntity<Page<EventDTO>> findByEventTypeAndActiveTrue(
            @PathVariable Long eventTypeId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        EventType eventType = EventType.builder().id(eventTypeId).build();
        Pageable pageable = PageRequest.of(page-1, size);
        Page<EventDTO> eventsDTO = eventConverter.fromEntities(eventService.findByEventTypeAndActiveTrue(eventType, pageable));
        return ResponseEntity.ok(eventsDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<EventDTO>> findById(@PathVariable Long id) {
        Optional<Event> event = eventService.findById(id);

        if (event.isEmpty()) {
            return ResponseEntity.ok(Optional.empty());
        } else {
            EventDTO eventDTO = eventConverter.fromEntity(event.get());
            return ResponseEntity.ok(Optional.of(eventDTO));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.softDeleteById(id));
    }

    @GetMapping("/filtered-events")
    public ResponseEntity<Page<EventDTO>> findActiveEventsByFilters(
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) String searchText,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<EventDTO> eventsDTO = eventConverter.fromEntities(
                eventService.findActiveEventsByFilters(fromDate, toDate, searchText, pageable)
        );
        return ResponseEntity.ok(eventsDTO);
    }
}
