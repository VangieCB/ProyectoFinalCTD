package com.dh.finduback.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import java.time.LocalDate;

@Entity
@Table(name = "available_tickets_per_day")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@Where(clause = "tickets_enabled > tickets_consumed")
public class AvailableTicketsPerDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Integer ticketsEnabled;
    private Integer ticketsConsumed;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    @JsonIgnore
    private Event event;
}
