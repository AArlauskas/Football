import { Divider, Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";

const getColor = (variant) => {
  if (variant === "correct_alone" || variant === "correct")
    return { textAlign: "center", backgroundColor: "rgba(0,255,0,0.3)" };
  if (variant === "outcome_only")
    return { textAlign: "center", backgroundColor: "rgba(255,255,0,0.3)" };
  if (variant === "outcome_incorrect" || variant === "not_given")
    return { textAlign: "center", backgroundColor: "rgba(255,0,0,0.3)" };
  return null;
};

const ResultListItem = ({ match }) => {
  const history = useHistory();

  const handleTeamRedirect = (code) => {
    history.push(`/team/${code}`);
  };

  const handleMatchRedirect = () => {
    history.push(`/match/${match.game.id}`);
  };

  return (
    <>
      <ListItem
        style={{ padding: 10, border: "1px solid rgba(0,0,0,0.3)" }}
        key={match.id}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} onClick={handleMatchRedirect}>
            <Typography style={{ textAlign: "center", cursor: "pointer" }}>
              {match.game.time}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ textAlign: "center" }} variant="h5">
              {match.game.result?.goals1}
            </Typography>
          </Grid>
          <Grid
            item
            xs={3}
            onClick={() => handleTeamRedirect(match.game.t1.code)}
          >
            <Typography
              variant="subtitle2"
              className="link"
              style={{ textAlign: "center" }}
            >
              {match.game.t1.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography style={{ textAlign: "center" }}>
              {match.guess?.result
                ? `${match.guess.result.goals1} : ${match.guess.result.goals2}`
                : "-"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={3}
            onClick={() => handleTeamRedirect(match.game.t2.code)}
          >
            <Typography
              variant="subtitle2"
              className="link"
              style={{ textAlign: "center" }}
            >
              {match.game.t2.name}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ textAlign: "center" }} variant="h5">
              {match.game.result?.goals2}
            </Typography>
          </Grid>
          {match.guess && match.game.state === "finished" && (
            <Grid
              item
              xs={12}
              style={{ cursor: "pointer" }}
              onClick={handleMatchRedirect}
            >
              <Divider />
              <Typography style={getColor(match.guess.outcome)}>
                {match.guess.points}
              </Typography>
            </Grid>
          )}
        </Grid>
      </ListItem>
    </>
  );
};

export default ResultListItem;
