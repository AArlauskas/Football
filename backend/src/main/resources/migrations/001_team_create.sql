create table team(id bigserial primary key, code_short char(2) unique, code_long char(3) unique, name varchar unique);