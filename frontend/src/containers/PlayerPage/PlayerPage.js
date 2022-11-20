import { Grid, List, ListSubheader, Typography } from "@material-ui/core";
import React from "react";
import { withRouter } from "react-router";
import { getAllPlayerGames, getUser } from "../../api/Api";
import ResultListItem from "../../components/ResultListItem/ResultListItem";
import TopBar from "../../components/TopBar/TopBar";
import UserCard from "../../components/UserCard/UserCard";

const sortMatchDatesDesc = (cards) =>
  Object.keys(cards).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA.getTime() < dateB.getTime()) return 1;
    if (dateA.getTime() === dateB.getTime()) return 0;
    return -1;
  });

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

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      matches: null,
      sortedDates: [],
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { userId } = match.params;
    const { history } = this.props;
    getUser(userId)
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
        getAllPlayerGames(userId)
          .then((responseGames) => {
            const notOpenGames = responseGames.data.filter(
              (el) => el.game.state !== "open"
            );
            const { transformedMatches } = transformMatches(notOpenGames);
            const sortedDates = sortMatchDatesDesc(transformedMatches);
            this.setState({
              matches: transformedMatches,
              sortedDates,
              stats,
            });
          })
          .catch(() => history.push("/home"));
      })
      .catch(() => history.push("/home"));
  }

  render() {
    const { stats, matches, sortedDates } = this.state;
    if (!stats || !matches || !sortedDates) return null;
    return (
      <>
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
            <List>
              {sortedDates.map((date) => (
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
                  {matches[date].map((match) => (
                    <ResultListItem
                      handleGuess={this.handleGuess}
                      match={match}
                      key={match.game.id}
                    />
                  ))}
                </>
              ))}
            </List>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(PlayerPage);
