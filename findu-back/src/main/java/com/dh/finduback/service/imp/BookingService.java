package com.dh.finduback.service.imp;

import com.dh.finduback.entity.AvailableTicketsPerDay;
import com.dh.finduback.entity.Booking;
import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.User;
import com.dh.finduback.repository.IBookingRepository;
import com.dh.finduback.repository.IEventRepository;
import com.dh.finduback.repository.IUserRepository;
import com.dh.finduback.service.IBookingService;
import com.dh.finduback.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final IBookingRepository bookingRepository;
    private final IEventRepository eventRepository;
    private final IUserRepository userRepository;
    private final IEmailService emailService;

    @Override
    public Booking create(Booking booking, String email) {
        Optional<User> userDBO = userRepository.findUserByEmail(email);
        Optional<Event> eventDBO = eventRepository.findById(booking.getEvent().getId());

        User userDB = userDBO.get();
        Event eventDB = eventDBO.get();

        booking.setEvent(
                Event.builder()
                        .id(eventDB.getId())
                        .build()
        );
        booking.setUser(
                User.builder()
                        .id(userDB.getId())
                        .firstName(userDB.getFirstName())
                        .lastName(userDB.getLastName())
                        .email(userDB.getEmail())
                        .role(userDB.getRole())
                        .build()
        );
        booking.setPaymentAmount(eventDB.getPricePerTicket() * booking.getTickets());
        booking.setIssueDate(LocalDateTime.now());

        for (AvailableTicketsPerDay day : eventDB.getAvailableTicketsPerDays()) {
            if (day.getDate().equals(booking.getAttendanceDate())) {
                day.setTicketsConsumed(day.getTicketsConsumed() + booking.getTickets());
                break;
            }
        }
        eventRepository.save(eventDB);
        bookingRepository.save(booking);

        emailService.sendBookingEmail(booking, eventDB, userDB);

        return booking;
    }

    @Override
    public Page<Booking> findByUser(String email, Pageable pageable) {
        Optional<User> userDBO = userRepository.findUserByEmail(email);

        if (userDBO.isPresent()) {
            User userDB = userDBO.get();
            Page<Booking> bookingPage = bookingRepository.findByUserOrderByIssueDateDesc(userDB, pageable);
            List<Booking> bookingList = bookingPage.getContent().stream()
                    .map(this::modifyBooking)
                    .toList();
            return new PageImpl<>(bookingList, bookingPage.getPageable(), bookingPage.getTotalElements());
        } else {
            return Page.empty(pageable);
        }
    }

    private Booking modifyBooking(Booking booking) {
        booking.getEvent().setUsersLiked(null);
        booking.getUser().setPassword(null);
        booking.getUser().setLikedEvents(null);
        return booking;
    }
}
