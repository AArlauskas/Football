import {
  Grid,
  List,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React from "react";
import ReactSwipe from "react-swipe";
import ResultListItem from "../../components/ResultListItem/ResultListItem";
import GuessListItem from "../../components/GuessListItem/GuessListItem";
import TopBar from "../../components/TopBar/TopBar";
import UserCard from "../../components/UserCard/UserCard";
import { mockedPersonalData } from "../../constants/mocked";

const transformMatches = (cards) => {
  const transformedMatches = cards.reduce((acc, val) => {
    if (!acc[val.date]) {
      acc[val.date] = [];
    }
    acc[val.date].push(val);
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

const countResults = (response) => {
  const good = response.filter((match) => match.variant === "good").length;
  const average = response.filter(
    (match) => match.variant === "average"
  ).length;
  const bad = response.filter((match) => match.variant === "bad").length;
  const results = {
    good,
    average,
    bad,
  };
  return results;
};

let reactSwipeEl;

class GuessesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      matches: [],
      sortedMatchDates: [],
      tab: 0,
    };
  }

  componentDidMount() {
    const response = mockedPersonalData;
    const results = countResults(response);
    const { transformedMatches } = transformMatches(response);
    const dates = sortMatchDates(transformedMatches);
    this.setState({
      results,
      matches: transformedMatches,
      sortedMatchDates: dates,
    });
  }

  handleSwipe = (index) => {
    if (index) this.setState({ tab: 1 });
    else this.setState({ tab: 0 });
  };

  render() {
    const { results, matches, sortedMatchDates, tab } = this.state;
    if (results === null) return null;
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
            <TopBar
              darkMode
              points={420}
              showAvatarAndLogout
              firstName="Aurimas"
              lastName="Arlauskas"
            />
          </Grid>
          <Grid item lg={4} md={6} sm={8} xs={11} style={{ marginTop: 30 }}>
            <UserCard
              firstname="Aurimas"
              lastname="Arlauskas"
              points={420}
              ranking={1}
              outOf={12}
              good={results.good}
              bad={results.bad}
              average={results.average}
            />
          </Grid>
          <Grid item lg={8} md={6} sm={8} xs={11} style={{ marginTop: 30 }}>
            <Tabs
              TabIndicatorProps={{ style: { background: "#f1c40f" } }}
              value={tab}
              variant="fullWidth"
              onChange={(e, newValue) => {
                this.setState({ tab: newValue });
                if (newValue) {
                  reactSwipeEl.next();
                } else reactSwipeEl.prev();
              }}
            >
              <Tab label="Ateinančios varžybos" value={0} />
              <Tab label="Praėjusios varžybos" value={1} />
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
                {sortedMatchDates.map((date) => (
                  <>
                    <ListSubheader
                      disableSticky
                      style={{ paddingTop: 20 }}
                      key={date}
                    >
                      <Typography style={{ textAlign: "center" }}>
                        {date}
                      </Typography>
                      {matches[date].map((match) => (
                        <GuessListItem match={match} />
                      ))}
                    </ListSubheader>
                  </>
                ))}
              </List>
              <List>
                {sortedMatchDates.map((date) => (
                  <>
                    <ListSubheader
                      disableSticky
                      style={{ paddingTop: 20 }}
                      key={date}
                    >
                      <Typography style={{ textAlign: "center" }}>
                        {date}
                      </Typography>
                      {matches[date].map((match) => (
                        <ResultListItem match={match} />
                      ))}
                    </ListSubheader>
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

export default GuessesPage;
