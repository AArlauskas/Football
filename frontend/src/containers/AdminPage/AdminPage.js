import { Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { addGame, getAllGames, getAllTeams, updateGame } from "../../api/Api";
import AdminTable from "../../components/AdminTable/AdminTable";
import TopBar from "../../components/TopBar/TopBar";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      games: [],
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
      t1: { code: newData.team1 },
      t2: { code: newData.team2 },
      date: adjustedDate,
      time: adjustedTime,
    };
    addGame(data).then(() => this.getGames());
  };

  handleUpdate = (newData) => {
    console.log(newData);
    const { date, time } = newData;
    const adjustedDate = moment(date).format("YYYY-MM-DD");
    const adjustedTime = time;
    const data = {
      id: newData.id,
      t1: { code: newData.t1.code },
      t2: { code: newData.t2.code },
      date: adjustedDate,
      time: adjustedTime,
      state: newData.state,
    };
    if (newData.state === "finished") {
      data.result = {
        goals1: newData.goals1,
        goals2: newData.goals2,
      };
    }
    updateGame(data).then(() => this.getGames());
  };

  render() {
    const { games, teams } = this.state;
    if (teams === null) return null;
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
          <AdminTable
            teams={teams}
            onUpdate={this.handleUpdate}
            data={games}
            onAdd={this.handleAdd}
          />
        </div>
      </Grid>
    );
  }
}

export default AdminPage;
