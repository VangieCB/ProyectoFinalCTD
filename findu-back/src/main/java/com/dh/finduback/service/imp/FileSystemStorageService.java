package com.dh.finduback.service.imp;

import com.dh.finduback.service.IStorageService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileSystemStorageService implements IStorageService {
    @Autowired
    private HttpServletRequest request;

    @Value("${media.location}")
    private String mediaLocation;

    private Path rootLocation;

    @Override
    @PostConstruct
    public void init() {
        rootLocation = Paths.get(mediaLocation);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path rootPath = getPath(filename);
        try {
            Files.copy(file.getInputStream(), rootPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return filename;
    }

    @Override
    public Resource loadAsResource(String filename) {
        Path rootPath = getPath(filename);
        Resource resource;
        try {
            resource = new UrlResource(rootPath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Error in path: " + rootPath);
        }
        return resource;
    }

    @Override
    public Boolean delete(String filename) {
        Path rootPath = getPath(filename);
        File file = rootPath.toFile();
        return file.exists() && file.canRead() && file.delete();
    }

    @Override
    public String getUrl(String filename) {
        String host = request.getRequestURL().toString().replace(request.getRequestURI(), "");
        return ServletUriComponentsBuilder
                .fromHttpUrl(host)
                .path("/api/mediafiles/")
                .path(filename)
                .toUriString();
    }

    public Path getPath(String filename) {
        return rootLocation.resolve(filename).toAbsolutePath();
    }
}
