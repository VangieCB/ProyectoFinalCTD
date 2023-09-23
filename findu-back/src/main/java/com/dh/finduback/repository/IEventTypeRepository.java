package com.dh.finduback.repository;

import com.dh.finduback.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEventTypeRepository extends JpaRepository<EventType,Long> {
}
