const mockedPersonalData = [
  {
    id: 1,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Lietuva",
    team2Name: "Latvija",
    score1: 1,
    score2: 2,
    guess1: 5,
    guess2: 7,
    points: 12,
    started: true,
    variant: "good",
  },
  {
    id: 2,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Vokietija",
    team2Name: "Estija",
    score1: 1,
    score2: 2,
    guess1: 5,
    guess2: 7,
    points: 12,
    started: false,
    variant: "good",
  },
  {
    id: 3,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Prancuzija",
    team2Name: "Makedonija",
    score1: null,
    score2: null,
    guess1: null,
    guess2: null,
    points: null,
    started: false,
    variant: "average",
  },
  {
    id: 4,
    date: "2020-05-14",
    time: "19:00",
    team1Name: "Italija",
    team2Name: "Ispanija",
    score1: 3,
    score2: 2,
    guess1: null,
    guess2: null,
    points: 15,
    started: false,
    variant: "bad",
  },
  {
    id: 5,
    date: "2020-05-14",
    time: "19:00",
    team1Name: "Azerbaijanas",
    team2Name: "Dramblio kaulo krantas",
    score1: 1,
    score2: 2,
    guess1: 5,
    guess2: 7,
    points: 12,
    started: false,
    variant: "bad",
  },
  {
    id: 6,
    date: "2020-05-17",
    time: "19:00",
    team1Name: "Norvegija",
    team2Name: "Islandija",
    score1: 1,
    score2: 2,
    guess1: 5,
    guess2: 7,
    points: 12,
    started: false,
    variant: "bad",
  },
  {
    id: 7,
    date: "2020-05-19",
    time: "19:00",
    team1Name: "Valakija",
    team2Name: "Barovija",
    score1: 1,
    score2: 2,
    guess1: 5,
    guess2: 7,
    points: 12,
    started: false,
    variant: "bad",
  },
];

const mockedHomeData = [
  {
    id: 1,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Lietuva",
    team2Name: "Latvija",
    score1: null,
    score2: null,
    guess1: 5,
    guess2: 7,
    points: null,
    started: true,
    variant: null,
  },
  {
    id: 10,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Lietuva",
    team2Name: "Latvija",
    score1: null,
    score2: null,
    guess1: 5,
    guess2: 7,
    points: null,
    started: true,
    variant: null,
  },
  {
    id: 2,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Vokietija",
    team2Name: "Estija",
    score1: 4,
    score2: 6,
    guess1: 5,
    guess2: 7,
    points: 6,
    started: true,
    variant: "average",
  },
  {
    id: 3,
    date: "2020-05-12",
    time: "19:00",
    team1Name: "Prancuzija",
    team2Name: "Makedonija",
    score1: null,
    score2: null,
    guess1: null,
    guess2: null,
    points: null,
    started: false,
    variant: null,
  },
  {
    id: 4,
    date: "2020-05-14",
    time: "19:00",
    team1Name: "Italija",
    team2Name: "Ispanija",
    score1: null,
    score2: null,
    guess1: null,
    guess2: null,
    points: null,
    started: false,
    variant: null,
  },
  {
    id: 5,
    date: "2020-05-14",
    time: "19:00",
    team1Name: "Azerbaijanas",
    team2Name: "Dramblio kaulo krantas",
    score1: null,
    score2: null,
    guess1: 5,
    guess2: 7,
    points: null,
    started: false,
    variant: null,
  },
  {
    id: 6,
    date: "2020-05-17",
    time: "19:00",
    team1Name: "Norvegija",
    team2Name: "Islandija",
    score1: null,
    score2: null,
    guess1: 5,
    guess2: 7,
    points: null,
    started: false,
    variant: null,
  },
  {
    id: 7,
    date: "2020-05-19",
    time: "19:00",
    team1Name: "Valakija",
    team2Name: "Barovija",
    score1: null,
    score2: null,
    guess1: 5,
    guess2: 7,
    points: null,
    started: false,
    variant: null,
  },
];

const MockedMatch = {
  date: "2021-04-20",
  team1: "Lithuania",
  team2: "Belgium",
  score1: 1,
  score2: 3,
  results: [
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "good",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "average",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "good",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "average",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "good",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "average",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: null,
      guess2: null,
      points: 5,
      variant: "good",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
    {
      firstname: "Aurimas",
      lastname: "Arlauskas",
      guess1: 1,
      guess2: 3,
      points: 5,
      variant: "bad",
    },
  ],
};

/* eslint-disable import/prefer-default-export */
export { mockedHomeData };
export { mockedPersonalData };
export { MockedMatch };
