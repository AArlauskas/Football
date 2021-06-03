import { Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { addGame, getAllGames, getAllTeams } from "../../api/Api";
import AdminTable from "../../components/AdminTable/AdminTable";
import TopBar from "../../components/TopBar/TopBar";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      games: null,
    };
  }

  componentDidMount() {
    getAllTeams().then((teamsResponse) => {
      const teams = this.mapTeams(teamsResponse.data);
      this.setState({ teams });
      this.getGames();
    });
  }

  getGames = () => {
    getAllGames().then((response) => {
      this.setState({ games: response.data });
    });
  };

  mapTeams = (teamData) => {
    const result = {};
    teamData.forEach((team) => {
      result[team.code] = team.name;
    });
    return result;
  };

  handleAdd = (newData) => {
    const { date, time } = newData;
    const adjustedDate = moment(date).format("YYYY-MM-DD");
    const adjustedTime = moment(time).format("HH:mm");
    const data = {
      team1: newData.team1,
      team2: newData.team2,
      date: adjustedDate,
      time: adjustedTime,
    };
    addGame(data).then(() => this.getGames());
  };

  render() {
    const { games, teams } = this.state;
    if (games === null || teams === null) return null;
    return (
      <Grid container direction="column">
        <Grid item>
          <TopBar
            darkMode
            points={420}
            showAvatarAndLogout
            firstName="Aurimas"
            lastName="Arlauskas"
          />
        </Grid>
        <div style={{ margin: 20 }}>
          <AdminTable teams={teams} data={games} onAdd={this.handleAdd} />
        </div>
      </Grid>
    );
  }
}

export default AdminPage;
