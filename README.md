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


Dokumentacijos nespėjau atnaujinti, bet pavyzdžiai:

POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
"email":  "someone@admin.lt",
"password": "hunter2"
}

###
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
"email": "someone@admin.lt",
"password": "hunter2",
"firstName": "Aivaras",
"lastName": "Saulius"
}

###
GET http://localhost:8080/api/games
Accept: application/json


###
POST localhost:8080/api/games
Content-Type: application/json

{
"team1": "DNK",
"team2": "ENG",
"date": "2021-06-02",
"time": "19:00"
}

