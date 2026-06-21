package com.project.interview.service;

import com.project.interview.config.AppProps;
import com.project.interview.entity.InterviewEntity;
import com.project.interview.entity.UserEntity;
import com.project.interview.enumeration.InterviewStatus;
import com.project.interview.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MailService {
    private static final String REQUEST_URL_TEMPLATE = "%s?token=%s";

    private final JavaMailSender mailSender;

    private final InterviewRepository interviewRepository;
    private final AppProps appProps;

    @Value("${reminder.email.attempts}")
    private int maxRetryAttempts;

    @Value("${reminder.email.retryDelayInMinutes}")
    private long retryDelayInMinutes;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${user.create.endpoint}")
    private String userCreateEndpoint;

    @Value("${submit.email.subject}")
    private String submitSubject;

    @Value("${submit.email.text}")
    private String submitText;

    @Value("${reset-password.email.subject}")
    private String resetPasswordEmailSubject;

    @Value("${reset-password.email.text}")
    private String resetPasswordEmailText;

    @Value("${reset-password.endpoint}")
    private String resetPasswordEndpoint;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${host}")
    private String host;


    public void sendEmailSubmitLetter(String to,
                                      String token) {
        String requestUrl = String.format(REQUEST_URL_TEMPLATE, userCreateEndpoint, token);
        String text = String.format(
                submitText,
                requestUrl,
                appProps.getJwt().getExpirationTimeInMinutes());

        send(to, submitSubject, text);
    }

    public void sendResetPasswordEmail(String to,
                                       String token) {
        String requestUrl = String.format(REQUEST_URL_TEMPLATE, resetPasswordEndpoint, token);
        String text = String.format(
                resetPasswordEmailText,
                requestUrl,
                appProps.getJwt().getExpirationTimeInMinutes());

        send(to, resetPasswordEmailSubject, text);
    }

    public void send(String to,
                     String subject,
                     String text) {
        MimeMessagePreparator preparator =
                mimeMessage -> {
                    final MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                    message.setTo(to);
                    message.setSubject(subject);
                    message.setFrom(username);
                    message.setText(text, true);
                };
        try {
            mailSender.send(preparator);
        } catch (MailException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email sending was failed!", e);
        }
    }

    @Scheduled(cron = "0 50 17 * * ?")
    public void sendInterviewReminders() {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfTomorrow = tomorrow.plusDays(1).minusSeconds(1);

        List<InterviewEntity> scheduledInterviews = interviewRepository.findByStatusAndPlannedDateTimeBetween(
                InterviewStatus.PLANNED, tomorrow, endOfTomorrow);
        for (InterviewEntity interview : scheduledInterviews) {

            UserEntity interviewer = interview.getInterviewer();
            UserEntity searcher = interview.getSearcher();

            String interviewLink = generateInterviewLink(interview);

            sendReminder(interviewer, searcher, interviewLink);
            sendReminder(searcher, interviewer, interviewLink);
        }
    }

    public String generateInterviewLink(InterviewEntity interview) {
        String url = String.format(host + "interview/%s", interview.getId());
        return String.format("<a href=%s><h3>%s<h3/></a>", url, interview.getTitle());
    }

    public void sendReminder(UserEntity recipient, UserEntity counterpart, String interviewLink) {
        boolean success = false;
        int retryAttempts = 0;
        while (!success && retryAttempts < maxRetryAttempts) {
            try {
                String messageText = String.format(
                        "<p>Доброго дня, %s!</p>" +
                                "<p>Нагадуємо вам про заплановане інтерв'ю з %s %s завтра. </p>" +
                                "<p>Посилання на інтерв'ю: %s</p>",
                        recipient.getFirstname(), counterpart.getFirstname(), counterpart.getLastname(), interviewLink
                );

                send(recipient.getEmail(), "Нагадування про заплановане інтерв'ю", messageText);
                log.info("Sent reminder to " + recipient.getId() + ": " + recipient.getEmail());
                success = true;
            } catch (Exception e) {
                log.error("Failed to send reminder to " + recipient.getId() + ": " + recipient.getEmail(), e);
                retryAttempts++;
                if (retryAttempts >= maxRetryAttempts) {
                    notifyAdmin(recipient, interviewLink, e);
                }
                try {
                    Thread.sleep(retryDelayInMinutes * 60 * 1000);
                } catch (InterruptedException ex) {
                    log.error("Interrupted Exception", ex);
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    public void notifyAdmin(UserEntity recipient, String link, Exception e) {
        String subject = "Failed to send reminder after multiple attempts";
        String text = String.format("Failed to send reminder to %s (%s) after %d attempts. Error: %s. <p>Interview link: %s</p>",
                recipient.getFirstname(), recipient.getEmail(), maxRetryAttempts, e.getMessage(), link);
        try {
            send(adminEmail, subject, text);
            log.info("Sent failure notification to admin: " + adminEmail);
        } catch (Exception ex) {
            log.error("Failed to send failure notification to admin: " + adminEmail, ex);
        }
    }
}
