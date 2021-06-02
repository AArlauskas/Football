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

export const register = (data) => Axios.post("/register", data);

export const login = (data) => Axios.post("/login", data);

export const logout = () => Axios.post("/logout");

export const addGame = (data) => Axios.post("/", data);
