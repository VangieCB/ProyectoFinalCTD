package com.dh.finduback.dto;

import com.dh.finduback.entity.AvailableTicketsPerDay;
import com.dh.finduback.entity.Country;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.entity.Feature;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDTO {
    private Long id;
    private EventType eventType;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Integer ticketsEnabledPerDay;
    private Double pricePerTicket;
    private List<AvailableTicketsPerDay> availableTicketsPerDays;
    private String image1;
    private Set<String> additionalImages;
    private Country country;
    private String street;
    private Boolean active;
    private String policy1Name;
    private String policy1Description;
    private String policy2Name;
    private String policy2Description;
    private String policy3Name;
    private String policy3Description;
    private List<Feature> features;
}
