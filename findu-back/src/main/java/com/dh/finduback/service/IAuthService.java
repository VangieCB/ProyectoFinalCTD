package com.dh.finduback.service;

import com.dh.finduback.controller.models.AuthRequest;
import com.dh.finduback.controller.models.AuthResponse;
import com.dh.finduback.controller.models.RegisterRequest;
import com.dh.finduback.error.exception.UserBadRequestException;

public interface IAuthService {
    AuthResponse register(RegisterRequest request) throws UserBadRequestException;
    AuthResponse authenticate(AuthRequest request);
}
