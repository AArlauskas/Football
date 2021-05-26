import { CardContent, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";

const TeamCard = ({ name, won, tie, lost, flagUrl }) => (
  <Paper elevation={5}>
    <CardContent direction="column">
      <Grid container style={{ textAlign: "center" }} spacing={2}>
        <Grid item xs={12}>
          <img src={flagUrl} alt="country flag" width={75} height={75} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">{name}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Laimėjo: {won}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Lygiosios: {tie}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Pralaimėjo: {lost}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Paper>
);

export default TeamCard;
