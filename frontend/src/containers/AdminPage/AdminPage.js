import { Grid } from "@material-ui/core";
import React from "react";
import AdminTable from "../../components/AdminTable/AdminTable";
import TopBar from "../../components/TopBar/TopBar";
import { mockedPersonalData } from "../../constants/mocked";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.setState({ data: mockedPersonalData });
  }

  handleAdd = (newData) => {
    const { data } = this.state;
    data.push(newData);
    this.setState({ data });
  };

  render() {
    const { data } = this.state;
    return (
      <Grid container direction="column">
        <Grid item>
          <TopBar
            darkMode
            title="Admin's panel"
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
