package com.dh.finduback.controller;

import com.dh.finduback.converter.CountryConverter;
import com.dh.finduback.dto.CountryDTO;
import com.dh.finduback.service.ICountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {
    private final ICountryService countryService;
    private final CountryConverter countryConverter;

    @GetMapping("/all")
    public ResponseEntity<List<CountryDTO>> findAll() {
        List<CountryDTO> countriesDTO = countryConverter.fromEntities(countryService.findAll());
        return ResponseEntity.ok(countriesDTO);
    }
}
