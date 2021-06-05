import axios from "axios";

const baseUri = "https://grybeliai.eu/api";

const Axios = axios.create({
  baseURL: baseUri,
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line
export const getAllGames = () => Axios.get("/games");

export const register = (data) => Axios.post("/auth/register", data);

export const login = (data) => Axios.post("/auth/login", data);

export const logout = () => Axios.post("/auth/logout");

export const addGame = (data) => Axios.post("/games", data);

export const getAllTeams = () => Axios.get("/teams");

export const addGuess = (data) => Axios.post("/guesses", data);
