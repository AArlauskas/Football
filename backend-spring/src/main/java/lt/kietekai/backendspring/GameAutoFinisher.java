package lt.kietekai.backendspring;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.FifaMatchClient;
import lt.kietekai.backendspring.storage.GamesService;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class GameAutoFinisher {
    private static final Logger log = LogManager.getLogger();
    // 45 + 45 + 15 + 5 = 110 minutes (first half + second half + break + approximate extra time)
    private static final int EXPECTED_MATCH_DURATION_MINUTES = 110;

    private final GameRepository gameRepository;
    private final GamesService gamesService;
    private final FifaMatchClient fifaMatchClient;

    @Value("${match.finisher.enabled:true}")
    private boolean enabled;

    @Transactional
    @Scheduled(cron = "0 * * * * ?")
    public void finishClosedMatches() {
        if (!enabled) {
            return;
        }

        List<Game> games = gameRepository.getClosedUnfinishedStartedBefore(matchEndCutoff());
        if (games.isEmpty()) {
            return;
        }

        FifaMatchClient.MatchSnapshot fifaMatches = fifaMatchClient.freshSnapshot();
        games.forEach(game -> finishIfResultFound(game, fifaMatches));
    }

    private Date matchEndCutoff() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, -EXPECTED_MATCH_DURATION_MINUTES);
        return cal.getTime();
    }

    private void finishIfResultFound(Game game, FifaMatchClient.MatchSnapshot fifaMatches) {
        Optional<FifaMatchClient.FifaResult> result = fifaMatches.finishedResult(game);
        if (result.isEmpty()) {
            log.info("No finished FIFA result found for game {}", game.getId());
            return;
        }

        game.setResult1(result.get().goals1());
        game.setResult2(result.get().goals2());
        gamesService.finishGame(game);

        log.info("Finished game {} with result {}-{}", game.getId(), game.getResult1(), game.getResult2());
    }
}
