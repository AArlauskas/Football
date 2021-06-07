package lt.kietekai.backendspring.rest.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GameState {
    @JsonProperty("open")
    OPEN,
    @JsonProperty("closed")
    CLOSED,
    @JsonProperty("finished")
    FINISHED
}
