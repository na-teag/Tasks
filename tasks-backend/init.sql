DROP DATABASE IF EXISTS task;
CREATE DATABASE task;
USE task;

create table user
(
    user_id    int unsigned auto_increment
        primary key,
    email      varchar(255)                       not null,
    username   varchar(255)                       not null,
    password   varchar(255)                       not null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    updated_at datetime                           null on update CURRENT_TIMESTAMP
);

create table task
(
    task_id     int unsigned auto_increment
        primary key,
    user_id     int unsigned                            not null,
    title       varchar(255)                            not null,
    description text                                    null,
    status      ENUM ('pending', 'in progress', 'done') not null,
    created_at  datetime default CURRENT_TIMESTAMP      not null,
    updated_at  datetime                                null on update CURRENT_TIMESTAMP,
    constraint task_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

