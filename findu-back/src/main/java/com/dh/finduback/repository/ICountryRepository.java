package com.dh.finduback.repository;

import com.dh.finduback.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICountryRepository extends JpaRepository<Country,Long> {
}
