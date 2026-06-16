package lt.kietekai.backendspring;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Guess;
import lt.kietekai.backendspring.storage.models.MatchReminder;
import lt.kietekai.backendspring.storage.models.User;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.GuessRepository;
import lt.kietekai.backendspring.storage.repositories.MatchReminderRepository;
import lt.kietekai.backendspring.storage.repositories.UserRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MatchReminderSender {
    private static final Logger log = LogManager.getLogger();
    private static final ThreadLocal<SimpleDateFormat> dateFormatter = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd HH:mm"));

    private final GameRepository gameRepository;
    private final GuessRepository guessRepository;
    private final MatchReminderRepository matchReminderRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Value("${match.reminder.language:en}")
    private String language;

    @Value("${match.reminder.from:${spring.mail.username:}}")
    private String from;

    @Value("${match.reminder.app.url:}")
    private String appUrl;

    @Transactional
    @Scheduled(cron = "0 * * * * ?")
    public void sendReminders() {
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.MINUTE, 30);
        Date reminderCutoff = cal.getTime();

        gameRepository.getUpcomingForReminders(now, reminderCutoff).forEach(game ->
                userRepository.findAll().forEach(user -> sendReminderIfNeeded(game, user)));
    }

    private void sendReminderIfNeeded(Game game, User user) {
        if (user.isMatchReminderDisabled()) {
            return;
        }

        Optional<Guess> guess = guessRepository.findByUserAndGame(user, game);
        if (guess.isPresent() && guess.get().getResult1() != null && guess.get().getResult2() != null) {
            return;
        }
        if (matchReminderRepository.existsByGameAndUser(game, user)) {
            return;
        }

        try {
            mailSender.send(message(game, user));
            matchReminderRepository.save(new MatchReminder(game, user));
            log.info("Sent match reminder to {} for game {}", user.getEmail(), game.getId());
        } catch (MailException e) {
            log.warn("Failed to send match reminder to {} for game {}", user.getEmail(), game.getId(), e);
        }
    }

    private SimpleMailMessage message(Game game, User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        if (!from.isBlank()) {
            message.setFrom(from);
        }

        String match = game.getTeam1().getLongCode() + " - " + game.getTeam2().getLongCode();
        String startsAt = dateFormatter.get().format(game.getGameDate());
        if (isLithuanian()) {
            message.setSubject("Nepamiršk pateikti spėjimo");
            message.setText(lithuanianText(user, match, startsAt));
        } else {
            message.setSubject("Do not forget to submit your guess");
            message.setText(englishText(user, match, startsAt));
        }
        return message;
    }

    private String lithuanianText(User user, String match, String startsAt) {
        String text = "Sveiki, " + user.getFirstName() + ",\n\n"
                + "Rungtynės " + match + " prasidės " + startsAt + ".\n"
                + "Dar nepateikėte savo spėjimo. Iki rungtynių pradžios liko mažiau nei 30 minučių.";
        return appendAppUrl(text);
    }

    private String englishText(User user, String match, String startsAt) {
        String text = "Hi " + user.getFirstName() + ",\n\n"
                + "The match " + match + " starts at " + startsAt + ".\n"
                + "You have not submitted your guess yet. There are less than 30 minutes left before kick-off.";
        return appendAppUrl(text);
    }

    private String appendAppUrl(String text) {
        if (appUrl.isBlank()) {
            return text;
        }
        return text + "\n\n" + appUrl;
    }

    private boolean isLithuanian() {
        return "lt".equalsIgnoreCase(language) || "lithuanian".equalsIgnoreCase(language);
    }
}
