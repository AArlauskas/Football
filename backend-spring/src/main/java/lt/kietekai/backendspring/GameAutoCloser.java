package lt.kietekai.backendspring;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.GamesService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

@Component
@RequiredArgsConstructor
public class GameAutoCloser {
    private static final Logger log = LogManager.getLogger();
    private final GamesService gamesService;
    @Transactional
    @Scheduled(cron = "0 * * * * ?")
    public void autoClose() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.setTimeZone(TimeZone.getDefault());
        cal.setTimeZone(TimeZone.getTimeZone("GMT+3"));
        cal.add(Calendar.HOUR_OF_DAY, 3);
        cal.add(Calendar.MINUTE, 2);

        log.info("Auto close cutoff is {} (LTU time)", cal.getTime());
        gamesService.autoClose(cal.getTime());
    }

}
