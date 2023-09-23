package com.dh.finduback.controller;

import com.dh.finduback.service.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

@RestController
@RequestMapping("/api/mediafiles")
public class FileSystemStorageController {
    @Autowired
    private IStorageService storageService;

    @PostMapping("/upload")
    public Map<String,String> uploadFile(@RequestParam MultipartFile file) {
        String filename = storageService.store(file);
        String url = storageService.getUrl(filename);
        return Map.of("url", url);
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        Resource file = storageService.loadAsResource(filename);
        String contentType = Files.probeContentType(file.getFile().toPath());

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(file);
    }
}
