package lt.kietekai.backendspring.rest.models;

public enum GamesFilter {
    ALL("all"),
    UPCOMING_CLOSED("upcoming-closed"),
    OVERVIEW("overview");

    private final String value;

    GamesFilter(String value) {
        this.value = value;
    }

    public static GamesFilter parse(String value) {
        for (GamesFilter f : GamesFilter.values()) {
            if (f.value.equalsIgnoreCase(value)) {
                return f;
            }
        }
        // all by default
        return ALL;
    }
}
