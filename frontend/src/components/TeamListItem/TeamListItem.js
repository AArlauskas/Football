import { Divider, Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";

const TeamListItem = ({ match }) => {
  const history = useHistory();

  const handleTeamRedirect = (code) => {
    history.push(`/team/${code}`);
    window.location.reload();
  };

  const handleMatchRedirect = () => {
    history.push(`/match/${match.id}`);
  };

  return (
    <ListItem
      style={{ padding: 10, border: "1px solid rgba(0,0,0,0.3)" }}
      key={match.id}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} onClick={handleMatchRedirect}>
          <Typography style={{ textAlign: "center", cursor: "pointer" }}>
            {match.time}
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={1}>
          <Typography style={{ textAlign: "center" }} variant="h5">
            {match.result.goals1}
          </Typography>
        </Grid>
        <Grid item xs={5} onClick={() => handleTeamRedirect(match.t1.code)}>
          <Typography
            variant="subtitle2"
            className="link primary"
            style={{ textAlign: "center" }}
          >
            {match.t1.name}
          </Typography>
        </Grid>
        <Grid item xs={5} onClick={() => handleTeamRedirect(match.t2.code)}>
          <Typography
            variant="subtitle2"
            className="link primary"
            style={{ textAlign: "center" }}
          >
            {match.t2.name}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography style={{ textAlign: "center" }} variant="h5">
            {match.result.goals2}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default TeamListItem;
