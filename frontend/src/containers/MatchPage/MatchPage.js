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
import { withRouter } from "react-router";
import { getMatch } from "../../api/Api";
import TopBar from "../../components/TopBar/TopBar";
import { teams } from "../../constants/teams";

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
      title: "",
      matchData: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { gameId } = match.params;
    getMatch(gameId).then((resp) => {
      const response = this.transformMatch(resp.data);
      let title = "";
      if (response.score1 && response.score2) {
        title = `${teams[response.team1]} ${response.score1} : ${
          response.score2
        } ${teams[response.team2]}`;
      } else {
        title = `${teams[response.team1]} :  ${teams[response.team2]}`;
      }
      this.setState({ title, matchData: response });
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
    const { title, matchData } = this.state;
    if (matchData === null) return null;
    return (
      <>
        <Grid container direction="row">
          <Grid item xs={12}>
            <TopBar
              darkMode
              points={420}
              showAvatarAndLogout
              firstName="Aurimas"
              lastName="Arlauskas"
            />
            <Grid item xs={12} style={{ textAlign: "center", paddingTop: 20 }}>
              <Typography variant="h5">{title}</Typography>
            </Grid>
            <Grid item xs={12} style={{ padding: 20 }}>
              <TableContainer component={Paper}>
                <Table style={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vardas Pavardė</TableCell>
                      <TableCell style={{ paddingLeft: 0 }}>Spėjimas</TableCell>
                      <TableCell style={{ paddingLeft: 0 }}>Taškai</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchData.results.map((match) => (
                      <TableRow
                        hover
                        selected={
                          window.localStorage.getItem("id") ===
                          String(match.userId)
                        }
                        style={{ cursor: "pointer" }}
                        key={match.firstName + match.lastname}
                      >
                        <TableCell>{`${match.firstName} ${match.lastName}`}</TableCell>
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
