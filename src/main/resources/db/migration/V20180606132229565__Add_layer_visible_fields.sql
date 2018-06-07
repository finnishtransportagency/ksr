alter table layer
    add (
        desktop_visible char(1) default '1' not null
            check (desktop_visible in ('0', '1')),
        mobile_visible char(1) default '0' not null
            check (mobile_visible in ('0', '1'))
);
