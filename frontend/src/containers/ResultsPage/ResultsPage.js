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
import React from "react";
import { withRouter } from "react-router";
import { getResults } from "../../api/Api";
import TopBar from "../../components/TopBar/TopBar";

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    const { history } = this.props;
    getResults()
      .then((response) => {
        this.setState({ results: response.data });
      })
      .catch(() => history.push("/home"));
  }

  handlePlayerRedirect = (id) => {
    const { history } = this.props;
    if (String(id) === window.localStorage.getItem("id")) {
      history.push("/personal");
    } else history.push(`/player/${id}`);
  };

  render() {
    const { results } = this.state;
    return (
      <>
        <Grid container spacing={0} justify="center">
          <Grid item xs={12}>
            <TopBar darkMode />
          </Grid>
          <Grid item xs={12} style={{ marginTop: 30, marginBottom: 30 }}>
            <Typography style={{ textAlign: "center" }} variant="h4">
              Rezultatai
            </Typography>
          </Grid>
          <Grid item xs={12} sm={11}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Vieta</TableCell>
                    <TableCell>Vardas Pavardė</TableCell>
                    <TableCell align="center">Taškai</TableCell>
                    <TableCell align="center">Atspėtas rezultatas</TableCell>
                    <TableCell align="center">Atspėta baigtis</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((player, index) => (
                    <TableRow
                      hover
                      selected={
                        String(player.id) === window.localStorage.getItem("id")
                      }
                      key={player.id}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        style={{ cursor: "pointer" }}
                        onClick={() => this.handlePlayerRedirect(player.id)}
                      >{`${player.firstName} ${player.lastName}`}</TableCell>
                      <TableCell align="center">
                        {player.points.total}
                      </TableCell>
                      <TableCell align="center">
                        {player.points.correctGuesses}
                      </TableCell>
                      <TableCell align="center">
                        {player.points.correctOutcomes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(ResultsPage);
