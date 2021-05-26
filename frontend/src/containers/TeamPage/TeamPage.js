import { Grid } from "@material-ui/core";
import React from "react";
import TeamCard from "../../components/TeamCard/TeamCard";
import TopBar from "../../components/TopBar/TopBar";

class TeamPage extends React.Component {
  render() {
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
        </Grid>
      </>
    );
  }
}

export default TeamPage;
