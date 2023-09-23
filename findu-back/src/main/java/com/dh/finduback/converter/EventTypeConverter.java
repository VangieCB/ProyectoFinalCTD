package com.dh.finduback.converter;

import com.dh.finduback.dto.EventTypeDTO;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.service.IStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class EventTypeConverter extends AbstractConverter<EventType, EventTypeDTO> {
    private final IStorageService storageService;

    @Override
    public EventTypeDTO fromEntity(EventType entity) {
        if (Objects.isNull(entity)) return null;

        String image1 = Objects.nonNull(entity.getImage1()) ? storageService.getUrl(entity.getImage1()) : null;

        return EventTypeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .image1(image1)
                .build();
    }

    @Override
    public EventType fromDTO(EventTypeDTO dto) {
        if (Objects.isNull(dto)) return null;

        return EventType.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                //.image1(dto.getImage1())
                .build();
    }
}
