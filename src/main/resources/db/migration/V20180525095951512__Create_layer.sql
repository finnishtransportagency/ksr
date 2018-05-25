create table layer (
    id number(10) primary key,
    name varchar2(50) not null,
    type varchar2(4) not null
        check (type in ('wms', 'wfs', 'mvt', 'wmts', 'agfs')),
    url varchar2(260) not null,
    layers varchar2(4000),
    styles varchar2(4000),
    visible char(1) default '0' not null
        check (visible in ('0', '1')),
    opacity number(2, 1) default 1.0 not null
        check (opacity between 0.0 and 1.0),
    authentication varchar2(250),
    layer_order number(9) unique not null,
    min_zoom number(9) default 0 not null,
    max_zoom number(9) default 23 not null,
    layer_group_id number(10) references layer_group(id)
);

create sequence layer_seq;

create or replace trigger layer_on_insert
    before insert on layer
    for each row
begin
    select layer_seq.nextval
    into :new.id
    from dual;
end;
