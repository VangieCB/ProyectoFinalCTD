package com.dh.finduback.service.imp;

import com.dh.finduback.entity.Booking;
import com.dh.finduback.entity.Event;
import com.dh.finduback.entity.User;
import com.dh.finduback.service.IEmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {
    private final JavaMailSender javaMailSender;

    @Value("${url.front}")
    private String urlFront;

    @Override
    public void sendRegistrationEmail(User user) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            String content = loadEmailTemplate("registration.html");
            content = content.replace("[USER_FIRST_NAME]", user.getFirstName());
            content = content.replace("[USER_EMAIL]", user.getEmail());
            content = content.replace("[URL_FRONT]", urlFront);

            messageHelper.setTo(user.getEmail());
            messageHelper.setSubject("\uD83D\uDC64 FindU - Registro de Usuario Exitoso");
            messageHelper.setText(content, true);

            javaMailSender.send(message);
        } catch (Exception e) {
            System.out.println("No se pudo enviar el email: " + e.getMessage());
        }
    }

    @Override
    public void sendBookingEmail(Booking booking, Event event, User user) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            String content = loadEmailTemplate("booking.html");
            content = content.replace("[USER_FIRST_NAME]", user.getFirstName());
            content = content.replace("[EVENT_NAME]", event.getName());
            content = content.replace("[BOOKING_NUMBER]", booking.getId().toString());
            content = content.replace("[BOOKING_DATE]", booking.getAttendanceDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            content = content.replace("[EVENT_TIME]", event.getOpeningTime().toString() + "hs - " + event.getClosingTime().toString() + "hs");
            content = content.replace("[EVENT_ADDRESS]", event.getStreet());
            content = content.replace("[BOOKING_PAYMENT_AMOUNT]", booking.getPaymentAmount().toString());
            content = content.replace("[BOOKING_TICKETS]", booking.getTickets().toString());
            content = content.replace("[USER_FULL_NAME]", user.getFirstName() + " " + user.getLastName());

            messageHelper.setTo(user.getEmail());
            messageHelper.setSubject("\uD83C\uDFAB✔\uFE0F FindU - Confirmación de la Reserva");
            messageHelper.setText(content, true);

            javaMailSender.send(message);
        } catch (Exception e) {
            System.out.println("No se pudo enviar el email: " + e.getMessage());
        }
    }

    private String loadEmailTemplate(String templateName) {
        try {
            Resource resource = new ClassPathResource("templates/email/" + templateName);
            byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.out.println("No se pudo cargar el template: " + e.getMessage());
            return "";
        }
    }
}
