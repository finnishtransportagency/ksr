create table layer_group (
    id number(10) primary key,
    name varchar2(50) not null,
    group_order number(9) unique not null
);

create sequence layer_group_seq;

create or replace trigger layer_group_on_insert
    before insert on layer_group
    for each row
begin
    select layer_group_seq.nextval
    into :new.id
    from dual;
end;
