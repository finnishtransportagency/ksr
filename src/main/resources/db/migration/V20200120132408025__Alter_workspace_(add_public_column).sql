alter table workspace 
    add isPublic char(1) default '0' not null 
        check (isPublic in ('1', '0'));
