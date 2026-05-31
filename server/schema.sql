CREATE TYPE user_role AS ENUM ('user','admin');
create table users(
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    hashed_password text not null,
    role user_role DEFAULT 'user',
    created_at timestamp default current_timestamp
)