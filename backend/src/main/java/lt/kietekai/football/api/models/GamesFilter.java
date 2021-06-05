package lt.kietekai.football.api.models;

public enum GamesFilter {
    ALL, TODAY, CLOSED;

    public static GamesFilter parse(String s) {
        for (GamesFilter f : GamesFilter.values()) {
            if (f.name().equalsIgnoreCase(s)) {
                return f;
            }
        }
        // all by default
        return ALL;
    }
}
