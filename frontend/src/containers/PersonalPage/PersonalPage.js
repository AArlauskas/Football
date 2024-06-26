import {
  Grid,
  List,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { withRouter } from "react-router";
import React from "react";
import { FormattedMessage } from "react-intl";
import ReactSwipe from "react-swipe";
import ResultListItem from "../../components/ResultListItem/ResultListItem";
import GuessListItem from "../../components/GuessListItem/GuessListItem";
import TopBar from "../../components/TopBar/TopBar";
import UserCard from "../../components/UserCard/UserCard";
import { addGuess, getAllPersonalGames, getPersonalUser } from "../../api/Api";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";

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

const sortMatchDatesDesc = (cards) =>
  Object.keys(cards).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA.getTime() < dateB.getTime()) return 1;
    if (dateA.getTime() === dateB.getTime()) return 0;
    return -1;
  });

let reactSwipeEl;

class PersonalPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      openMatches: null,
      sortedOpenMatchDates: [],
      previousMatches: null,
      sortedPreviousMatchDates: [],
      tab: 0,
      showGuessSuccess: false,
      showGuessFail: false,
    };
  }

  componentDidMount() {
    const { history } = this.props;
    getPersonalUser()
      .then((responseStats) => {
        const user = responseStats.data;
        const stats = {
          firstName: user.firstName,
          lastName: user.lastName,
          good: user.points.correctAlone + user.points.correctGuesses,
          average: user.points.correctOutcomes,
          bad: user.points.incorrect + user.points.notGiven,
          points: user.points.total,
          rank: user.points.place || "Nėra",
        };
        this.setState({
          stats,
        });
        getAllPersonalGames()
          .then((response) => {
            this.transformOpenMatches(response);
            this.transformPreviousMatches(response);
          })
          .catch(() => history.push("/home"));
      })
      .catch(() => history.push("/home"));
  }

  transformOpenMatches = (response) => {
    const { transformedMatches } = transformMatches(
      response.data.filter((game) => game.game.state === "open")
    );
    const openDates = sortMatchDates(transformedMatches);
    this.setState({
      openMatches: transformedMatches,
      sortedOpenMatchDates: openDates,
    });
  };

  transformPreviousMatches = (response) => {
    const { transformedMatches } = transformMatches(
      response.data.filter((game) => game.game.state !== "open")
    );
    const previousDates = sortMatchDatesDesc(transformedMatches);

    this.setState({
      previousMatches: transformedMatches,
      sortedPreviousMatchDates: previousDates,
    });
  };

  handleSwipe = (index) => {
    if (index) this.setState({ tab: 1 });
    else this.setState({ tab: 0 });
  };

  handleGuess = (data) => {
    addGuess(data)
      .then(() => this.setState({ showGuessSuccess: true }))
      .catch(() => this.setState({ showGuessFail: true }));
  };

  hideSnackabar = () => {
    this.setState({ showGuessFail: false, showGuessSuccess: false });
  };

  render() {
    const {
      stats,
      openMatches,
      sortedOpenMatchDates,
      previousMatches,
      sortedPreviousMatchDates,
      tab,
      showGuessSuccess,
      showGuessFail,
    } = this.state;
    if (stats === null || openMatches === null || previousMatches === null)
      return null;
    return (
      <>
        {showGuessSuccess && (
          <CustomSnackbar
            topCenter
            messageIntl="SUCESSFUL_GUESS_SUBMIT"
            onClose={this.hideSnackabar}
            severity="success"
          />
        )}
        {showGuessFail && (
          <CustomSnackbar
            topCenter
            messageIntl="GENERAL_ERROR"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
        <Grid
          container
          direction="column"
          alignItems="stretch"
          alignContent="center"
          justify="center"
        >
          <Grid item xs={12}>
            <TopBar darkMode />
          </Grid>
          {stats && (
            <Grid item lg={4} md={6} sm={8} xs={11} style={{ marginTop: 30 }}>
              <UserCard
                firstname={stats.firstName}
                lastname={stats.lastName}
                points={stats.points}
                ranking={stats.rank}
                good={stats.good}
                bad={stats.bad}
                average={stats.average}
              />
            </Grid>
          )}
          <Grid item lg={4} md={6} sm={8} xs={11} style={{ marginTop: 30 }}>
            <Tabs
              TabIndicatorProps={{ style: { background: "#EDEEE4" } }}
              value={tab}
              variant="fullWidth"
              onChange={(e, newValue) => {
                this.setState({ tab: newValue });
                if (newValue) {
                  reactSwipeEl.next();
                } else reactSwipeEl.prev();
              }}
            >
              <Tab label={<FormattedMessage id="UPCOMING_GAMES" />} value={0} />
              <Tab label={<FormattedMessage id="PAST_GAMES" />} value={1} />
            </Tabs>
          </Grid>
          <Grid item lg={4} md={6} sm={8} xs={11} style={{ marginTop: 30 }}>
            <ReactSwipe
              swipeOptions={{ continuous: false, callback: this.handleSwipe }}
              ref={(el) => {
                reactSwipeEl = el;
              }}
            >
              <List>
                {sortedOpenMatchDates.map((date) => (
                  <>
                    <ListSubheader
                      disableSticky
                      style={{ paddingTop: 20 }}
                      key={date}
                    >
                      <Typography style={{ textAlign: "center" }}>
                        {date}
                      </Typography>
                    </ListSubheader>
                    {openMatches[date].map((match) => (
                      <GuessListItem
                        handleGuess={this.handleGuess}
                        match={match}
                        key={match.game.id}
                      />
                    ))}
                  </>
                ))}
              </List>
              <List>
                {sortedPreviousMatchDates.map((date) => (
                  <>
                    <ListSubheader
                      disableSticky
                      style={{ paddingTop: 20 }}
                      key={date}
                    >
                      <Typography style={{ textAlign: "center" }}>
                        {date}
                      </Typography>
                    </ListSubheader>
                    {previousMatches[date].map((match) => (
                      <ResultListItem match={match} />
                    ))}
                  </>
                ))}
              </List>
            </ReactSwipe>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(PersonalPage);
