import React from "react";
import { withRouter } from "react-router";
import { getAllPlayerGames, getPoints } from "../../api/Api";

const sortMatchDates = (cards) =>
  Object.keys(cards).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA.getTime() < dateB.getTime()) return -1;
    if (dateA.getTime() === dateB.getTime()) return 0;
    return 1;
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
    getPoints(userId).then((responseStats) => {
      const stats = {
        good: responseStats.data.correctGuesses,
        average: responseStats.data.correctOutcomes,
        bad: 5,
        points: responseStats.data.total,
        rank: 1,
      };
      getAllPlayerGames(userId).then((responseGames) => {
        const { transformedMatches } = transformMatches(responseGames.data);
        const sortedDates = sortMatchDates(transformedMatches);
        this.setState({
          matches: transformedMatches,
          sortedDates,
          stats,
        });
      });
    });
  }

  render() {
    const { stats, matches, sortedDates } = this.state;
    if (!stats || !matches || !sortedDates) return null;
    return (
      <>
        <div>labas</div>
      </>
    );
  }
}

export default withRouter(PlayerPage);
