create table game(
    id bigserial primary key,
    team1 bigint not null references team(id),
    team2 bigint not null references team(id),
    game_date timestamp not null,
    game_closed timestamp null,
    game_ended timestamp null,
    result1 int null,
    result2 int null,
    game_type varchar not null default 'regular'
)