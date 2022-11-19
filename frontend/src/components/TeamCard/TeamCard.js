import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const TeamCard = ({ code, flagUrl }) => (
  <Grid container style={{ textAlign: "center" }} spacing={2}>
    <Grid item xs={12}>
      <img src={flagUrl} alt="country flag" width={75} height={75} />
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h3">
        <FormattedMessage id={code} />
      </Typography>
    </Grid>
  </Grid>
);

export default TeamCard;
