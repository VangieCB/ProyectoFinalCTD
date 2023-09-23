package com.dh.finduback.dto;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingDTO {
    private Long id;
    private Event event;
    private User user;
    private LocalDate attendanceDate;
    private Integer tickets;
    private Double paymentAmount;
    private LocalDateTime issueDate;
}
