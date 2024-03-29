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
import { FormattedMessage } from "react-intl";
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
  const [guess1Value, setGuess1Value] =
    guess1 || guess1 === 0 ? useState(guess1) : useState("");
  const [guess2Value, setGuess2Value] =
    guess2 || guess2 === 0 ? useState(guess2) : useState("");
  const [wasChanged, setWasChanged] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    setWasChanged(false);
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
    <Card
      elevation={isHovered ? 10 : 3}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: "100%" }}
    >
      <CardContent>
        <Grid item container spacing={1} xs={12}>
          <Grid
            item
            xs={12}
            style={
              started
                ? { cursor: "pointer", textAlign: "center" }
                : { textAlign: "center" }
            }
            onClick={handleMatchRedirect}
          >
            <Typography variant="h6">{time}</Typography>
            <Divider />
          </Grid>
          <Grid item xs={4} onClick={() => handleTeamRedirect(team1.code)}>
            <Typography
              variant="h6"
              className="link primary"
              style={{ textAlign: "center" }}
            >
              <FormattedMessage id={team1.code} />
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            onClick={handleMatchRedirect}
            style={started ? { cursor: "pointer" } : null}
          >
            <Typography variant="h5" style={{ textAlign: "center" }}>
              {(score1 || score1 === 0) && (score2 || score2 === 0)
                ? `${score1} : ${score2}`
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={4} onClick={() => handleTeamRedirect(team2.code)}>
            <Typography
              style={{ textAlign: "center" }}
              className="link primary"
              variant="h6"
            >
              <FormattedMessage id={team2.code} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} onClick={handleMatchRedirect}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="subtitle1">
              <FormattedMessage id="GUESS" />
            </Typography>
            <Divider />
          </Grid>
          {variant === "not_given" ? (
            <Grid item xs={12}>
              <Typography style={{ textAlign: "center", paddingBottom: 30 }}>
                <FormattedMessage id="NOT_GIVEN_GUESS" />
              </Typography>
            </Grid>
          ) : (
            <>
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
            </>
          )}

          {points || variant === "not_given" ? (
            <>
              <Grid
                item
                xs={12}
                onClick={handleMatchRedirect}
                style={started ? { cursor: "pointer" } : null}
              >
                <Typography style={{ textAlign: "center" }} variant="subtitle1">
                  <FormattedMessage id="POINTS" />
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
                  <FormattedMessage id="CANCEL" />
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
                  <FormattedMessage id="CONFIRM" />
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
