package com.dh.finduback.service.imp;

import com.dh.finduback.entity.Feature;
import com.dh.finduback.error.exception.FeatureNotFoundException;
import com.dh.finduback.repository.IFeatureRepository;
import com.dh.finduback.service.IFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeatureService implements IFeatureService {
    private final IFeatureRepository featureRepository;

    @Override
    public Feature create(Feature feature) {
        return featureRepository.save(feature);
    }

    @Override
    public Feature update(Long id, Feature feature) throws FeatureNotFoundException {
        Optional<Feature> featureDBO = featureRepository.findById(id);
        Feature featureDB;

        if (featureDBO.isEmpty()) {
            throw new FeatureNotFoundException("Característica no encontrada.");
        } else {
            featureDB = featureDBO.get();
        }

        featureDB.setName(feature.getName());
        featureDB.setIconCode(feature.getIconCode());

        return featureRepository.save(featureDB);
    }

    @Override
    public Page<Feature> findAll(Pageable pageable) {
        return featureRepository.findAll(pageable);
    }

    @Override
    public List<Feature> findAll() {
        return featureRepository.findAll();
    }

    @Override
    public Optional<Feature> findById(Long id) {
        return featureRepository.findById(id);
    }

    @Override
    public int deleteById(Long id) {
        if (featureRepository.existsById(id)) {
            featureRepository.deleteById(id);
            return 1;
        } else {
            return 0;
        }
    }
}
