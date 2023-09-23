package com.dh.finduback.converter;

import com.dh.finduback.dto.EventDTO;
import com.dh.finduback.entity.AdditionalImage;
import com.dh.finduback.entity.Event;
import com.dh.finduback.service.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Component
public class EventConverter extends AbstractConverter<Event,EventDTO> {
    @Autowired
    private IStorageService storageService;

    @Override
    public EventDTO fromEntity(Event entity) {
        if (Objects.isNull(entity)) return null;

        String image1 = Objects.nonNull(entity.getImage1()) ? storageService.getUrl(entity.getImage1()) : null;

        Set<String> additionalImages = new HashSet<>();
        if (Objects.nonNull(entity.getAdditionalImages())) {
            for (AdditionalImage image : entity.getAdditionalImages()) {
                additionalImages.add(storageService.getUrl(image.getName()));
            }
        }

        return EventDTO.builder()
                .id(entity.getId())
                .eventType(entity.getEventType())
                .name(entity.getName())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .openingTime(entity.getOpeningTime())
                .closingTime(entity.getClosingTime())
                .ticketsEnabledPerDay(entity.getTicketsEnabledPerDay())
                .pricePerTicket(entity.getPricePerTicket())
                .availableTicketsPerDays(entity.getAvailableTicketsPerDays())
                .image1(image1)
                .additionalImages(additionalImages)
                .country(entity.getCountry())
                .street(entity.getStreet())
                .active(entity.getActive())
                .policy1Name(entity.getPolicy1Name())
                .policy1Description(entity.getPolicy1Description())
                .policy2Name(entity.getPolicy2Name())
                .policy2Description(entity.getPolicy2Description())
                .policy3Name(entity.getPolicy3Name())
                .policy3Description(entity.getPolicy3Description())
                .features(entity.getFeatures())
                .build();
    }

    @Override
    public Event fromDTO(EventDTO dto) {
        if (Objects.isNull(dto)) return null;

        return Event.builder()
                .id(dto.getId())
                .eventType(dto.getEventType())
                .name(dto.getName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .openingTime(dto.getOpeningTime())
                .closingTime(dto.getClosingTime())
                .ticketsEnabledPerDay(dto.getTicketsEnabledPerDay())
                .pricePerTicket(dto.getPricePerTicket())
                //.image1(dto.getImage1())
                .country(dto.getCountry())
                .street(dto.getStreet())
                .active(dto.getActive())
                .policy1Name(dto.getPolicy1Name())
                .policy1Description(dto.getPolicy1Description())
                .policy2Name(dto.getPolicy2Name())
                .policy2Description(dto.getPolicy2Description())
                .policy3Name(dto.getPolicy3Name())
                .policy3Description(dto.getPolicy3Description())
                .features(dto.getFeatures())
                .build();
    }
}
