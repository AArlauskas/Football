const mockedPersonalData = [
  {
    id: 1,
    date: "2020-05-12",
    time: "19:00",
    team1: 5,
    team2: 17,
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
    team1: 14,
    team2: 8,
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
    team1: 6,
    team2: 3,
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
    team1: 1,
    team2: 3,
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
    team1: 14,
    team2: 12,
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
    team1: 17,
    team2: 23,
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
    team1: 2,
    team2: 21,
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
    team1: 6,
    team2: 4,
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
    team1: 3,
    team2: 8,
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
    team1: 4,
    team2: 18,
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
    team1: 12,
    team2: 15,
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
    team1: 9,
    team2: 10,
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
    team1: 22,
    team2: 23,
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
    team1: 12,
    team2: 17,
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
    team1: 0,
    team2: 14,
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
  team1: 1,
  team2: 16,
  score1: null,
  score2: null,
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

// const temp = {
//   games = [
//     {
//       id: 0,
//       score1,
//       score2
//     },
//     {

//     }
//   ],
//   users = [
//     {
//       id,
//       name,
//       score,
//       guesses = [
//         {
//           gameId = 0,
//           guess1,
//           guess2,
//           score,
//           variant?
//         }
//       ]
//     }
//   ]
// }

/* eslint-disable import/prefer-default-export */
export { mockedHomeData };
export { mockedPersonalData };
export { MockedMatch };