create table guess(
    id bigserial primary key,
    author bigint not null references auth_user(id),
    game bigint not null references game(id),
    result1 int null,
    result2 int null,
    submitted timestamp default current_timestamp,
    points int null
)