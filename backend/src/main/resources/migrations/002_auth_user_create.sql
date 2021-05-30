create table auth_user(
    id bigserial primary key,
    email varchar not null,
    search_email varchar not null unique,
    password varchar not null
);