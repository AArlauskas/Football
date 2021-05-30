create table points(
    id bigint primary key references auth_user(id) on delete cascade,
    points int not null default 0,
    correct_guesses int not null default 0
)