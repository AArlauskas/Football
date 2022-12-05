import { Button, Grid } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import React from "react";
import MatchesByDate from "../../components/MatchesByDate/MatchesByDate";
import "./styles.css";
import TopBar from "../../components/TopBar/TopBar";
import { addGuess, getTodayGames } from "../../api/Api";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import { IS_STATISTICS_ENABLED } from "../../constants";

const transformMatches = (cards) => {
  const transformedMatches = cards.reduce((acc, val) => {
    if (!acc[val.game.date]) {
      acc[val.game.date] = [];
    }
    acc[val.game.date].push(val);
    return acc;
  }, {});
  return { transformedMatches };
};

const sortMatchDates = (cards) =>
  Object.keys(cards).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA.getTime() < dateB.getTime()) return -1;
    if (dateA.getTime() === dateB.getTime()) return 0;
    return 1;
  });

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      sortedMatchDates: [],
      showGuessSuccess: false,
      showGuessFail: false,
    };
  }

  componentDidMount() {
    getTodayGames()
      .then((response) => {
        const { transformedMatches } = transformMatches(response.data);
        const dates = sortMatchDates(transformedMatches);
        this.setState({
          matches: transformedMatches,
          sortedMatchDates: dates,
        });
      })
      .catch(() => {
        window.localStorage.clear();
        window.location.reload();
      });
  }

  render() {
    const { matches, sortedMatchDates, showGuessSuccess, showGuessFail } =
      this.state;

    const onGuessSubmit = (guess) => {
      addGuess(guess)
        .then(() => this.setState({ showGuessSuccess: true }))
        .catch(() => this.setState({ showGuessFail: true }));
    };

    const hideSnackabar = () =>
      this.setState({ showGuessSuccess: false, showGuessFail: false });

    return (
      <>
        {showGuessSuccess && (
          <CustomSnackbar
            topCenter
            messageIntl="SUCESSFUL_GUESS_SUBMIT"
            onClose={hideSnackabar}
            severity="success"
          />
        )}
        {showGuessFail && (
          <CustomSnackbar
            topCenter
            messageIntl="GENERAL_ERROR"
            onClose={hideSnackabar}
            severity="error"
          />
        )}
        <Grid container direction="column" className="home">
          <Grid item>
            <TopBar darkMode />
          </Grid>
          {IS_STATISTICS_ENABLED ? (
            <div style={{ textAlign: "center" }}>
              <h3>
                <FormattedMessage id="STATISTICS_HEADER_TEXT" />
              </h3>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  window.location.href = "/statistics_2022_test.txt";
                }}
              >
                <FormattedMessage id="STATISTICS_BUTTON_TEXT" />
              </Button>
            </div>
          ) : null}
          {sortedMatchDates.map((date) => (
            <Grid item container direction="column" spacing={5} key={date}>
              <MatchesByDate
                onSubmit={onGuessSubmit}
                matches={matches[date]}
                date={date}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
}

export default HomePage;
