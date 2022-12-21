
-- get player with most points
-- Žaidėjai pagal taškų skaičių
select p.total, u.first_name from points p left join auth_user u on u.id = p.id order by p.total;

-- players with correct_alone
-- Žaidėjai daugiausia kartų gavę -7 taškus
select p.total, u.first_name, p.correct_alone from points p left join auth_user u on u.id = p.id where correct_alone > 0  order by p.correct_alone;

-- players with the most not_given scores
-- Žaidėjai kurie daugiausia kartų nepateikė rezultato
select p.total, u.first_name, p.not_given from points p left join auth_user u on u.id = p.id where p.not_given > 0 order by p.not_given desc;

-- players with most incorrect outcomes
-- Žaidėjai kurie pateikė daugiausia neteisingų rezultatų
 select p.total, u.first_name, p.incorrect from points p left join auth_user u on u.id = p.id order by p.incorrect desc;

-- players by the number of correct outcomes
-- Žaidėjai kurie atspėjo daugiausia baigčių
select p.total, u.first_name, p.outcomes from points p left join auth_user u on u.id = p.id order by p.outcomes desc;

-- teams by goals
-- Komandos pagal įspirtus įvarčius
select t.long_code, sum(g1.result1) + sum(g2.result2) goals from team t left join game g1 on g1.team1_id = t.id left join game g2 on g2.team2_id = t.id where g1.closed is not null and g2.closed is not null group by t.long_code order by goals desc;

-- most succesfull games for guesses
-- Žaidimai kurie buvo daugiausiai atspėti (Bendrai surinkta mažiausiai taškų)
select t1.name team1, t2.name team2,sum(g.points) total_given_points, g.game_id, gm.result1, gm.result2 from guess g left join game gm on gm.id = g.game_id left join team t1 on t1.id = gm.team1_id left join team t2 on t2.id = gm.team2_id where gm.closed  is not null group by g.game_id, t1.name, t2.name, gm.result1, gm.result2 order by total_given_points desc;

-- maximum points for a game per user
-- Žaidėjai kurie surinko daugiausia taškų viename žaidime
select max(g.points), u.first_name from guess g left join auth_user u on u.id = g.user_id  group by u.first_name order by max desc;

--games with most goals
-- Žaidimai didėjimo tvarka pagal įvarčių skaičių
select g.result1 + g.result2 as total_goals_count,  t1.name, t2.name from game g left join team t1 on t1.id = g.team1_id left join team t2 on t2.id = g.team2_id where g.closed is not null order by total_goals_count desc;

--players by guessed goals count
-- Žaidėjai kurie spėjo daugiausia įvarčių
select sum(g.result1 + g.result2) total_guessed_goals, u.first_name from guess g left join auth_user u on u.id = g.user_id group by u.first_name order by total_guessed_goals desc;

--players that guessed tie the most
-- Žaidėjai, kurie daugiausia spėjo lygiasias
select count(1), u.first_name from guess g left join auth_user u on u.id = g.user_id where g.result1 = g.result2 group by u.id order by count desc;

--players that guessed 2:1 the most
-- Žaidėjai, kurie daugiausia spėjo 2:1
select count(1), u.first_name from guess g left join auth_user u on u.id = g.user_id where (g.result1 = 1 and g.result2 = 2) or (g.result1 = 2 and g.result2 = 1) group by u.id order by count desc;