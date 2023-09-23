package com.dh.finduback.converter;

import com.dh.finduback.dto.FeatureDTO;
import com.dh.finduback.entity.Feature;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class FeatureConverter extends AbstractConverter<Feature,FeatureDTO> {
    @Override
    public FeatureDTO fromEntity(Feature entity) {
        if (Objects.isNull(entity)) return null;

        return FeatureDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .iconCode(entity.getIconCode())
                .build();
    }

    @Override
    public Feature fromDTO(FeatureDTO dto) {
        if (Objects.isNull(dto)) return null;

        return Feature.builder()
                .id(dto.getId())
                .name(dto.getName())
                .iconCode(dto.getIconCode())
                .build();
    }
}
