import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { teams } from "../../constants/teams";

const GameCard = ({
  match: {
    time,
    team1,
    team2,
    score1,
    score2,
    guess1,
    guess2,
    points,
    started,
    variant,
  },
}) => {
  const [guess1Value, setGuess1Value] = guess1
    ? useState(guess1)
    : useState("");
  const [guess2Value, setGuess2Value] = guess2
    ? useState(guess2)
    : useState("");
  const [wasChanged, setWasChanged] = useState(false);
  const history = useHistory();

  const handleGuess1Change = (event) => {
    const { value } = event.target;
    const guess = Number.parseInt(value, 10);
    if (Number.isNaN(guess)) {
      setGuess1Value("");
      setWasChanged(false);
      return;
    }
    if (guess < 0 || guess > 9) return;
    setGuess1Value(guess);
    if (guess === "" || guess2Value === "") return;
    setWasChanged(true);
  };

  const handleGuess2Change = (event) => {
    const { value } = event.target;
    const guess = Number.parseInt(value, 10);
    if (Number.isNaN(guess)) {
      setGuess2Value("");
      setWasChanged(false);
      return;
    }
    if (guess < 0 || guess > 9) return;
    setGuess2Value(guess);
    if (guess1Value === "" || guess === "") {
      setWasChanged(false);
    } else {
      setWasChanged(true);
    }
  };

  const handleCancel = () => {
    setWasChanged(false);
    setGuess1Value(guess1 || "");
    setGuess2Value(guess2 || "");
  };

  const handleMatchRedirect = () => {
    if (started) history.push("/match");
  };

  const handleTeamRedirect = () => {
    if (started) history.push("/team");
  };

  const getColor = () => {
    if (variant === "good")
      return { textAlign: "center", backgroundColor: "rgba(0,255,0,0.3)" };
    if (variant === "average")
      return { textAlign: "center", backgroundColor: "rgba(255,255,0,0.3)" };
    if (variant === "bad")
      return { textAlign: "center", backgroundColor: "rgba(255,0,0,0.3)" };
    return null;
  };

  return (
    <Card elevation={5} style={started ? { cursor: "pointer" } : null}>
      <CardContent>
        <Grid item container spacing={1} xs={12}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h6">{time}</Typography>
            <Divider />
          </Grid>
          <Grid item xs={5} onClick={handleTeamRedirect}>
            <Typography
              variant="h6"
              className="link"
              style={{ textAlign: "center" }}
            >
              {teams[team1]}
            </Typography>
          </Grid>
          <Grid item xs={2} onClick={handleMatchRedirect}>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              {score1 && score2 ? `${score1} : ${score2}` : ""}
            </Typography>
          </Grid>
          <Grid
            className="link"
            item
            xs={5}
            onClick={handleTeamRedirect}
            style={{ textAlign: "center" }}
          >
            <Typography variant="h6">{teams[team2]}</Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} onClick={handleMatchRedirect}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="subtitle1">Spėjimas</Typography>
            <Divider />
          </Grid>
          <Grid item xs={5} style={{ textAlign: "center" }}>
            <TextField
              inputProps={{ style: { textAlign: "center" } }}
              fullWidth
              disabled={started}
              variant="outlined"
              value={guess1Value}
              onChange={handleGuess1Change}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h4" style={{ textAlign: "center" }}>
              :
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              inputProps={{ style: { textAlign: "center" } }}
              fullWidth
              disabled={started}
              variant="outlined"
              value={guess2Value}
              onChange={handleGuess2Change}
            />
          </Grid>
          {points ? (
            <>
              <Grid xs={12}>
                <Typography style={{ textAlign: "center" }} variant="subtitle1">
                  Taškai
                </Typography>
                <Divider />
                <Typography style={getColor()} variant="h6">
                  {points}
                </Typography>
              </Grid>
            </>
          ) : wasChanged ? (
            <>
              <Grid item xs={5}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Atšaukti
                </Button>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={5}>
                <Button fullWidth variant="contained" color="primary">
                  Patvirtinti
                </Button>
              </Grid>
              <Grid item xs={12} />
              <Grid item xs={12} />
            </>
          ) : (
            <>
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12} />
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GameCard;
