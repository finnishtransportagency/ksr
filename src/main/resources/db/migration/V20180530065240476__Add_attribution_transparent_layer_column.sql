alter table layer
    add (
        transparent char(1) default '0' not null
            check (transparent in ('0', '1')),
        attribution varchar2(255)
);
