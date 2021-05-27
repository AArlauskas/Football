import { Divider, Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import { teams } from "../../constants/teams";

const getColor = (variant) => {
  if (variant === "good")
    return { textAlign: "center", backgroundColor: "rgba(0,255,0,0.3)" };
  if (variant === "average")
    return { textAlign: "center", backgroundColor: "rgba(255,255,0,0.3)" };
  if (variant === "bad")
    return { textAlign: "center", backgroundColor: "rgba(255,0,0,0.3)" };
  return null;
};

const ResultListItem = ({ match }) => {
  const history = useHistory();
  const handleTeamRedirect = () => {
    history.push("/team");
  };

  return (
    <>
      <ListItem
        style={{ padding: 10, border: "1px solid rgba(0,0,0,0.3)" }}
        key={match.id}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography style={{ textAlign: "center" }}>
              {match.time}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ textAlign: "center" }} variant="h5">
              {match.score1}
            </Typography>
          </Grid>
          <Grid item xs={3} onCLick={handleTeamRedirect}>
            <Typography
              variant="subtitle2"
              className="link"
              style={{ textAlign: "center" }}
            >
              {teams[match.team1]}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography style={{ textAlign: "center" }}>
              {match.score1} : {match.score2}
            </Typography>
          </Grid>
          <Grid item xs={3} onCLick={handleTeamRedirect}>
            <Typography
              variant="subtitle2"
              className="link"
              style={{ textAlign: "center" }}
            >
              {teams[match.team2]}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ textAlign: "center" }} variant="h5">
              {match.score2}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Typography style={getColor(match.variant)}>
              {match.points || "-"}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
};

export default ResultListItem;
