create table auth_user(
    id bigserial primary key,
    email varchar(64) not null,
    search_email varchar(64) not null unique,
    password varchar(64) not null
);