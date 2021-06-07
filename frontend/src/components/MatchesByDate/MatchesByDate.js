import { Divider, Grid, Typography } from "@material-ui/core";
import React from "react";
import GameCard from "../GameCard/GameCard";

const MatchesByDate = ({ matches, date, onSubmit }) => (
  <Grid item container direction="column">
    <Grid item>
      <Typography style={{ paddingTop: 10 }} variant="h6">
        {date}
      </Typography>
      <Divider style={{ marginBottom: 20 }} />
    </Grid>
    <Grid item container direction="row" spacing={3}>
      {matches.map((match) => {
        const adaptedMatch = {
          id: match.id,
          date: match.date,
          time: match.time,
          team1: match.team1,
          team2: match.team2,
          started: match.state !== "open",
        };
        if (match.result !== null) {
          adaptedMatch.score1 = match.result.goals1;
          adaptedMatch.score2 = match.result.goals2;
        }
        if (match.guess !== undefined) {
          adaptedMatch.guess1 = match.guess.goals1;
          adaptedMatch.guess2 = match.guess.goals2;
        }
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={match.id}>
            <GameCard onSubmit={onSubmit} match={adaptedMatch} />
          </Grid>
        );
      })}
    </Grid>
  </Grid>
);

export default MatchesByDate;
