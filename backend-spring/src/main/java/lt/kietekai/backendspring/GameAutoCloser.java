package lt.kietekai.backendspring;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.GamesService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Calendar;
import java.util.TimeZone;

@Component
@RequiredArgsConstructor
public class GameAutoCloser {
    private final GamesService gamesService;
    @Transactional
    @Scheduled(cron = "* * * * * ?")
    public void autoClose() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, 2);
        cal.setTimeZone(TimeZone.getDefault());
        cal.setTimeZone(TimeZone.getTimeZone("GMT+3"));
        gamesService.autoClose(cal.getTime());
    }

}
