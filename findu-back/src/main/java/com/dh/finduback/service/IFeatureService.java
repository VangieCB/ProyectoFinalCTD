package com.dh.finduback.service;

import com.dh.finduback.entity.Feature;
import com.dh.finduback.error.exception.FeatureNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IFeatureService {
    Feature create(Feature feature);
    Feature update(Long id, Feature feature) throws FeatureNotFoundException;
    Page<Feature> findAll(Pageable pageable);
    List<Feature> findAll();
    Optional<Feature> findById(Long id);
    int deleteById(Long id);
}
