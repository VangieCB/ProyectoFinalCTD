package com.dh.finduback.controller;

import com.dh.finduback.converter.FeatureConverter;
import com.dh.finduback.dto.FeatureDTO;
import com.dh.finduback.entity.Feature;
import com.dh.finduback.error.exception.FeatureNotFoundException;
import com.dh.finduback.service.IFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/features")
@RequiredArgsConstructor
public class FeatureController {
    private final IFeatureService featureService;
    private final FeatureConverter featureConverter;

    @PostMapping
    public ResponseEntity<FeatureDTO> create(@RequestBody FeatureDTO featureDTO) {
        Feature feature = featureConverter.fromDTO(featureDTO);
        featureDTO = featureConverter.fromEntity(featureService.create(feature));
        return ResponseEntity.ok(featureDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeatureDTO> update(
            @PathVariable Long id,
            @RequestBody FeatureDTO featureDTO
    ) throws FeatureNotFoundException {
        Feature feature = featureConverter.fromDTO(featureDTO);
        featureDTO = featureConverter.fromEntity(featureService.update(id, feature));
        return ResponseEntity.ok(featureDTO);
    }

    @GetMapping
    public ResponseEntity<Page<FeatureDTO>> findAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<FeatureDTO> featuresDTO = featureConverter.fromEntities(featureService.findAll(pageable));
        return ResponseEntity.ok(featuresDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeatureDTO>> findAll() {
        List<FeatureDTO> featuresDTO = featureConverter.fromEntities(featureService.findAll());
        return ResponseEntity.ok(featuresDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<FeatureDTO>> findById(@PathVariable Long id) {
        Optional<Feature> feature = featureService.findById(id);

        if (feature.isEmpty()) {
            return ResponseEntity.ok(Optional.empty());
        } else {
            FeatureDTO featureDTO = featureConverter.fromEntity(feature.get());
            return ResponseEntity.ok(Optional.of(featureDTO));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        return ResponseEntity.ok(featureService.deleteById(id));
    }
}
