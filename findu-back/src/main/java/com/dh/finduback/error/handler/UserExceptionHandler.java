package com.dh.finduback.error.handler;

import com.dh.finduback.error.dto.ErrorMessage;
import com.dh.finduback.error.exception.UserBadRequestException;
import com.dh.finduback.error.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class UserExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(UserBadRequestException.class)
    public ResponseEntity<ErrorMessage> badRequest(UserBadRequestException e) {
        ErrorMessage message = ErrorMessage.builder().status(HttpStatus.BAD_REQUEST).message(e.getMessage()).build();
        return ResponseEntity.badRequest().body(message);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorMessage> notFound(UserNotFoundException e) {
        ErrorMessage message = ErrorMessage.builder().status(HttpStatus.NOT_FOUND).message(e.getMessage()).build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }
}
