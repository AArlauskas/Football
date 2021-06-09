package lt.kietekai.backendspring.rest.models;

public record Points(int total, int correctAlone, int correctGuesses, int correctOutcomes, int incorrect, int notGiven,  int place) {
}
