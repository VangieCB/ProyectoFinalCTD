package com.dh.finduback.controller;

import com.dh.finduback.converter.EventTypeConverter;
import com.dh.finduback.dto.EventTypeDTO;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.service.IEventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/event-types")
@RequiredArgsConstructor
public class EventTypeController {
    private final IEventTypeService eventTypeService;
    private final EventTypeConverter eventTypeConverter;

    @PostMapping
    public ResponseEntity<EventTypeDTO> create(
            @ModelAttribute EventTypeDTO eventTypeDTO,
            @RequestParam(required = false) MultipartFile file1
    ) {
        EventType eventType = eventTypeConverter.fromDTO(eventTypeDTO);
        eventTypeDTO = eventTypeConverter.fromEntity(eventTypeService.create(eventType, file1));
        return ResponseEntity.ok(eventTypeDTO);
    }

    @GetMapping
    public ResponseEntity<Page<EventTypeDTO>> findAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<EventTypeDTO> eventTypesDTO = eventTypeConverter.fromEntities(eventTypeService.findAll(pageable));
        return ResponseEntity.ok(eventTypesDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventTypeDTO>> findAll() {
        List<EventTypeDTO> eventTypesDTO = eventTypeConverter.fromEntities(eventTypeService.findAll());
        return ResponseEntity.ok(eventTypesDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        return ResponseEntity.ok(eventTypeService.deleteById(id));
    }
}
