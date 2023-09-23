package com.dh.finduback.service.imp;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.repository.IEventTypeRepository;
import com.dh.finduback.service.IEventService;
import com.dh.finduback.service.IEventTypeService;
import com.dh.finduback.service.IStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventTypeService implements IEventTypeService {
    private final IEventTypeRepository eventTypeRepository;
    private final IStorageService storageService;
    private final IEventService eventService;

    @Override
    public EventType create(EventType eventType, MultipartFile file1) {
        if (Objects.nonNull(file1) && !file1.isEmpty()) {
            eventType.setImage1(storageService.store(file1));
        }

        return eventTypeRepository.save(eventType);
    }

    @Override
    public Page<EventType> findAll(Pageable pageable) {
        return eventTypeRepository.findAll(pageable);
    }

    @Override
    public List<EventType> findAll() {
        return eventTypeRepository.findAll();
    }

    @Override
    public int deleteById(Long id) {
        Optional<EventType> eventTypeDBO = eventTypeRepository.findById(id);

        if (eventTypeDBO.isPresent()) {
            EventType eventTypeDB = eventTypeDBO.get();
            List<Event> eventsDB = eventService.findByEventType(eventTypeDB);

            for (Event event : eventsDB) {
                event.setEventType(null);
                try {
                    eventService.update(event.getId(), event);
                } catch (Exception ignored) {
                }
                eventService.softDeleteById(event.getId());
            }
            eventTypeRepository.deleteById(id);

            return 1;
        } else {
            return 0;
        }
    }
}
