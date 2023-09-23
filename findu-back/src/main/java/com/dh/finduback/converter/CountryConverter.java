package com.dh.finduback.converter;

import com.dh.finduback.dto.CountryDTO;
import com.dh.finduback.entity.Country;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CountryConverter extends AbstractConverter<Country,CountryDTO> {
    @Override
    public CountryDTO fromEntity(Country entity) {
        if (Objects.isNull(entity)) return null;

        return CountryDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    @Override
    public Country fromDTO(CountryDTO dto) {
        if (Objects.isNull(dto)) return null;

        return Country.builder()
                .id(dto.getId())
                .name(dto.getName())
                .build();
    }
}
