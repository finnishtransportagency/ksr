create table workspace (
    id number(10) primary key,
    name varchar2(200) not null,
    username varchar2(50) not null,
    scale number(9) not null,
    center_longitude number(9) not null,
    center_latitude number(9) not null,
    updated timestamp default current_timestamp not null,
    unique (name, username)
);

create sequence workspace_seq;

create or replace trigger workspace_on_insert
    before insert on workspace
    for each row
begin
    select workspace_seq.nextval
    into :new.id
    from dual;
end;
