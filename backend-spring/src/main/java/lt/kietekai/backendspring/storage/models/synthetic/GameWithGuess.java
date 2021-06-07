package lt.kietekai.backendspring.storage.models.synthetic;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Guess;

@RequiredArgsConstructor
@Getter
public class GameWithGuess {
    private final Game game;
    private final Guess guess;
}
