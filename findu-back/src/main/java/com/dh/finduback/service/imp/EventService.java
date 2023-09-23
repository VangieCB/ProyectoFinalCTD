package com.dh.finduback.service.imp;

import com.dh.finduback.entity.*;
import com.dh.finduback.error.exception.EventBadRequestException;
import com.dh.finduback.error.exception.EventNotFoundException;
import com.dh.finduback.filter.EventSpecifications;
import com.dh.finduback.repository.IEventRepository;
import com.dh.finduback.service.IEventService;
import com.dh.finduback.service.IStorageService;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;

@Service
public class EventService implements IEventService {
    @Autowired
    private IEventRepository eventRepository;
    @Autowired
    private IStorageService storageService;

    @Override
    public Event create(Event event, MultipartFile file1, Set<MultipartFile> additionalFiles) throws EventBadRequestException {
        if (eventRepository.findByNameIgnoreCaseAndDeletedFalse(event.getName()).isPresent()) {
            throw new EventBadRequestException("El nombre del evento ya está en uso.");
        }

        List<AvailableTicketsPerDay> availableTicketsPerDays = generateDatesBetween(event.getStartDate(), event.getEndDate()).stream()
                .map(date -> AvailableTicketsPerDay.builder()
                        .date(date)
                        .ticketsEnabled(event.getTicketsEnabledPerDay())
                        .ticketsConsumed(0)
                        .event(event)
                        .build()
                )
                .toList();
        event.setAvailableTicketsPerDays(availableTicketsPerDays);

        if (Objects.nonNull(file1) && !file1.isEmpty()) {
            event.setImage1(storageService.store(file1));
        }

        if (Objects.nonNull(additionalFiles)) {
            Set<AdditionalImage> additionalImages = new HashSet<>();
            for (MultipartFile file : additionalFiles) {
                if (!file.isEmpty()) {
                    additionalImages.add(AdditionalImage.builder().name(storageService.store(file)).build());
                }
            }
            if (!additionalImages.isEmpty()) {
                event.setAdditionalImages(additionalImages);
            }
        }

        return eventRepository.save(event);
    }

    @Override
    public Event update(Long id, Event event) throws EventNotFoundException {
        Optional<Event> eventDBO = eventRepository.findById(id);
        Event eventDB;

        if (eventDBO.isEmpty()) {
            throw new EventNotFoundException("Evento no encontrado.");
        } else {
            eventDB = eventDBO.get();
        }

        eventDB.setEventType(event.getEventType());

        return eventRepository.save(eventDB);
    }

    @Override
    public Page<Event> findByDeletedFalse(Pageable pageable) {
        return eventRepository.findByDeletedFalse(pageable);
    }

    @Override
    public Page<Event> findActiveRandoms(Pageable pageable) {
        return eventRepository.findActiveRandoms(pageable);
    }

    @Override
    public Page<Event> findByEventTypeAndActiveTrue(EventType eventType, Pageable pageable) {
        return eventRepository.findByEventTypeAndActiveTrue(eventType, pageable);
    }

    @Override
    public List<Event> findByActiveTrue() {
        return eventRepository.findByActiveTrue();
    }

    @Override
    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    @Transactional
    public int softDeleteById(Long id) {
        return eventRepository.softDeleteById(id);
    }

    @Override
    public Page<Event> findActiveEventsByFilters(LocalDate fromDate, LocalDate toDate, String searchText, Pageable pageable) {
        Specification<Event> spec = Specification.where(EventSpecifications.isActive());

        if (Objects.nonNull(fromDate) && Objects.nonNull(toDate)) {
            //spec = spec.and(
            //        EventSpecifications.hasStartDateBetween(fromDate, toDate)
            //                .or(EventSpecifications.hasEndDateBetween(fromDate, toDate))
            //                .or(EventSpecifications.isDateRangeWithinEvent(fromDate, toDate))
            //);

            // Agregar una sub consulta para verificar la disponibilidad de tickets
            spec = spec.and((root, query, criteriaBuilder) -> {
                Subquery<Integer> subquery = query.subquery(Integer.class);
                Root<AvailableTicketsPerDay> subRoot = subquery.from(AvailableTicketsPerDay.class);
                subquery.select(criteriaBuilder.literal(1)); // Utiliza un valor literal 1 para indicar que hay al menos un ticket disponible
                subquery.where(
                        criteriaBuilder.equal(subRoot.get("event"), root), // Relación entre Event y AvailableTicketsPerDay
                        criteriaBuilder.greaterThan(subRoot.get("ticketsEnabled"), subRoot.get("ticketsConsumed")), // Verifica que hay tickets disponibles
                        criteriaBuilder.between(subRoot.get("date"), fromDate, toDate) // Verifica que la fecha esté dentro del rango
                );
                return criteriaBuilder.exists(subquery);
            });
        }

        if (Objects.nonNull(searchText) && !searchText.isBlank()) {
            spec = spec.and(EventSpecifications.hasNameOrEventTypeName(searchText));
        }

        return eventRepository.findAll(spec, pageable);
    }

    @Override
    public List<Event> findByEventType(EventType eventType) {
        return eventRepository.findByEventType(eventType);
    }

    @Override
    public Page<Event> findByUsersLikedAndActiveTrue(User user, Pageable pageable) {
        return eventRepository.findByUsersLikedAndActiveTrue(user, pageable);
    }

    @Override
    public List<Event> findByUsersLikedAndActiveTrue(User user) {
        return eventRepository.findByUsersLikedAndActiveTrue(user);
    }

    private List<LocalDate> generateDatesBetween(LocalDate startDate, LocalDate endDate) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            dates.add(currentDate);
            currentDate = currentDate.plusDays(1);
        }

        return dates;
    }
}
