package com.dh.finduback.converter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

public abstract class AbstractConverter<E,D> {
    public abstract D fromEntity(E entity);
    public abstract E fromDTO(D dto);

    public List<D> fromEntities(List<E> entities) {
        return entities.stream()
                .map(this::fromEntity)
                .collect(Collectors.toList());
    }

    public List<E> fromDTOs(List<D> dtos) {
        return dtos.stream()
                .map(this::fromDTO)
                .collect(Collectors.toList());
    }

    public Page<D> fromEntities(Page<E> entities) {
        List<D> dtos = entities.getContent().stream()
                .map(this::fromEntity)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, entities.getPageable(), entities.getTotalElements());
    }
}
