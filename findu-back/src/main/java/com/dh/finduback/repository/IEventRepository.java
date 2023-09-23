package com.dh.finduback.repository;

import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.EventType;
import com.dh.finduback.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IEventRepository extends JpaRepository<Event,Long>, JpaSpecificationExecutor<Event> {
    Optional<Event> findByNameIgnoreCaseAndDeletedFalse(String name);

    Page<Event> findByDeletedFalse(Pageable pageable);

    @Query(value = "SELECT * FROM events e WHERE e.active = true ORDER BY RAND()", nativeQuery = true)
    Page<Event> findActiveRandoms(Pageable pageable);

    Page<Event> findByEventTypeAndActiveTrue(EventType eventType, Pageable pageable);

    List<Event> findByActiveTrue();

    @Modifying
    @Query("UPDATE Event e SET e.active = false, e.deleted = true WHERE e.id = :id")
    int softDeleteById(Long id);

    List<Event> findByEventType(EventType eventType);

    Page<Event> findByUsersLikedAndActiveTrue(User user, Pageable pageable);
    List<Event> findByUsersLikedAndActiveTrue(User user);
}
