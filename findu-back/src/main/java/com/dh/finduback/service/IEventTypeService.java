package com.dh.finduback.service;

import com.dh.finduback.entity.EventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IEventTypeService {
    EventType create(EventType eventType, MultipartFile file1);
    Page<EventType> findAll(Pageable pageable);
    List<EventType> findAll();
    int deleteById(Long id);
}
