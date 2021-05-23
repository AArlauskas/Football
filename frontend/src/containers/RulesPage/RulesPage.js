import {
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { uefaLogo } from "../../assets";
import TopBar from "../../components/TopBar/TopBar";

class RulesPage extends React.Component {
  render() {
    return (
      <Grid container direction="column" alignItems="center" justify="center">
        <TopBar
          darkMode
          points={420}
          showAvatarAndLogout
          firstName="Aurimas"
          lastName="Arlauskas"
        />
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
                  <img src={uefaLogo} width={75} height={75} alt="uefa logo" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4">Taisyklės</Typography>
                  <Divider style={{ margin: 20, backgroundColor: "black" }} />
                </Grid>
                <Grid item container direction="column" spacing={1}>
                  <Grid item xs={12}>
                    <Typography>
                      1. Varžybų spėjimai turi būti pateikti likus 5 min. iki
                      rungtynių pradžios.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      2. Prasidėjus varžyboms bus matomi visų dalyvių spėjimai.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Taškų skaičiavimas</Typography>
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
                      3. Už teisingai atspėtą rezultatą: <strong>-3</strong>{" "}
                      taškai.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      4. Už teisingai atspėtą rezultatą, kai niekas neatspėjo
                      varžybų baigties: <strong>-7</strong> taškai.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      5. Už įspėtą varžybų baigtį{" "}
                      <em>
                        (atspėta, kuri komanda laimės arba atspėtos lygiosios)
                      </em>
                      : <strong>0</strong> taškų.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      6. Už neįspėtą varžybų baigtį: <strong>+3</strong> taškai.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      7. Už kiekvieną neatspėtą įvartį: <em>papildomas</em>{" "}
                      <strong>+1</strong> taškas.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      8. Dalyvis, laiku nepateikęs spėjimo gauna tiek pat taškų
                      kaip ir blogiausiai spėjęs dalyvis.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      9. Jeigu keli dalyviai turi tiek pat taškų, aukštesnę
                      vietą užema daugiau rezultatų atspėjęs dalyvis.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Taškų skaičiavimo pavyzdys
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
                      10. Varžybos baigėsi rezultatu <strong>2:1</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      11. Dalyvis, spėjęs <strong>2:1</strong> gauna{" "}
                      <strong>-3</strong> taškus <em>(už įspėtą rezultatą)</em>.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      12. Dalyvis, spėjęs <strong>3:0</strong> gauna{" "}
                      <strong>+2</strong> taškus{" "}
                      <em>(už du neįspėtus įvarčius)</em>.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      13. Dalyvis, spėjęs <strong>1:1</strong> gauna{" "}
                      <strong>+4</strong> taškus{" "}
                      <em>(už du neįspėtus įvarčius)</em>.
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
