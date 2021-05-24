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
import TopBar from "../../components/TopBar/TopBar";
import { MockedMatch } from "../../constants/mocked";
import { teams } from "../../constants/teams";

const getColor = (variant) => {
  if (variant === "good") return { backgroundColor: "rgba(0,255,0,0.3)" };
  if (variant === "average") return { backgroundColor: "rgba(255,255,0,0.3)" };
  if (variant === "bad") return { backgroundColor: "rgba(255,0,0,0.3)" };
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
    const response = MockedMatch;
    let title = "";
    if (response.score1 && response.score2) {
      title = `${teams[response.team1]} ${response.score1} : ${
        response.score2
      } ${teams[response.team2]}`;
    } else {
      title = `${teams[response.team1]} :  ${teams[response.team2]}`;
    }
    this.setState({ title, matchData: response });
  }

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
                        style={{ cursor: "pointer" }}
                        key={match.firstName + match.lastname}
                      >
                        <TableCell>{`${match.firstname} ${match.lastname}`}</TableCell>
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

export default MatchPage;
