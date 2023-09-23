package com.dh.finduback.filter;

import com.dh.finduback.entity.Event;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class EventSpecifications {
    public static Specification<Event> isActive() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("active"));
    }

    public static Specification<Event> hasStartDateBetween(LocalDate fromDate, LocalDate toDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("startDate"), fromDate, toDate);
    }

    public static Specification<Event> hasEndDateBetween(LocalDate fromDate, LocalDate toDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("endDate"), fromDate, toDate);
    }

    public static Specification<Event> isDateRangeWithinEvent(LocalDate fromDate, LocalDate toDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.and(
                                criteriaBuilder.lessThanOrEqualTo(root.get("startDate"), fromDate),
                                criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), toDate)
                        )
                );
    }

    public static Specification<Event> hasNameOrEventTypeName(String searchText) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(root.get("name"), "%" + searchText + "%"),
                        criteriaBuilder.like(root.get("eventType").get("name"), "%" + searchText + "%")
                );
    }
}
