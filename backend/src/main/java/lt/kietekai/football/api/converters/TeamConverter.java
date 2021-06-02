package lt.kietekai.football.api.converters;

import lt.kietekai.football.storage.models.Team;

import java.util.function.Function;

public class TeamConverter implements Function<Team, lt.kietekai.football.api.models.Team> {
    @Override
    public lt.kietekai.football.api.models.Team apply(Team team) {
        return new lt.kietekai.football.api.models.Team(team.longCode(), team.name());
    }
}
