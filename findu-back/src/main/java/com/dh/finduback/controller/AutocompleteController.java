package com.dh.finduback.controller;

import com.dh.finduback.service.IAutocompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/autocomplete")
@RequiredArgsConstructor
public class AutocompleteController {
    private final IAutocompleteService autocompleteService;

    @GetMapping("/home")
    public ResponseEntity<Set<String>> home() {
        return ResponseEntity.ok(autocompleteService.home());
    }
}
