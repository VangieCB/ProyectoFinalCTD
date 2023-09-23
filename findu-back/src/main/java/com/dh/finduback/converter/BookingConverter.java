package com.dh.finduback.converter;

import com.dh.finduback.dto.BookingDTO;
import com.dh.finduback.entity.Booking;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class BookingConverter extends AbstractConverter<Booking,BookingDTO> {
    @Override
    public BookingDTO fromEntity(Booking entity) {
        if (Objects.isNull(entity)) return null;

        return BookingDTO.builder()
                .id(entity.getId())
                .event(entity.getEvent())
                .user(entity.getUser())
                .attendanceDate(entity.getAttendanceDate())
                .tickets(entity.getTickets())
                .paymentAmount(entity.getPaymentAmount())
                .issueDate(entity.getIssueDate())
                .build();
    }

    @Override
    public Booking fromDTO(BookingDTO dto) {
        if (Objects.isNull(dto)) return null;

        return Booking.builder()
                //.id(dto.getId())
                .event(dto.getEvent())
                //.user(dto.getUser())
                .attendanceDate(dto.getAttendanceDate())
                .tickets(dto.getTickets())
                .paymentAmount(dto.getPaymentAmount())
                //.issueDate(dto.getIssueDate())
                .build();
    }
}
