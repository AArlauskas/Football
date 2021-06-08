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
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return "http://localhost:9000/api";
  }
  return "https://grybeliai.eu/api";
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

export const register = (data) => Axios.post("/auth/register", data);

export const login = (data) => Axios.post("/auth/login", data);

export const logout = () => Axios.post("/auth/logout");

export const getPersonalPoints = () => Axios.get("/points");

export const getPoints = (id) => Axios.get(`/points/${id}`);

export const addGame = (data) => Axios.post("/games", data);

export const updateGame = (data) => Axios.put("/games", data);

export const getAllTeams = () => Axios.get("/teams");

export const addGuess = (data) => Axios.post("/guesses", data);
