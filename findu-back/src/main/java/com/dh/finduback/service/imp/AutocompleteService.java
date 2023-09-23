package com.dh.finduback.service.imp;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.service.IAutocompleteService;
import com.dh.finduback.service.IEventService;
import com.dh.finduback.service.IEventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AutocompleteService implements IAutocompleteService {
    private final IEventService eventService;
    private final IEventTypeService eventTypeService;

    @Override
    public Set<String> home() {
        Set<String> keywords = new HashSet<>();
        List<Event> events = eventService.findByActiveTrue();
        List<EventType> eventTypes = eventTypeService.findAll();

        keywords.addAll(events.stream().map(Event::getName).toList());
        keywords.addAll(eventTypes.stream().map(EventType::getName).toList());

        return keywords;
    }
}
