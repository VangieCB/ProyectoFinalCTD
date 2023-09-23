package com.dh.finduback.service;

import com.dh.finduback.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IBookingService {
    Booking create(Booking booking, String email);
    Page<Booking> findByUser(String email, Pageable pageable);
}
