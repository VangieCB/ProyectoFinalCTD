package com.dh.finduback.repository;

import com.dh.finduback.entity.Booking;
import com.dh.finduback.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookingRepository extends JpaRepository<Booking,Long> {
    Page<Booking> findByUserOrderByIssueDateDesc(User user, Pageable pageable);
}
