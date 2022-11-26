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
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { getResults } from "../../api/Api";
import TopBar from "../../components/TopBar/TopBar";
import BouncingBall from "../../assets/ResultsPage/bouncing-ball.gif";

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
              <FormattedMessage id="RESULTS" />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={11}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id="PLACE" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="FULL_NAME" />
                    </TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="POINTS" />
                    </TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="CORRECT_GUESSES" />
                    </TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="CORRECT_OUTCOMES" />
                    </TableCell>
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
                      <TableCell>
                        {index + 1}
                        {player.firstName.startsWith("Evaldas") && (
                          <img
                            height="20px"
                            width="20px"
                            src={BouncingBall}
                            alt="ball"
                            style={{ marginLeft: "5px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        style={{ cursor: "pointer" }}
                        onClick={() => this.handlePlayerRedirect(player.id)}
                      >
                        {`${player.firstName} ${player.lastName}`}
                      </TableCell>
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
