import { Grid, Typography } from "@material-ui/core";
import React from "react";

const TeamCard = ({ name, flagUrl }) => (
  <Grid container style={{ textAlign: "center" }} spacing={2}>
    <Grid item xs={12}>
      <img src={flagUrl} alt="country flag" width={75} height={75} />
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h3">{name}</Typography>
    </Grid>
  </Grid>
);

export default TeamCard;
