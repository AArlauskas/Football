import { Grid, List, ListSubheader, Typography } from "@material-ui/core";
import React from "react";
import ResultListItem from "../../components/ResultListItem/ResultListItem";
import TeamCard from "../../components/TeamCard/TeamCard";
import TopBar from "../../components/TopBar/TopBar";
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

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: null,
      sortedMatchDates: null,
    };
  }

  componentDidMount() {
    const response = mockedPersonalData.filter(
      (match) => match.team1 === 8 || match.team2 === 8
    );
    const { transformedMatches } = transformMatches(response);
    const dates = sortMatchDates(transformedMatches);
    this.setState({ matches: transformedMatches, sortedMatchDates: dates });
  }

  render() {
    const { matches, sortedMatchDates } = this.state;
    if (matches === null || sortedMatchDates === null) return null;
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
            <TeamCard
              name="Belgija"
              won={5}
              tie={3}
              lost={1}
              flagUrl="https://image.flaticon.com/icons/png/512/197/197626.png"
            />
          </Grid>
          <Grid item lg={4} md={6} sm={8} xs={11} style={{ marginTop: 30 }}>
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
          </Grid>
        </Grid>
      </>
    );
  }
}

export default TeamPage;
