import { Grid } from "@material-ui/core";
import React from "react";
import { getAllGames } from "../../api/Api";
import AdminTable from "../../components/AdminTable/AdminTable";
import TopBar from "../../components/TopBar/TopBar";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    getAllGames()
      .then((response) => {
        this.setState({ data: response.data });
        console.log(response.data);
      })
      .catch(() => console.log("error has occured"));
  }

  handleAdd = (newData) => {
    const { data } = this.state;
    data.push(newData);
    this.setState({ data });
  };

  render() {
    const { data } = this.state;
    if (data === null) return null;
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
          <AdminTable data={data} onAdd={this.handleAdd} />
        </div>
      </Grid>
    );
  }
}

export default AdminPage;
