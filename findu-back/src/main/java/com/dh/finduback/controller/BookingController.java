package com.dh.finduback.controller;

import com.dh.finduback.converter.BookingConverter;
import com.dh.finduback.dto.BookingDTO;
import com.dh.finduback.entity.Booking;
import com.dh.finduback.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final IBookingService bookingService;
    private final BookingConverter bookingConverter;

    @PostMapping
    public ResponseEntity<BookingDTO> create(@RequestBody BookingDTO bookingDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Booking booking = bookingConverter.fromDTO(bookingDTO);
        bookingDTO = bookingConverter.fromEntity(bookingService.create(booking, auth.getName()));
        return ResponseEntity.ok(bookingDTO);
    }

    @GetMapping("/by-user")
    public ResponseEntity<Page<BookingDTO>> findByUser(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Pageable pageable = PageRequest.of(page-1, size);
        Page<BookingDTO> bookingsDTO = bookingConverter.fromEntities(bookingService.findByUser(auth.getName(), pageable));
        return ResponseEntity.ok(bookingsDTO);
    }
}
