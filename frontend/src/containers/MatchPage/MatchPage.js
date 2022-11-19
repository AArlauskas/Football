import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import React from "react";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { getMatch } from "../../api/Api";
import TopBar from "../../components/TopBar/TopBar";

const getColor = (variant) => {
  if (variant === "correct_alone" || variant === "correct")
    return { backgroundColor: "rgba(0,255,0,0.3)" };
  if (variant === "outcome_only")
    return { backgroundColor: "rgba(255,255,0,0.3)" };
  if (variant === "outcome_incorrect" || variant === "not_given")
    return { backgroundColor: "rgba(255,0,0,0.3)" };
  return null;
};

class MatchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guessData: null,
      game: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { gameId } = match.params;
    getMatch(gameId).then((resp) => {
      const guesses = this.transformMatch(resp.data.guess);
      this.setState({ guessData: guesses, game: resp.data.game });
    });
  }

  transformMatch = (response) => {
    const match = {
      results: [],
    };
    response.forEach((data) => {
      const entry = {
        userId: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        variant: data.guess.outcome,
        points: data.guess.points,
        guess1: null,
        guess2: null,
      };
      if (data.guess.result) {
        entry.guess1 = data.guess.result.goals1;
        entry.guess2 = data.guess.result.goals2;
      }
      match.results.push(entry);
    });
    return match;
  };

  render() {
    const { history } = this.props;
    const { guessData, game } = this.state;

    const handleTeamRedirect = (code) => {
      history.push(`/team/${code}`);
    };

    const handlePlayerRedirect = (id) => {
      if (window.localStorage.getItem("id") === String(id))
        history.push("/personal");
      else history.push(`/player/${id}`);
    };

    if (guessData === null) return null;
    return (
      <>
        <Grid container direction="row" justify="center">
          <Grid item xs={12} sm={10} md={9} lg={7}>
            <TopBar darkMode />
            <Grid
              item
              container
              xs={12}
              style={{ textAlign: "center", paddingTop: 20 }}
            >
              <Grid item xs={12}>
                <Typography variant="subtitle1">{game.date}</Typography>
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: 20 }}>
                <Typography variant="subtitle2">{game.time}</Typography>
              </Grid>
              <Grid
                item
                xs={5}
                onClick={() => handleTeamRedirect(game.t1.code)}
              >
                <Typography className="link primary" variant="h5">
                  <FormattedMessage id={game.t1.code} />
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h5">
                  {game.result &&
                    `${game.result.goals1} : ${game.result.goals2}`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={5}
                onClick={() => handleTeamRedirect(game.t2.code)}
              >
                <Typography className="link primary" variant="h5">
                  <FormattedMessage id={game.t2.code} />
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ padding: 20 }}>
              <TableContainer component={Paper}>
                <Table style={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <FormattedMessage id="FULL_NAME" />
                      </TableCell>
                      <TableCell style={{ paddingLeft: 0 }}>
                        <FormattedMessage id="GUESS" />
                      </TableCell>
                      <TableCell style={{ paddingLeft: 0 }}>
                        <FormattedMessage id="POINTS" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {guessData.results.map((match) => (
                      <TableRow
                        hover
                        selected={
                          window.localStorage.getItem("id") ===
                          String(match.userId)
                        }
                        key={match.firstName + match.lastName}
                      >
                        <TableCell
                          style={{ cursor: "pointer" }}
                          onClick={() => handlePlayerRedirect(match.userId)}
                        >{`${match.firstName} ${match.lastName}`}</TableCell>
                        <TableCell>
                          {match.guess1 === null || match.guess2 === null ? (
                            <Clear />
                          ) : (
                            `${match.guess1} : ${match.guess2}`
                          )}
                        </TableCell>
                        <TableCell style={getColor(match.variant)}>
                          {match.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(MatchPage);
