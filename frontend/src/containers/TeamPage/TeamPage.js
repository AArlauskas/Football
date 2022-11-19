import { Grid, List, ListSubheader, Typography } from "@material-ui/core";
import React from "react";
import { withRouter } from "react-router";
import { getTeam } from "../../api/Api";
import TeamCard from "../../components/TeamCard/TeamCard";
import TeamListItem from "../../components/TeamListItem/TeamListItem";
import TopBar from "../../components/TopBar/TopBar";
import { teamsFlags } from "../../constants/teamsFlags";

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
      team: null,
      matches: null,
      sortedMatchDates: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { teamId } = match.params;
    const { history } = this.props;
    getTeam(teamId)
      .then((response) => {
        const { transformedMatches } = transformMatches(response.data);
        const dates = sortMatchDates(transformedMatches);
        const url = teamsFlags[teamId];
        if (url === undefined) {
          history.push("/home");
        }
        this.setState({
          matches: transformedMatches,
          sortedMatchDates: dates,
          team: { code: teamId, url: teamsFlags[teamId].url },
        });
      })
      .catch(() => history.push("/home"));
  }

  render() {
    const { matches, sortedMatchDates, team } = this.state;
    if (matches === null || sortedMatchDates === null) return null;
    return (
      <>
        <Grid container justify="center">
          <Grid item xs={12}>
            <TopBar darkMode />
          </Grid>
          <Grid item xs={11} sm={10} md={8} lg={7} style={{ marginTop: 30 }}>
            <TeamCard code={team.code} flagUrl={team.url} />
          </Grid>
          <Grid item xs={11} sm={10} md={8} lg={7} style={{ marginTop: 30 }}>
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
                  </ListSubheader>
                  {matches[date].map((match) => (
                    <TeamListItem key={match.id} match={match} />
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

export default withRouter(TeamPage);
