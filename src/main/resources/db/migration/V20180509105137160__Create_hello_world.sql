create table hello_world (
    id number(10) not null,
    message varchar2(100) not null
);

alter table hello_world
    add (
        constraint hello_world_pk primary key (id)
    );

create sequence hello_world_seq;

create or replace trigger hello_world_on_insert
    before insert on hello_world
    for each row
begin
    select hello_world_seq.nextval
    into :new.id
    from dual;
end;
