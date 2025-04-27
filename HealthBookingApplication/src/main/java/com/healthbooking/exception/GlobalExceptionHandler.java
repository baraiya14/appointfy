package com.healthbooking.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.security.web.firewall.RequestRejectedException;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RequestRejectedException.class)
    public ResponseEntity<String> handleRequestRejectedException(RequestRejectedException ex) {
        logger.error("Request rejected: {}", ex.getMessage());
        return new ResponseEntity<>("Request was rejected: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // You can add more exception handlers here
}