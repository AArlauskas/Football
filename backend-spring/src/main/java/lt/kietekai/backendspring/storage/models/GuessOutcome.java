package lt.kietekai.backendspring.storage.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GuessOutcome {
    CORRECT_ALONE,
    CORRECT,
    OUTCOME_ONLY,
    OUTCOME_INCORRECT
}
