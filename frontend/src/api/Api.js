import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      dispatch(() => {
        window.localStorage.clear();
        window.location.reload();
      });
    }
    return Promise.reject(error);
  }
);

const getBaseUri = () => {
  // to develop locally you must start nginx with the config in the deployment folder
  // after that start with `npm start` and visit the page at http://localhost:80
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return "http://localhost:80/api";
  }
  return `${window.location.origin}/api`;
};

const Axios = axios.create({
  baseURL: getBaseUri(),
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line
export const getAllGames = () =>
  Axios.get("/games/", { params: { filter: "all" } });

export const getTodayGames = () =>
  Axios.get("/games/guessed", { params: { filter: "today" } });

export const getAllPersonalGames = () =>
  Axios.get("/games/guessed", { params: { filter: "all" } });

export const getAllPlayerGames = (id) =>
  Axios.get("/games/guessed", { params: { filter: "all", user: id } });

export const register = (data) => Axios.post("/auth/register", data);

export const login = (data) => Axios.post("/auth/login", data);

export const logout = () => Axios.post("/auth/logout");

export const getPersonalPoints = () => Axios.get("/points");

export const getPoints = (id) => Axios.get(`/points/${id}`);

export const getPersonalUser = () => Axios.get("/users");

export const getUser = (id) => Axios.get("/users", { params: { user: id } });

export const getMatch = (id) =>
  Axios.get("/games/results", { params: { game: id } });

export const getResults = () => Axios.get("/points/totals");

export const addGame = (data) => Axios.post("/games", data);

export const updateGame = (data) => Axios.put("/games", data);

export const getAllTeams = () => Axios.get("/teams");

export const addGuess = (data) => Axios.post("/guesses", data);

export const getTeam = (teamId) =>
  Axios.get("/teams/games", { params: { code: teamId } });
