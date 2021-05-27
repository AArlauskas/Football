import axios from "axios";

const baseUri = "https:/grybeliai.eu/api";

const Axios = axios.create({
  baseURL: baseUri,
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line
export const getAllGames = () => Axios.get("/games");
