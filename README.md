Requested Endpoints: 
1. CRUD for /admin. Fetching all matches without user results. (GET is done)
2. /home. Fetching user's all upcoming matches including today with possible results and game states.
3. Getting user's current number of points.
4. /player. For current user with all previous guesses and results and upcoming matches
5. /player For a user visiting another user's page to see all of the made guesses and match results.
6. /team Similar to 5, but filtered according to the team identifier.
7. Making a guess endpoint.
8. /match. Get results of a match that has either ended or been closed(only see guesses)
9. Login
10. Register
11. ???Forgot paswword???
12. ???Logout endpoint???
13. /results to fetch all of the guesses and all of the matches that have been closed or finished

Known issue that is similar to ours:
https://stackoverflow.com/questions/62654250/react-and-nginx-messing-up-urls-when-using-axios-incorrect-api-calls


2021-06-08: new apis to get player score table (ordered) and game guesses with points

GET http://localhost:8080/api/version
Accept: application/json

<> 2021-06-07T230712.200.json
###
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
"email": "someone@admin.lt",
"password": "hunter2",
"firstName": "Aivaras",
"lastName": "Saulius"
}

<> 2021-06-07T230718.200.json
###
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
"email":  "someone@admin.lt",
"password": "hunter2"
}

<> 2021-06-07T230721.200.json

###
GET http://localhost:8080/api/teams
Accept: application/json

<> 2021-06-07T230725.200.json
###
POST localhost:8080/api/games
Content-Type: application/json

{
"t1": {"code":  "DNK"},
"t2": {"code":  "ENG"},
"date": "2021-06-02",
"time": "19:00"
}

###
GET http://localhost:8080/api/games
Accept: application/json

<> 2021-06-07T231111.200.json
<> 2021-06-07T230856.200.json
###

POST http://localhost:8080/api/guesses
Content-Type: application/json

{
"gameId": 1,
"result": {
"goals1": 2,
"goals2": 1
}
}

<> 2021-06-07T230904.200.json

###
GET http://localhost:8080/api/games/guessed?user=1&filter=all
Accept: application/json

###

PUT http://localhost:8080/api/games
Content-Type: application/json

{
"id": 1,
"t1": {
"code": "DNK"
},
"t2": {
"code": "ENG"
},
"date": "2021-06-02",
"time": "19:00",
"state": "closed",
"result": null
}

<> 2021-06-07T231139.200.json

###
PUT http://localhost:8080/api/games
Content-Type: application/json

{
"id": 1,
"t1": {
"code": "DNK"
},
"t2": {
"code": "ENG"
},
"date": "2021-06-02",
"time": "19:00",
"state": "finished",
"result": {
"goals1": 2,
"goals2": 1
}
}

<> 2021-06-07T231202.500.json

###
GET http://localhost:8080/api/points
Accept: application/json

<> 2021-06-07T231034.200.json

###
GET http://localhost:8080/api/points/totals
Accept: application/json


###
GET http://localhost:8080/api/games/results?game=1
Accept: application/json

