-- get all tables
-- SELECT * FROM information_schema.tables where table_schema = 'public';

-- get player with most points
select p.total, u.first_name from points p left join auth_user u on u.id = p.id order by p.total;

-- players with correct_alone
select p.total, u.first_name, p.correct_alone from points p left join auth_user u on u.id = p.id where correct_alone > 0  order by p.correct_alone;

-- players with the most not_given scores
select p.total, u.first_name, p.not_given from points p left join auth_user u on u.id = p.id where p.not_given > 0 order by p.not_given desc;

-- players with most incorrect outcomes
 select p.total, u.first_name, p.incorrect from points p left join auth_user u on u.id = p.id order by p.incorrect desc;

-- players that can guess outcomes
select p.total, u.first_name, p.outcomes from points p left join auth_user u on u.id = p.id order by p.outcomes desc;

-- teams by goals
select t.long_code, sum(g1.result1) + sum(g2.result2) goals from team t left join game g1 on g1.team1_id = t.id left join game g2 on g2.team2_id = t.id where g1.closed is not null and g2.closed is not null group by t.long_code order by goals desc;

-- most succesfull games for guesses
select t1.name team1, t2.name team2,sum(g.points) total_given_points, g.game_id, gm.result1, gm.result2 from guess g left join game gm on gm.id = g.game_id left join team t1 on t1.id = gm.team1_id left join team t2 on t2.id = gm.team2_id where gm.closed  is not null group by g.game_id, t1.name, t2.name, gm.result1, gm.result2 order by total_given_points desc;

-- maximum points for a game per user
select max(g.points), u.first_name from guess g left join auth_user u on u.id = g.user_id  group by u.first_name order by max desc;

--games with most goals
select g.result1 + g.result2 as total_goals_count,  t1.name, t2.name from game g left join team t1 on t1.id = g.team1_id left join team t2 on t2.id = g.team2_id where g.closed is not null order by total_goals_count desc;

--players by guessed goals count
select sum(g.result1 + g.result2) total_guessed_goals, u.first_name from guess g left join auth_user u on u.id = g.user_id group by u.first_name order by total_guessed_goals desc;

