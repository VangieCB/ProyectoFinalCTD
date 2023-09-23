package com.dh.finduback.error.handler;

import com.dh.finduback.error.dto.ErrorMessage;
import com.dh.finduback.error.exception.EventBadRequestException;
import com.dh.finduback.error.exception.EventNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class EventExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(EventBadRequestException.class)
    public ResponseEntity<ErrorMessage> badRequest(EventBadRequestException e) {
        ErrorMessage message = ErrorMessage.builder().status(HttpStatus.BAD_REQUEST).message(e.getMessage()).build();
        return ResponseEntity.badRequest().body(message);
    }

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ErrorMessage> notFound(EventNotFoundException e) {
        ErrorMessage message = ErrorMessage.builder().status(HttpStatus.NOT_FOUND).message(e.getMessage()).build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }
}
