import { Grid } from "@material-ui/core";
import React from "react";
import MatchesByDate from "../../components/MatchesByDate/MatchesByDate";
import "./styles.css";
import { mockedHomeData } from "../../constants/mocked";
import TopBar from "../../components/TopBar/TopBar";

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

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      sortedMatchDates: [],
    };
  }

  componentDidMount() {
    const { transformedMatches } = transformMatches(mockedHomeData);
    const dates = sortMatchDates(transformedMatches);
    this.setState({
      matches: transformedMatches,
      sortedMatchDates: dates,
    });
  }

  render() {
    const { matches, sortedMatchDates } = this.state;
    return (
      <>
        <Grid container direction="column" className="home">
          <Grid item>
            <TopBar
              darkMode
              title="Home page"
              showAvatarAndLogout
              firstName="Aurimas"
              lastName="Arlauskas"
            />
          </Grid>
          {sortedMatchDates.map((date) => (
            <Grid item container direction="column" spacing={5} key={date}>
              <MatchesByDate matches={matches[date]} date={date} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
}

export default HomePage;
