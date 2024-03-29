import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginPage from "./containers/LoginPage/LoginPage";
import RegisterPage from "./containers/RegisterPage/RegisterPage";
import RulesPage from "./containers/RulesPage/RulesPage";
import HomePage from "./containers/HomePage/HomePage";
import MatchPage from "./containers/MatchPage/MatchPage";
import AdminPage from "./containers/AdminPage/AdminPage";
import TeamPage from "./containers/TeamPage/TeamPage";
import PersonalPage from "./containers/PersonalPage/PersonalPage";
import PlayerPage from "./containers/PlayerPage/PlayerPage";
import ResultsPage from "./containers/ResultsPage/ResultsPage";
import theme from "./theme";
import TranslationsProvider from "./components/TranslationsProvider/TranslationsProvider";
import LOCALES from "./translations/locales";
import LocalizationContext from "./components/TranslationsProvider/TranslationContext";
import { IS_REGISTER_ENABLED, IS_STATISTICS_ENABLED } from "./constants";

const id = window.localStorage.getItem("id");
const isAdmin = window.localStorage.getItem("isAdmin") === "true";

function App() {
  const [currentLanguage, setCurrentLanguage] = useState(LOCALES.LITHUANIAN);

  const onLanguageChange = (language) => {
    setCurrentLanguage(language);
    window.sessionStorage.setItem("language", language);
  };

  useEffect(() => {
    if (window.sessionStorage.getItem("language")) {
      setCurrentLanguage(window.sessionStorage.getItem("language"));
    }
  }, []);

  return (
    <Router>
      <LocalizationContext.Provider value={[currentLanguage, onLanguageChange]}>
        <ThemeProvider theme={theme}>
          <TranslationsProvider locale={currentLanguage}>
            <CssBaseline>
              {id === null ? (
                <Switch>
                  <Route exact path="/">
                    <LoginPage />
                  </Route>
                  {IS_REGISTER_ENABLED && (
                    <Route exact path="/register">
                      <RegisterPage />
                    </Route>
                  )}
                  <Route>
                    <Redirect to="/" />
                  </Route>
                </Switch>
              ) : (
                <Switch>
                  <Route exact path="/rules">
                    <RulesPage />
                  </Route>
                  <Route exact path="/home">
                    <HomePage />
                  </Route>
                  <Route path="/match/:gameId">
                    <MatchPage />
                  </Route>
                  <Route exact path="/personal">
                    <PersonalPage />
                  </Route>
                  <Route path="/player/:userId">
                    <PlayerPage />
                  </Route>
                  <Route path="/team/:teamId">
                    <TeamPage />
                  </Route>
                  <Route exact path="/results">
                    <ResultsPage />
                  </Route>
                  {isAdmin && (
                    <Route exact path="/admin">
                      <AdminPage />
                    </Route>
                  )}
                  {IS_STATISTICS_ENABLED && (
                    <Route exact path="/statistics_2022_test.txt" />
                  )}
                  <Route>
                    <Redirect to="/home" />
                  </Route>
                </Switch>
              )}
            </CssBaseline>
          </TranslationsProvider>
        </ThemeProvider>
      </LocalizationContext.Provider>
    </Router>
  );
}

export default App;
