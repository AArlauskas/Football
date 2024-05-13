import { t } from "@/services/localization/localization";
import GamesIcon from "@/assets/menu-icons/games.svg";
import GuessesIcon from "@/assets/menu-icons/guesses.svg";
import ResultsIcon from "@/assets/menu-icons/results.svg";
import RulesIcon from "@/assets/menu-icons/rules.svg";

export interface IRoute {
  path: string;
  title: string;
  isPrivate: boolean;
  icon?: string;
}

const RoutePaths = {
  LOGIN: "/login",
  REGISTER: "/register",
  GAMES: "/games",
  GUESSES: "/guesses",
  RESULTS: "/results",
  RULES: "/rules",
};

const Routes: IRoute[] = [
  {
    path: RoutePaths.LOGIN,
    title: t("LOG_IN"),
    isPrivate: false,
  },
  {
    path: RoutePaths.REGISTER,
    title: t("REGISTER"),
    isPrivate: false,
  },
  {
    path: RoutePaths.GAMES,
    title: t("GAMES"),
    isPrivate: true,
    icon: GamesIcon,
  },
  {
    path: RoutePaths.GUESSES,
    title: t("GUESSES"),
    isPrivate: true,
    icon: GuessesIcon,
  },
  {
    path: RoutePaths.RESULTS,
    title: t("RESULTS"),
    isPrivate: true,
    icon: ResultsIcon,
  },
  {
    path: RoutePaths.RULES,
    title: t("RULES"),
    isPrivate: true,
    icon: RulesIcon,
  },
];

const getPublicRoutes = (): IRoute[] => {
  return Routes.filter((route) => !route.isPrivate);
};

const getPrivateRoutes = (): IRoute[] => {
  return Routes.filter((route) => route.isPrivate);
};

export { RoutePaths, Routes, getPublicRoutes, getPrivateRoutes };
