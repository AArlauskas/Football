import {
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { uefaLogo } from "../../assets";
import TopBar from "../../components/TopBar/TopBar";

class RulesPage extends React.Component {
  render() {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{
          height: "100vh",
        }}
      >
        <TopBar darkMode />
        <Grid item xs={11} sm={10} style={{ paddingTop: 20 }}>
          <Paper elevation={5}>
            <CardContent direction="column">
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={12}>
                  <img src={uefaLogo} width={150} alt="uefa logo" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4">
                    <FormattedMessage id="POINTS" />
                  </Typography>
                  <Divider style={{ margin: 20, backgroundColor: "black" }} />
                </Grid>
                <Grid item container direction="column" spacing={1}>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_1" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_2" />
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    <FormattedMessage id="CALCULATION_OF_POINTS" />
                  </Typography>
                  <Divider />
                </Grid>
                <Grid
                  item
                  container
                  direction="column"
                  spacing={1}
                  alignItems="flex-start"
                >
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_3" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_4" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_5" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_6" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_7" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_8" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_9" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_10" />
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    <FormattedMessage id="EXAMPLE_OF_SCORING" />
                  </Typography>
                  <Divider />
                </Grid>
                <Grid
                  container
                  direction="column"
                  spacing={1}
                  alignItems="flex-start"
                >
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_11" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_12" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_13" />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <FormattedMessage id="RULE_14" />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default RulesPage;
