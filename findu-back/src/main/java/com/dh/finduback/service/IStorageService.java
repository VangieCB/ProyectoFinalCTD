package com.dh.finduback.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface IStorageService {
    void init();
    String store(MultipartFile file);
    Resource loadAsResource(String filename);
    Boolean delete(String filename);
    String getUrl(String filename);
}
