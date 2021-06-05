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
      {matches.map((match) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={match.id}>
          <GameCard onSubmit={onSubmit} match={match} />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

export default MatchesByDate;
