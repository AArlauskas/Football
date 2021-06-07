package lt.kietekai.backendspring.rest.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GuessOutcome {
    @JsonProperty("correct_alone")
    CORRECT_ALONE,
    @JsonProperty("correct")
    CORRECT,
    @JsonProperty("outcome_only")
    OUTCOME_ONLY,
    @JsonProperty("outcome_incorrect")
    OUTCOME_INCORRECT
}
