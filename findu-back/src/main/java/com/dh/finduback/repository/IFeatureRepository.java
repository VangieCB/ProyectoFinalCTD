package com.dh.finduback.repository;

import com.dh.finduback.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFeatureRepository extends JpaRepository<Feature,Long> {
}
