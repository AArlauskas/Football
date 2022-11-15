import { Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { withRouter } from "react-router";
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
    const { history } = this.props;
    getAllTeams()
      .then((teamsResponse) => {
        const teams = this.mapTeams(teamsResponse.data);
        this.setState({ teams });
        this.getGames();
      })
      .catch(() => history.push("/home"));
  }

  getGames = () => {
    const { history } = this.props;
    getAllGames()
      .then((response) => {
        this.setState({ games: response.data });
      })
      .catch(() => history.push("/home"));
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
    const data = {
      t1: { code: newData.team1 },
      t2: { code: newData.team2 },
      date: adjustedDate,
      time,
    };
    addGame(data).then(() => this.getGames());
  };

  handleUpdate = (newData) => {
    const { date, time } = newData;
    const adjustedDate = moment(date).format("YYYY-MM-DD");
    const data = {
      id: newData.id,
      t1: { code: newData.team1 },
      t2: { code: newData.team2 },
      date: adjustedDate,
      time,
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

export default withRouter(AdminPage);
