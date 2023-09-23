package com.dh.finduback.error.handler;

import com.dh.finduback.error.dto.ErrorMessage;
import com.dh.finduback.error.exception.FeatureNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class FeatureExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(FeatureNotFoundException.class)
    public ResponseEntity<ErrorMessage> notFound(FeatureNotFoundException e) {
        ErrorMessage message = ErrorMessage.builder().status(HttpStatus.NOT_FOUND).message(e.getMessage()).build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }
}
