package lt.kietekai.football.api.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GameState {
    @JsonProperty("open")
    OPEN,
    @JsonProperty("closed")
    CLOSED,
    @JsonProperty("finished")
    FINISHED
}
