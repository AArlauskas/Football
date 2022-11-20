import { CardContent, Grid, Grow, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { PieChart } from "react-minimal-pie-chart";

const UserCard = ({
  firstname,
  lastname,
  points,
  good,
  bad,
  average,
  ranking,
}) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const data = [];
    if (good) {
      data.push({
        title: "Good",
        value: good,
        color: "rgba(0,255,0,0.3)",
      });
    }

    if (average) {
      data.push({
        title: "Average",
        value: average,
        color: "rgba(255,255,0,0.3)",
      });
    }

    if (bad) {
      data.push({ title: "Bad", value: bad, color: "rgba(255,0,0,0.3)" });
    }
    setPieData(data);
  }, []);
  return (
    <Paper elevation={5}>
      <CardContent direction="column">
        <Grid container style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <Typography variant="h3">
              {firstname} {lastname}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormattedMessage id="POINTS_WITH_POINTS" values={{ points }} />
          </Grid>
          <Grid item xs={6}>
            <FormattedMessage id="PLACE_WITH_RANKING" values={{ ranking }} />
          </Grid>
          <Grow in timeout={3000}>
            <Grid item xs={12}>
              <PieChart
                style={{
                  fontFamily:
                    '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                  fontSize: "8px",
                  width: "60%",
                }}
                animationDuration={1000}
                data={pieData}
                radius={PieChart.defaultProps.radius - 6}
                lineWidth={60}
                animate
                label={({ dataEntry }) => dataEntry.value}
                labelPosition={70}
                labelStyle={{
                  fill: "#000",
                  opacity: 0.75,
                  pointerEvents: "none",
                }}
              />
            </Grid>
          </Grow>
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default UserCard;
