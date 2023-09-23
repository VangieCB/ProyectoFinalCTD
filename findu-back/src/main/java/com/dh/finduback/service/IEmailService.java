package com.dh.finduback.service;

import com.dh.finduback.entity.Booking;
import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.User;

public interface IEmailService {
    void sendRegistrationEmail(User user);
    void sendBookingEmail(Booking booking, Event event, User user);
}
