import {
  Button,
  Divider,
  Grid,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";

const GuessListItem = ({ match, handleGuess }) => {
  const [guess1, setGuess1] = useState(match.guess?.result?.goals1 || "");
  const [guess2, setGuess2] = useState(match.guess?.result?.goals2 || "");
  const [wasChanged, setWasChanged] = useState(false);
  const history = useHistory();

  const handleGuess1Change = (event) => {
    const { value } = event.target;
    const guess = Number.parseInt(value, 10);
    if (Number.isNaN(guess)) {
      setGuess1("");
      setWasChanged(false);
      return;
    }
    if (guess < 0 || guess > 9) return;
    setGuess1(guess);
    if (guess === "" || guess2 === "") return;
    setWasChanged(true);
  };

  const handleGuess2Change = (event) => {
    const { value } = event.target;
    const guess = Number.parseInt(value, 10);
    if (Number.isNaN(guess)) {
      setGuess2("");
      setWasChanged(false);
      return;
    }
    if (guess < 0 || guess > 9) return;
    setGuess2(guess);
    if (guess1 === "" || guess === "") {
      setWasChanged(false);
    } else {
      setWasChanged(true);
    }
  };

  const handleTeamRedirect = (code) => {
    history.push(`/team/${code}`);
  };

  const onGuess = () => {
    setWasChanged(false);
    const guess = {
      gameId: match.game.id,
      result: {
        goals1: guess1,
        goals2: guess2,
      },
    };
    handleGuess(guess);
  };

  return (
    <ListItem
      style={{ padding: 10, border: "1px solid rgba(0,0,0,0.3)" }}
      key={match.id}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography style={{ textAlign: "center" }}>
            {match.game.time}
          </Typography>
          <Divider />
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
        <Grid item xs={6} container>
          <Grid item xs={5}>
            <TextField
              type="number"
              disabled={match.game.state === "closed"}
              inputProps={{ style: { textAlign: "center" } }}
              fullWidth
              value={guess1}
              onChange={handleGuess1Change}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ textAlign: "center" }}>:</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              type="number"
              disabled={match.game.state === "closed"}
              inputProps={{ style: { textAlign: "center" } }}
              fullWidth
              value={guess2}
              onChange={handleGuess2Change}
            />
          </Grid>
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
            {match.game.t2.name}
          </Typography>
        </Grid>
        {wasChanged && (
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={onGuess}
            >
              Patvirtinti
            </Button>
          </Grid>
        )}
      </Grid>
    </ListItem>
  );
};

export default GuessListItem;
