 alter table layer add background char(1) default '0' not null  check (background in ('1', '0'));
