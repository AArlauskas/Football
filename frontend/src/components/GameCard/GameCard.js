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

const GameCard = ({
  onSubmit,
  match: {
    id,
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

  const handleSumbit = () => {
    const guess = {
      gameId: id,
      result: {
        goals1: guess1Value,
        goals2: guess2Value,
      },
    };
    onSubmit(guess);
  };

  const handleMatchRedirect = () => {
    if (started) history.push(`/match/${id}`);
  };

  const handleTeamRedirect = (code) => {
    history.push(`/team/${code}`);
  };

  const getColor = () => {
    if (variant === "correct_alone" || variant === "correct")
      return { textAlign: "center", backgroundColor: "rgba(0,255,0,0.3)" };
    if (variant === "outcome_only")
      return { textAlign: "center", backgroundColor: "rgba(255,255,0,0.3)" };
    if (variant === "outcome_incorrect" || variant === "not_given")
      return { textAlign: "center", backgroundColor: "rgba(255,0,0,0.3)" };
    return null;
  };

  return (
    <Card elevation={5} style={started ? { cursor: "pointer" } : null}>
      <CardContent>
        <Grid item container spacing={1} xs={12} onClick={handleMatchRedirect}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h6">{time}</Typography>
            <Divider />
          </Grid>
          <Grid item xs={4} onClick={() => handleTeamRedirect(team1.code)}>
            <Typography
              variant="h6"
              className="link"
              style={{ textAlign: "center" }}
            >
              {team1.name}
            </Typography>
          </Grid>
          <Grid item xs={4} onClick={handleMatchRedirect}>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              {score1 && score2 ? `${score1} : ${score2}` : ""}
            </Typography>
          </Grid>
          <Grid item xs={4} onClick={() => handleTeamRedirect(team2.code)}>
            <Typography
              style={{ textAlign: "center" }}
              className="link"
              variant="h6"
            >
              {team2.name}
            </Typography>
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
              variant={started ? "filled" : "outlined"}
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
              variant={started ? "filled" : "outlined"}
              value={guess2Value}
              onChange={handleGuess2Change}
            />
          </Grid>
          {points || variant === "not_given" ? (
            <>
              <Grid item xs={12}>
                <Typography style={{ textAlign: "center" }} variant="subtitle1">
                  Taškai
                </Typography>
                <Divider />
                <Typography style={getColor()} variant="h6">
                  {variant === "not_given" ? "-" : points}
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
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSumbit}
                >
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
