create table user_layer (
  id number(10) primary key,
  name varchar2(50) not null,
  type varchar2(4) not null
    check (type in ('wms', 'wfs', 'mvt', 'wmts', 'agfs')),
  url varchar2(260) not null,
  layers varchar2(4000),
  styles varchar2(4000),
  opacity number(2, 1) default 1.0 not null
    check (opacity between 0.0 and 1.0),
  authentication varchar2(250),
  layer_order number(9) not null,
  min_scale number(9) default 0 not null,
  max_scale number(9) default 23 not null,
  transparent char(1) default '0' not null
    check (transparent in ('0', '1')),
  attribution varchar2(255),
  desktop_visible char(1) default '1' not null
    check (desktop_visible in ('0', '1')),
  mobile_visible char(1) default '0' not null
    check (mobile_visible in ('0', '1')),
  queryable char(1) default '0' not null
    check (queryable in ('0', '1')),
  query_columns query_column_type,
  use_internal_proxy char(1) default '1' not null
    check (use_internal_proxy in ('0', '1')),
  username varchar2(50) not null,
  constraint layer_order_unique unique(username, layer_order),
  constraint name_unique unique(username, name)
);

create sequence user_layer_seq minvalue 10000;
create sequence user_layer_order_seq minvalue 10000;

create or replace trigger user_layer_on_insert
before insert on user_layer
    for each row
begin
select user_layer_seq.nextval
    into :new.id
    from dual;
select user_layer_order_seq.nextval
    into :new.LAYER_ORDER
    from dual;
end;
